export const validateLoanApplication = (req, res, next) => {
  const { customerName, panNumber, aadhaarNumber, income, loanAmount } = req.body;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
  const aadhaarRegex = /^\d{12}$/;

  if (!customerName || !panNumber || !aadhaarNumber || !income || !loanAmount) {
    return res.status(400).json({ message: 'All loan application fields are required.' });
  }

  if (!panRegex.test(panNumber)) {
    return res.status(400).json({ message: 'PAN number must use the correct 10-character format.' });
  }

  if (!aadhaarRegex.test(aadhaarNumber)) {
    return res.status(400).json({ message: 'Aadhaar number must be exactly 12 digits.' });
  }

  if (typeof income !== 'number' || income <= 0) {
    return res.status(400).json({ message: 'Income must be a positive number.' });
  }

  if (typeof loanAmount !== 'number' || loanAmount <= 0) {
    return res.status(400).json({ message: 'Loan amount must be a positive number.' });
  }

  next();
};

export const validateTaskUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'in_progress', 'completed', 'escalated'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Task update requires a valid status.' });
  }
  next();
};
