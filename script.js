/* ==========================================
   LOAN RISK ASSESSMENT - JAVASCRIPT
   Form Validation & Risk Assessment Logic
   ========================================== */

// Get DOM elements
const form = document.getElementById('assessmentForm');
const resultsWrapper = document.getElementById('resultsWrapper');
const formWrapper = document.querySelector('.form-wrapper');

// Form input elements
const fullNameInput = document.getElementById('fullName');
const monthlyIncomeInput = document.getElementById('monthlyIncome');
const loanAmountInput = document.getElementById('loanAmount');
const employmentStatusInput = document.getElementById('employmentStatus');
const creditScoreInput = document.getElementById('creditScore');

// Results elements
const riskCard = document.getElementById('riskCard');
const riskIndicator = document.getElementById('riskIndicator');
const riskLevel = document.getElementById('riskLevel');
const riskDescription = document.getElementById('riskDescription');

// ==========================================
// FORM VALIDATION
// ==========================================

function validateForm() {
    let isValid = true;
    const formInputs = form.querySelectorAll('.form-input');

    formInputs.forEach(input => {
        const errorMessage = input.parentElement.querySelector('.error-message');
        input.classList.remove('error');

        if (!input.value.trim()) {
            input.classList.add('error');
            if (errorMessage) {
                errorMessage.textContent = 'This field is required';
            }
            isValid = false;
        } else {
            // Validate specific fields
            if (input.id === 'fullName') {
                if (input.value.trim().length < 3) {
                    input.classList.add('error');
                    if (errorMessage) {
                        errorMessage.textContent = 'Full name must be at least 3 characters';
                    }
                    isValid = false;
                }
            }

            if (input.id === 'monthlyIncome') {
                const income = parseFloat(input.value);
                if (isNaN(income) || income < 0) {
                    input.classList.add('error');
                    if (errorMessage) {
                        errorMessage.textContent = 'Please enter a valid income amount';
                    }
                    isValid = false;
                }
            }

            if (input.id === 'loanAmount') {
                const loanAmount = parseFloat(input.value);
                if (isNaN(loanAmount) || loanAmount <= 0) {
                    input.classList.add('error');
                    if (errorMessage) {
                        errorMessage.textContent = 'Please enter a valid loan amount (greater than 0)';
                    }
                    isValid = false;
                }
            }

            if (input.id === 'creditScore') {
                const creditScore = parseFloat(input.value);
                if (isNaN(creditScore) || creditScore < 300 || creditScore > 850) {
                    input.classList.add('error');
                    if (errorMessage) {
                        errorMessage.textContent = 'Credit score must be between 300 and 850';
                    }
                    isValid = false;
                }
            }
        }
    });

    return isValid;
}

// ==========================================
// RISK ASSESSMENT CALCULATION
// ==========================================

