const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(__dirname)); // Serve frontend files

const dbPath = path.join(__dirname, 'database.json');

// Endpoint to add a customer (used by dashboard)
app.post('/api/addCustomer', (req, res) => {
    const { fullName, creditScore } = req.body;
    if (!fullName || !creditScore) return res.status(400).json({ error: 'Missing fields' });

    const customers = JSON.parse(fs.readFileSync(dbPath));
    const newCustomer = {
        fullName,
        creditScore,
        idNumber: Math.floor(Math.random() * 10000000).toString(),
        dateJoined: new Date().toISOString().split('T')[0]
    };
    customers.push(newCustomer);
    fs.writeFileSync(dbPath, JSON.stringify(customers, null, 2));
    res.json({ message: 'Customer added successfully', customers });
});

// Endpoint to fetch all customers
app.get('/api/customers', (req, res) => {
    const customers = JSON.parse(fs.readFileSync(dbPath));
    res.json(customers);
});

// Endpoint to verify customer for loan form
app.post('/api/verifyCustomer', (req, res) => {
    const { fullName, idNumber, monthlyIncome, loanAmount, employmentStatus, creditScore } = req.body;
    const customers = JSON.parse(fs.readFileSync(dbPath));

    const submittedName = String(fullName || '').trim().toLowerCase();
    const submittedId = String(idNumber || '').trim();
    const submittedCreditScore = Number(creditScore);
    const income = Number(monthlyIncome);
    const requestedLoan = Number(loanAmount);

    const customer = customers.find(c =>
        String(c.fullName || '').trim().toLowerCase() === submittedName &&
        String(c.idNumber || '').trim() === submittedId &&
        Number(c.creditScore) === submittedCreditScore
    );

    if (!customer) {
        return res.status(403).json({
            error: 'Name, ID number, or credit score incorrect. Please enter the exact details saved by admin.'
        });
    }

    if (!Number.isFinite(income) || income <= 0 || !Number.isFinite(requestedLoan) || requestedLoan <= 0) {
        return res.status(400).json({ error: 'Monthly income and loan amount must be greater than zero.' });
    }

    const monthlyPayment = requestedLoan / 60;
    const debtToIncomeRatio = (monthlyPayment / income) * 100;

    let riskScore = 0;
    let creditScorePoints = submittedCreditScore >= 740 ? 40 : submittedCreditScore >= 670 ? 30 : submittedCreditScore >= 580 ? 15 : 5;
    riskScore += (40 - creditScorePoints);

    let dtiPoints = debtToIncomeRatio <= 20 ? 0 : debtToIncomeRatio <= 36 ? 15 : debtToIncomeRatio <= 50 ? 25 : 35;
    riskScore += dtiPoints;

    let employmentPoints = employmentStatus === 'employed' ? 0 :
                           employmentStatus === 'self-employed' ? 10 :
                           employmentStatus === 'part-time' ? 15 :
                           employmentStatus === 'unemployed' ? 20 : 8;
    riskScore += employmentPoints;

    const loanToIncomeRatio = (requestedLoan / (income * 12)) * 100;
    let ltiPoints = loanToIncomeRatio <= 300 ? 0 : loanToIncomeRatio <= 400 ? 2 : 5;
    riskScore += ltiPoints;

    const riskCategory = riskScore <= 25 ? 'Low Risk' : riskScore <= 50 ? 'Medium Risk' : 'High Risk';

    res.json({
        fullName: customer.fullName,
        idNumber: customer.idNumber,
        riskCategory,
        riskScore,
        debtToIncome: debtToIncomeRatio.toFixed(2),
        debtToIncomeRatio: debtToIncomeRatio.toFixed(2),
        creditScore: customer.creditScore,
        creditScoreCategory: customer.creditScore >= 740 ? 'Excellent' : customer.creditScore >= 670 ? 'Good' : customer.creditScore >= 580 ? 'Fair' : 'Poor',
        employmentStatus,
        employmentStability: employmentStatus === 'employed' ? 'Very Stable' :
                             employmentStatus === 'self-employed' ? 'Moderate' :
                             employmentStatus === 'part-time' ? 'Low' :
                             employmentStatus === 'unemployed' ? 'Very Low' : 'Moderate',
        loanToIncome: loanToIncomeRatio.toFixed(2),
        loanToIncomeRatio: loanToIncomeRatio.toFixed(2),
        recommendation: riskCategory === 'Low Risk' ? 'Approval likely' :
                        riskCategory === 'Medium Risk' ? 'May require verification' :
                        'High scrutiny required'
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
