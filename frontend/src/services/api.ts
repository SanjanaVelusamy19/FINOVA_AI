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
  timeout: 12000,
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
const CACHE_TTL_MS = 45_000;

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

const withRetry = async <T>(fn: () => Promise<T>, retries = 1): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((r) => setTimeout(r, 400));
    return withRetry(fn, retries - 1);
  }
};

const withDataFallback = async <T>(key: string, request: () => Promise<{ data: T }>, fallback: T): Promise<{ data: T }> => {
  const cached = getCached<T>(key);
  if (cached) return { data: cached };

  try {
    const response = await withRetry(request);
    if (response?.data === undefined) throw new Error('Missing data');
    setCache(key, response.data);
    return response;
  } catch {
    const stale = getCached<T>(key);
    if (stale) return { data: stale };
    return { data: fallback };
  }
};

export const loginRequest = (payload: { email: string; password: string }) =>
  withRetry(() => client.post('/auth/login', payload));

export const registerRequest = (payload: { name: string; email: string; password: string }) =>
  withRetry(() => client.post('/auth/register', payload));

export const fetchDashboard = () =>
  withDataFallback('dashboard', () => client.get('/analytics/dashboard'), dashboardFallback);

export const fetchApprovalAnalytics = () =>
  withDataFallback('analytics', () => client.get('/analytics/approval'), analyticsFallback);

export const fetchApplications = () =>
  withDataFallback('applications', () => client.get('/applications'), applicationsFallback);

export const createApplication = async (payload: Record<string, unknown>) => {
  const response = await client.post('/applications', payload);
  cache.delete('applications');
  cache.delete('dashboard');
  cache.delete('workflow');
  cache.delete('ai-logs');
  return response;
};

export const fetchWorkflowHistory = () =>
  withDataFallback('workflow', () => client.get('/workflow/history'), workflowFallback);

export const fetchTasks = () => withDataFallback('tasks', () => client.get('/workflow/tasks'), tasksFallback);

export const updateTask = async (id: string, payload: Record<string, unknown>) => {
  const response = await client.patch(`/workflow/tasks/${id}`, payload);
  cache.delete('tasks');
  cache.delete('dashboard');
  return response;
};

export const fetchAiLogs = () =>
  withDataFallback('ai-logs', () => client.get('/analytics/ai-logs'), aiLogsFallback);

export default client;