function calculateRiskAssessment() {
    const fullName = fullNameInput.value.trim();
    const monthlyIncome = parseFloat(monthlyIncomeInput.value);
    const loanAmount = parseFloat(loanAmountInput.value);
    const employmentStatus = employmentStatusInput.value;
    const creditScore = parseFloat(creditScoreInput.value);

    // Calculate debt-to-income ratio
    const monthlyPayment = (loanAmount / 60); // Assuming 5-year loan
    const debtToIncomeRatio = (monthlyPayment / monthlyIncome) * 100;

    // Risk scoring system
    let riskScore = 0;
    let riskCategory = '';

    // 1. Credit Score Analysis (40 points max)
    let creditScorePoints = 0;
    if (creditScore >= 740) {
        creditScorePoints = 40; // Excellent
    } else if (creditScore >= 670) {
        creditScorePoints = 30; // Good
    } else if (creditScore >= 580) {
        creditScorePoints = 15; // Fair
    } else {
        creditScorePoints = 5; // Poor
    }
    riskScore += (40 - creditScorePoints); // Lower score is better

    // 2. Debt-to-Income Ratio Analysis (35 points max)
    let dtiPoints = 0;
    if (debtToIncomeRatio <= 20) {
        dtiPoints = 0; // Excellent
    } else if (debtToIncomeRatio <= 36) {
        dtiPoints = 15; // Good
    } else if (debtToIncomeRatio <= 50) {
        dtiPoints = 25; // Fair
    } else {
        dtiPoints = 35; // Poor
    }
    riskScore += dtiPoints;

    // 3. Employment Status Analysis (20 points max)
    let employmentPoints = 0;
    switch (employmentStatus) {
        case 'employed':
            employmentPoints = 0; // Best
            break;
        case 'self-employed':
            employmentPoints = 10;
            break;
        case 'part-time':
            employmentPoints = 15;
            break;
        case 'unemployed':
            employmentPoints = 20; // Worst
            break;
        case 'retired':
            employmentPoints = 8;
            break;
        default:
            employmentPoints = 20;
    }
    riskScore += employmentPoints;

    // 4. Loan-to-Income Ratio (5 points max)
    const loanToIncomeRatio = (loanAmount / (monthlyIncome * 12)) * 100;
    let ltiPoints = 0;
    if (loanToIncomeRatio <= 300) {
        ltiPoints = 0;
    } else if (loanToIncomeRatio <= 400) {
        ltiPoints = 2;
    } else {
        ltiPoints = 5;
    }
    riskScore += ltiPoints;

    // Determine risk category based on score
    if (riskScore <= 25) {
        riskCategory = 'Low Risk';
    } else if (riskScore <= 50) {
        riskCategory = 'Medium Risk';
    } else {
        riskCategory = 'High Risk';
    }

    // Return assessment object
    return {
        fullName,
        riskCategory,
        riskScore,
        debtToIncomeRatio: debtToIncomeRatio.toFixed(2),
        creditScore,
        creditScoreCategory: getScoreCategory(creditScore),
        employmentStatus,
        employmentStability: getEmploymentStability(employmentStatus),
        loanToIncomeRatio: loanToIncomeRatio.toFixed(2),
        recommendation: getRecommendation(riskCategory, creditScore)
    };
}

// Helper function: Get credit score category
function getScoreCategory(score) {
    if (score >= 740) return 'Excellent';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
}

// Helper function: Get employment stability description
function getEmploymentStability(status) {
    const stabilityMap = {
        'employed': 'Very Stable',
        'self-employed': 'Moderate',
        'part-time': 'Low',
        'unemployed': 'Very Low',
        'retired': 'Moderate'
    };
    return stabilityMap[status] || 'Unknown';
}

// Helper function: Get recommendation based on risk
function getRecommendation(riskCategory, creditScore) {
    if (riskCategory === 'Low Risk') {
        return 'Approval likely - Favorable terms available';
    } else if (riskCategory === 'Medium Risk') {
        return 'May require additional documentation - Standard terms';
    } else {
        return 'High scrutiny required - Consider improving credit score';
    }
}

// ==========================================
// DISPLAY RESULTS
// ==========================================

