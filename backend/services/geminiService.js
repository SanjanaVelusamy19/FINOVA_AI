import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not configured. Gemini analysis will use local fallback.');
}

const fallbackAnalysis = (application) => {
  const missing = [];
  if (!application.documents?.length) missing.push('Proof of income');
  if (!application.panNumber) missing.push('PAN');
  const score = Math.min(100, Math.max(20, Math.round((application.income / application.loanAmount) * 30 + 40)));
  return {
    riskScore: score,
    suggestedDecision: score > 60 ? 'approve' : 'review',
    riskSummary: `Income-to-loan ratio suggests ${score > 60 ? 'low risk' : 'moderate risk'}.`,
    missingDocuments: missing,
    alerts: [],
  };
};

export const analyzeLoanApplication = async (application) => {
  if (!GEMINI_API_KEY) {
    return fallbackAnalysis(application);
  }

  const prompt = `Analyze this loan application. Return risk score (0-100), decision (approve/reject/review), summary, and missing documents.
Customer: ${application.customerName}
PAN: ${application.panNumber}
Income: ${application.income}
Loan: ${application.loanAmount}
Documents: ${application.documents?.join(', ') || 'none'}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
    );

    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response?.data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join(' ') ||
      '';

    const riskMatch = /risk score\s*[:\-]?\s*(\d+)/i.exec(text);
    const riskScore = riskMatch ? Number(riskMatch[1]) : Math.max(40, Math.min(90, Math.round((application.income / application.loanAmount) * 40 + 40)));
    const decisionMatch = /approve|reject|review/i.exec(text);
    const suggestedDecision = decisionMatch ? decisionMatch[0].toLowerCase() : riskScore > 60 ? 'approve' : 'review';

    return {
      riskScore,
      suggestedDecision,
      riskSummary: text.trim() || fallbackAnalysis(application).riskSummary,
      missingDocuments: [],
      alerts: [],
    };
  } catch (error) {
    console.error('Gemini analysis failed:', error?.response?.data?.error?.message || error.message);
    return fallbackAnalysis(application);
  }
};
