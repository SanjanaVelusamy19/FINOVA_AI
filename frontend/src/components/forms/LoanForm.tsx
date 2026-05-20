import { useMemo, useState } from 'react';
import { createApplication } from '../../services/api';
import { motion } from 'framer-motion';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const DEFAULT_INCOME = 800000;
const DEFAULT_LOAN = 300000;

const normalizeAadhaar = (v: string) => v.replace(/\D/g, '');
const normalizePan = (v: string) => v.replace(/\s/g, '').toUpperCase();

const analysisSummary = (values: Record<string, string | string[]>) => {
  const income = Number(values['income'] || 0) || DEFAULT_INCOME;
  const loanAmount = Number(values['loanAmount'] || 0) || DEFAULT_LOAN;
  const ratio = income > 0 ? Math.round((loanAmount / income) * 100) : 0;
  const score = ratio > 70 ? 78 : ratio > 55 ? 62 : 48;
  const suggestedDecision = score > 65 ? 'approve' : 'review';
  const riskSummary = score > 65
    ? 'AI detects strong credit capacity with clean documentation and moderate risk exposure.'
    : 'The application requires manual review due to ratio and documentation checks.';
  return {
    riskScore: score,
    suggestedDecision,
    riskSummary,
    missingDocuments: ratio > 65 ? ['Address Proof'] : [],
  };
};

type LoanFormProps = { onSubmitted?: () => void | Promise<void> };