function displayResults(assessment) {
    // Hide form, show results
    formWrapper.style.display = 'none';
    resultsWrapper.style.display = 'block';

    // Update risk card styling
    riskCard.className = 'risk-card';
    if (assessment.riskCategory === 'Low Risk') {
        riskCard.classList.add('low-risk');
        riskIndicator.textContent = '✓';
    } else if (assessment.riskCategory === 'Medium Risk') {
        riskCard.classList.add('medium-risk');
        riskIndicator.textContent = '!';
    } else {
        riskCard.classList.add('high-risk');
        riskIndicator.textContent = '⚠';
    }

    // Update risk level and description
    riskLevel.textContent = assessment.riskCategory;

    const descriptions = {
        'Low Risk': 'Congratulations! Your loan application shows strong financial health. You have favorable conditions for approval.',
        'Medium Risk': 'Your application is acceptable but may require standard verification. Consider improving your credit score for better terms.',
        'High Risk': 'Your application carries significant risk. We recommend improving your financial profile before reapplying.'
    };

    riskDescription.textContent = descriptions[assessment.riskCategory];

    // Update detailed results
    document.getElementById('debtToIncomeResult').textContent = assessment.debtToIncomeRatio + '%';
    document.getElementById('creditScoreCategoryResult').textContent = 
        assessment.creditScore + ' (' + assessment.creditScoreCategory + ')';
    document.getElementById('employmentStabilityResult').textContent = assessment.employmentStability;
    document.getElementById('recommendationResult').textContent = assessment.recommendation;

    // Scroll to results
    setTimeout(() => {
        resultsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// ==========================================
// RESET FORM
// ==========================================

function resetForm() {
    form.reset();
    resultsWrapper.style.display = 'none';
    formWrapper.style.display = 'block';
    form.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
    });
    formWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================
// DOWNLOAD RESULT
// ==========================================

function downloadResult() {
    const riskText = riskLevel.textContent;
    const debtToIncome = document.getElementById('debtToIncomeResult').textContent;
    const creditScoreInfo = document.getElementById('creditScoreCategoryResult').textContent;
    const employment = document.getElementById('employmentStabilityResult').textContent;
    const recommendation = document.getElementById('recommendationResult').textContent;

    const timestamp = new Date().toLocaleString();
    const applicantName = fullNameInput.value || 'Applicant';

    // Create a text document content
    const content = `
LOAN RISK ASSESSMENT REPORT
============================

Report Date: ${timestamp}
Applicant Name: ${applicantName}

ASSESSMENT RESULT
-----------------
Risk Category: ${riskText}
Description: ${riskDescription.textContent}

FINANCIAL METRICS
-----------------
Debt-to-Income Ratio: ${debtToIncome}
Credit Score Information: ${creditScoreInfo}
Employment Stability: ${employment}

RECOMMENDATION
--------------
${recommendation}

============================
This assessment is provided for informational purposes only.
For official loan decisions, please contact us directly.
`;

    // Create a Blob and trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Loan-Risk-Assessment-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    // Show confirmation
    const originalText = a.download;
    console.log('Report downloaded successfully!');
}

// ==========================================
// SCROLL TO ASSESSMENT
// ==========================================

function scrollToAssessment() {
    const assessmentSection = document.getElementById('assessment');
    assessmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================
// FORM SUBMISSION
// ==========================================

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }

    // Calculate risk assessment
    const assessment = calculateRiskAssessment();

    // Display results
    displayResults(assessment);

    // Log to console for debugging
    console.log('Assessment Complete:', assessment);
});

// ==========================================
// REAL-TIME VALIDATION
// ==========================================

const formInputs = form.querySelectorAll('.form-input');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        const errorMessage = this.parentElement.querySelector('.error-message');
        this.classList.remove('error');

        // Validate on blur
        if (!this.value.trim()) {
            this.classList.add('error');
            if (errorMessage) {
                errorMessage.textContent = 'This field is required';
            }
        } else if (this.id === 'fullName' && this.value.trim().length < 3) {
            this.classList.add('error');
            if (errorMessage) {
                errorMessage.textContent = 'Full name must be at least 3 characters';
            }
        } else if (this.id === 'creditScore') {
            const score = parseFloat(this.value);
            if (isNaN(score) || score < 300 || score > 850) {
                this.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'Credit score must be between 300 and 850';
                }
            }
        }
    });

    input.addEventListener('focus', function() {
        this.classList.remove('error');
    });
});

// ==========================================
// SMOOTH SCROLLING FOR NAVIGATION
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// PAGE LOAD ANIMATION
// ==========================================

window.addEventListener('load', function() {
    // Add animation classes when page loads
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = `slideInUp 0.6s ease-out`;
        }, index * 100);
    });
});

// ==========================================
// PREVENT FORM SUBMISSION ON ENTER IN CERTAIN INPUTS
// ==========================================

[monthlyIncomeInput, loanAmountInput, creditScoreInput].forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });
});

// ==========================================
// INPUT FORMATTING
// ==========================================

// Format currency inputs
[monthlyIncomeInput, loanAmountInput].forEach(input => {
    input.addEventListener('change', function() {
        if (this.value) {
            this.value = Math.max(0, parseFloat(this.value)).toFixed(0);
        }
    });
});

// Format credit score input
creditScoreInput.addEventListener('change', function() {
    if (this.value) {
        let value = parseInt(this.value);
        value = Math.max(300, Math.min(850, value));
        this.value = value;
    }
});

console.log('Loan Risk Assessment System Loaded Successfully!');
