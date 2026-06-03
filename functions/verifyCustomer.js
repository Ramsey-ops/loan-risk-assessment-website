const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const dbPath = path.join(__dirname, '../database.json');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        const { fullName, idNumber, creditScore, monthlyIncome, loanAmount, employmentStatus } = data;

        // Load customer database
        const customers = JSON.parse(fs.readFileSync(dbPath));

        // Strict match: Name + ID + Credit Score must all match
        const customer = customers.find(c =>
            c.fullName.toLowerCase() === fullName.toLowerCase() &&
            c.idNumber === idNumber &&
            Number(c.creditScore) === Number(creditScore)
        );

        if (!customer) {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'Name, ID number, or Credit Score does not match dashboard records. Access denied.' })
            };
        }

        // Call Python ML API
        const response = await fetch('http://localhost:6000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                monthlyIncome,
                coapplicantIncome: 0,
                loanAmount,
                loanTerm: 360,
                employmentStatus
            })
        });

        const prediction = await response.json();

        // Calculate Debt-to-Income Ratio
        const monthlyPayment = loanAmount / 60; // assume 5-year loan
        const debtToIncome = ((monthlyPayment / monthlyIncome) * 100).toFixed(2);

        // Calculate Loan-to-Income Ratio
        const annualIncome = monthlyIncome * 12;
        const loanToIncome = ((loanAmount / annualIncome) * 100).toFixed(2);

        // Recommendation
        let recommendation = '';
        if (prediction.riskCategory === 'Low') recommendation = 'Approval likely';
        else if (prediction.riskCategory === 'Medium') recommendation = 'May require verification';
        else recommendation = 'High scrutiny required';

        // Return all values for frontend
        return {
            statusCode: 200,
            body: JSON.stringify({
                fullName: customer.fullName,
                idNumber: customer.idNumber,
                riskCategory: prediction.riskCategory,
                probabilities: prediction.probabilities,
                creditScore,
                employmentStatus,
                debtToIncome,
                loanToIncome,
                recommendation
            })
        };

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};