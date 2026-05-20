import axios, { AxiosError } from 'axios';
import {
  analyticsFallback,
  applicationsFallback,
  aiLogsFallback,
  dashboardFallback,
  tasksFallback,
  workflowFallback,
} from '../utils/demoData';

const meta = import.meta as ImportMeta & { env: Record<string, string | undefined> };
const apiRoot = meta.env?.VITE_API_URL || meta.env?.VITE_API_BASE_URL || 'http://localhost:5000';
const baseURL = apiRoot.endsWith('/api') ? apiRoot : `${apiRoot.replace(/\/$/, '')}/api`;

const client = axios.create({
  baseURL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('finova_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('finova_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

type CacheEntry = { data: unknown; expires: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30_000;

const getCached = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
};

const setCache = (key: string, data: unknown) => {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
};

export const clearApiCache = () => cache.clear();

const emitDataChanged = () => {
  window.dispatchEvent(new CustomEvent('finova:data-changed'));
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 1): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((r) => setTimeout(r, 500));
    return withRetry(fn, retries - 1);
  }
};

/** Prefer live API data; use demo fallback only when the request fails without an HTTP response (offline / wrong host). */
const withNetworkFallback = async <T>(
  key: string,
  request: () => Promise<{ data: T }>,
  fallback: T,
  skipCache = false
): Promise<{ data: T }> => {
  if (!skipCache) {
    const cached = getCached<T>(key);
    if (cached) return { data: cached };
  }

  try {
    const response = await withRetry(request);
    if (response?.data === undefined) throw new Error('Missing data');
    setCache(key, response.data);
    return response;
  } catch (e) {
    const ax = e as AxiosError;
    if (ax.response?.status === 401) throw e;
    if (ax.response) throw e;
    const stale = getCached<T>(key);
    if (stale) return { data: stale };
    return { data: fallback };
  }
};

export const loginRequest = (payload: { email: string; password: string }) =>
  withRetry(() => client.post('/auth/login', payload));

export const registerRequest = (payload: { name: string; email: string; password: string }) =>
  withRetry(() => client.post('/auth/register', payload));

export const fetchDashboard = (opts?: { skipCache?: boolean }) =>
  withNetworkFallback('dashboard', () => client.get('/analytics/dashboard'), dashboardFallback, opts?.skipCache);

export const fetchApprovalAnalytics = (opts?: { skipCache?: boolean }) =>
  withNetworkFallback('analytics', () => client.get('/analytics/approval'), analyticsFallback, opts?.skipCache);

export const fetchApplications = (opts?: { skipCache?: boolean }) =>
  withNetworkFallback('applications', () => client.get('/applications'), applicationsFallback, opts?.skipCache);

export const createApplication = async (payload: Record<string, unknown>) => {
  const response = await client.post('/applications', payload);
  cache.delete('applications');
  cache.delete('dashboard');
  cache.delete('workflow');
  cache.delete('analytics');
  cache.delete('tasks');
  cache.delete('ai-logs');
  emitDataChanged();
  return response;
};

export const fetchWorkflowHistory = (opts?: { skipCache?: boolean }) =>
  withNetworkFallback('workflow', () => client.get('/workflow/history'), workflowFallback, opts?.skipCache);

export const fetchTasks = (opts?: { skipCache?: boolean }) =>
  withNetworkFallback('tasks', () => client.get('/workflow/tasks'), tasksFallback, opts?.skipCache);

export const updateTask = async (id: string, payload: Record<string, unknown>) => {
  const response = await client.patch(`/workflow/tasks/${id}`, payload);
  cache.delete('tasks');
  cache.delete('dashboard');
  cache.delete('analytics');
  emitDataChanged();
  return response;
};

export const fetchAiLogs = (opts?: { skipCache?: boolean }) =>
  withNetworkFallback('ai-logs', () => client.get('/analytics/ai-logs'), aiLogsFallback, opts?.skipCache);

export default client;