export const LoanForm = ({ onSubmitted }: LoanFormProps) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customerName: '',
    panNumber: '',
    aadhaarNumber: '',
    income: '',
    loanAmount: '',
    documents: [] as string[],
  });
  const [rawUpload, setRawUpload] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const preview = useMemo(() => analysisSummary(form), [form]);

  const inputClass = 'mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/60';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const parsed = event.target.value.split(',').map((item) => item.trim()).filter(Boolean);
    setRawUpload(event.target.value);
    setForm((prev) => ({ ...prev, documents: parsed }));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files).map((file) => file.name);
    const combined = [...form.documents, ...files];
    setForm((prev) => ({ ...prev, documents: combined }));
    setRawUpload((prev) => `${prev ? `${prev}, ` : ''}${files.join(', ')}`);
  };

  const validateIdentity = (): boolean => {
    if (!form.customerName.trim()) {
      setError('Applicant name is required.');
      return false;
    }
    const aadhaar = normalizeAadhaar(form.aadhaarNumber);
    if (aadhaar.length !== 12) {
      setError('Aadhaar must be exactly 12 digits.');
      return false;
    }
    const pan = normalizePan(form.panNumber);
    if (!PAN_REGEX.test(pan)) {
      setError('Invalid PAN format. Use format ABCDE1234F.');
      return false;
    }
    return true;
  };

  const submitPayload = () => {
    const income = form.income ? Number(form.income) : DEFAULT_INCOME;
    const loanAmount = form.loanAmount ? Number(form.loanAmount) : DEFAULT_LOAN;
    const docs = form.documents.length > 0 ? form.documents : ['PAN Card', 'Aadhaar Card'];
    return {
      customerName: form.customerName.trim(),
      panNumber: normalizePan(form.panNumber),
      aadhaarNumber: normalizeAadhaar(form.aadhaarNumber),
      income,
      loanAmount,
      documents: docs,
    };
  };

  const runSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await createApplication(submitPayload());
      setSuccess('Application submitted successfully. FINOVA AI completed risk analysis and updated your pipeline.');
      setForm({ customerName: '', panNumber: '', aadhaarNumber: '', income: '', loanAmount: '', documents: [] });
      setRawUpload('');
      setStep(1);
      await onSubmitted?.();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax?.response?.data?.message || 'Unable to submit application. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!validateIdentity()) return;
    await runSubmit();
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!validateIdentity()) return;
    }
    if (step === 2 && (!form.income || !form.loanAmount)) {
      setError('Please enter income and loan amount.');
      return;
    }
    setStep((prev) => Math.min(3, prev + 1));
  };

  const handleBack = () => setStep((prev) => Math.max(1, prev - 1));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateIdentity()) return;
    if (!form.income || !form.loanAmount) {
      setError('Please enter income and loan amount before final submit.');
      return;
    }
    await runSubmit();
  };

  return (
    <motion.form onSubmit={handleSubmit} layout className="glass-card space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-200/75">Loan onboarding</p>
          <h2 className="text-2xl font-semibold text-white">Smart loan application</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
          Step {step} of 3
        </div>
      </div>

      {error && <div className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
      {success && <div className="rounded-3xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">{success}</div>}

      {step === 1 && (
        <div className="grid gap-4">
          <label className="block text-sm text-slate-300">
            Applicant name
            <input name="customerName" value={form.customerName} onChange={handleChange} className={inputClass} placeholder="e.g. Priya Nair" autoComplete="name" />
          </label>
          <label className="block text-sm text-slate-300">
            Aadhaar number (12 digits)
            <input name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} className={inputClass} placeholder="123412341234" inputMode="numeric" maxLength={14} autoComplete="off" />
          </label>
          <label className="block text-sm text-slate-300">
            PAN number
            <input name="panNumber" value={form.panNumber} onChange={handleChange} className={inputClass} placeholder="ABCDE1234F" autoComplete="off" maxLength={10} />
          </label>
          <button
            type="button"
            disabled={loading}
            onClick={handleQuickSubmit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:from-cyan-300 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                Processing…
              </>
            ) : (
              'Submit & analyze application'
            )}
          </button>
          <p className="text-center text-xs text-slate-500">Uses default income and loan assumptions unless you continue to add full financial details.</p>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4">
          <label className="block text-sm text-slate-300">
            Annual income
            <input name="income" type="number" value={form.income} onChange={handleChange} className={inputClass} placeholder="₹ 1,200,000" />
          </label>
          <label className="block text-sm text-slate-300">
            Requested loan amount
            <input name="loanAmount" type="number" value={form.loanAmount} onChange={handleChange} className={inputClass} placeholder="₹ 500,000" />
          </label>
          <label className="block text-sm text-slate-300">
            Upload documents
            <textarea value={rawUpload} onChange={handleTextChange} rows={3} className={`${inputClass} resize-none`} placeholder="PAN Card, Aadhaar Card, Bank Statement" />
          </label>
          <div
            className="rounded-3xl border border-dashed border-white/10 bg-slate-900/80 p-5 text-slate-400 transition hover:border-cyan-400/60"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <p className="text-sm">Drag & drop documents here or paste filenames.</p>
            <p className="mt-2 text-xs text-slate-500">Supported formats: PAN, Aadhaar, Bank Statement, Income Proof.</p>
            {form.documents.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {form.documents.map((doc) => (
                  <span key={doc} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{doc}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Risk score</p>
              <p className="mt-3 text-4xl font-semibold text-white">{preview.riskScore}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">AI recommendation</p>
              <p className="mt-3 text-4xl font-semibold text-white">{preview.suggestedDecision}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">AI summary</p>
            <p className="mt-3 text-slate-300">{preview.riskSummary}</p>
            {preview.missingDocuments.length > 0 && (
              <p className="mt-3 text-sm text-cyan-200">Missing documents: {preview.missingDocuments.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={handleBack} disabled={step === 1} className="rounded-3xl bg-white/5 px-5 py-3 text-sm text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">
          Back
        </button>
        {step < 3 ? (
          <button type="button" onClick={handleNext} className="rounded-3xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            Continue
          </button>
        ) : (
          <button type="submit" disabled={loading} className="rounded-3xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:from-cyan-300 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                Analyzing…
              </span>
            ) : (
              'Submit & analyze application'
            )}
          </button>
        )}
      </div>
    </motion.form>
  );
};
