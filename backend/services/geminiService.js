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
  const repaymentConfidence = Math.min(100, Math.max(28, Math.round((application.income / application.loanAmount) * 30 + 50)));
  const fraudProbability = Math.min(100, Math.max(7, 100 - repaymentConfidence + (missing.length ? 20 : 0)));
  const riskScore = Math.min(100, Math.max(20, 95 - repaymentConfidence));
  const approvalProbability = Math.max(10, Math.min(95, repaymentConfidence - fraudProbability * 0.2));
  const workflowPriority = riskScore > 80 ? 'Critical' : riskScore > 65 ? 'High' : riskScore > 45 ? 'Medium' : 'Low';
  return {
    riskScore,
    suggestedDecision: riskScore > 65 ? 'approve' : 'review',
    riskSummary: `Income-to-loan ratio suggests ${riskScore > 65 ? 'low risk' : 'moderate risk'} with ${repaymentConfidence}% confidence.`,
    missingDocuments: missing,
    fraudProbability,
    approvalProbability,
    repaymentConfidence,
    workflowPriority,
    alerts: missing.length ? ['Missing documentation raises review priority.'] : [],
  };
};

export const analyzeLoanApplication = async (application) => {
  if (!GEMINI_API_KEY) {
    return fallbackAnalysis(application);
  }

  const prompt = `Analyze this loan application and return a JSON object with these properties: riskScore, fraudProbability, approvalProbability, repaymentConfidence, workflowPriority, suggestedDecision, riskSummary, missingDocuments.\nCustomer: ${application.customerName}\nPAN: ${application.panNumber}\nIncome: ${application.income}\nLoan Amount: ${application.loanAmount}\nDocuments: ${application.documents?.join(', ') || 'none'}`;

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

    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response?.data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join(' ') ||
      '';

    const riskMatch = /risk score\s*[:\-]?\s*(\d+)/i.exec(text);
    const fraudMatch = /fraud probability\s*[:\-]?\s*(\d+)%?/i.exec(text);
    const approvalMatch = /approval probability\s*[:\-]?\s*(\d+)%?/i.exec(text);
    const repaymentMatch = /repayment confidence\s*[:\-]?\s*(\d+)%?/i.exec(text);
    const priorityMatch = /priority\s*[:\-]?\s*(Low|Medium|High|Critical)/i.exec(text);
    const decisionMatch = /approve|reject|review/i.exec(text);

    const riskScore = riskMatch ? Number(riskMatch[1]) : fallbackAnalysis(application).riskScore;
    const fraudProbability = fraudMatch ? Number(fraudMatch[1]) : fallbackAnalysis(application).fraudProbability;
    const approvalProbability = approvalMatch ? Number(approvalMatch[1]) : fallbackAnalysis(application).approvalProbability;
    const repaymentConfidence = repaymentMatch ? Number(repaymentMatch[1]) : fallbackAnalysis(application).repaymentConfidence;
    const workflowPriority = priorityMatch ? priorityMatch[1] : fallbackAnalysis(application).workflowPriority;
    const suggestedDecision = decisionMatch ? decisionMatch[0].toLowerCase() : fallbackAnalysis(application).suggestedDecision;

    return {
      riskScore,
      fraudProbability,
      approvalProbability,
      repaymentConfidence,
      workflowPriority,
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
