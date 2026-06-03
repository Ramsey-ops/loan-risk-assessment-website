// Updated script.js - includes Loan-to-Income ratio display
const form = document.getElementById('assessmentForm');
const resultsWrapper = document.getElementById('resultsWrapper');
const formWrapper = document.querySelector('.form-wrapper');

const fullNameInput = document.getElementById('fullName');
const idNumberInput = document.getElementById('idNumber');
const monthlyIncomeInput = document.getElementById('monthlyIncome');
const loanAmountInput = document.getElementById('loanAmount');
const employmentStatusInput = document.getElementById('employmentStatus');
const creditScoreInput = document.getElementById('creditScore');

const riskCard = document.getElementById('riskCard');
const riskIndicator = document.getElementById('riskIndicator');
const riskLevel = document.getElementById('riskLevel');
const riskDescription = document.getElementById('riskDescription');
const probabilityList = document.getElementById('probabilityList');
const debtToIncomeResult = document.getElementById('debtToIncomeResult');
const loanToIncomeResult = document.getElementById('loanToIncomeResult'); // new field
const creditScoreCategoryResult = document.getElementById('creditScoreCategoryResult');
const employmentStabilityResult = document.getElementById('employmentStabilityResult');
const recommendationResult = document.getElementById('recommendationResult');
const idError = document.getElementById('idError');

function validateForm() {
    let isValid = true;
    [fullNameInput, idNumberInput, monthlyIncomeInput, loanAmountInput, employmentStatusInput, creditScoreInput].forEach(input=>{
        input.classList.remove('error');
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (!input.value.trim()) {
            input.classList.add('error');
            if (errorMessage) errorMessage.textContent = 'This field is required';
            isValid = false;
        }
    });
    const score = parseInt(creditScoreInput.value.trim(), 10);
    if(isNaN(score)||score<300||score>850){
        creditScoreInput.classList.add('error');
        isValid=false;
    }
    return isValid;
}

async function verifyCustomer(formData){
    try{
        const response = await fetch('/api/verifyCustomer',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(formData)
        });
        const result = await response.json();
        if(!response.ok) {
            idError.textContent = result.error || 'Name, ID number, or credit score incorrect.';
            return null;
        }
        idError.textContent='';
        return result;
    }catch(err){
        alert('Failed to connect to backend');
        return null;
    }
}

function displayResults(a){
    formWrapper.style.display='none';
    resultsWrapper.style.display='block';

    riskCard.className='risk-card';
    const riskCategory = String(a.riskCategory || '').replace(/\s*Risk$/i, '');
    if(riskCategory==='Low') {riskCard.classList.add('low-risk'); riskIndicator.textContent='✓';}
    else if(riskCategory==='Medium'){riskCard.classList.add('medium-risk'); riskIndicator.textContent='!';}
    else{riskCard.classList.add('high-risk'); riskIndicator.textContent='⚠';}

    riskLevel.textContent=riskCategory+' Risk';
    riskDescription.textContent=riskCategory+' Risk';

    debtToIncomeResult.textContent=(a.debtToIncome || a.debtToIncomeRatio || '-') + '%';
    loanToIncomeResult.textContent=(a.loanToIncome || a.loanToIncomeRatio || '-') + '%';
    creditScoreCategoryResult.textContent=a.creditScoreCategory || a.creditScore;
    employmentStabilityResult.textContent=a.employmentStability || a.employmentStatus;
    recommendationResult.textContent=a.recommendation;

    probabilityList.innerHTML='';
    if(a.probabilities){
        ['Low','Medium','High'].forEach((c,i)=>{
            const li=document.createElement('li');
            li.textContent=`${c} Risk: ${(a.probabilities[i]*100).toFixed(2)}%`;
            probabilityList.appendChild(li);
        });
    }
}

function resetForm(){
    form.reset();
    resultsWrapper.style.display='none';
    formWrapper.style.display='block';
    [fullNameInput,idNumberInput,monthlyIncomeInput,loanAmountInput,employmentStatusInput,creditScoreInput].forEach(i=>i.classList.remove('error'));
    probabilityList.innerHTML='';
    debtToIncomeResult.textContent='-';
    loanToIncomeResult.textContent='-';
}

form.addEventListener('submit',async function(e){
    e.preventDefault();
    if(!validateForm())return;
    const formData={
        fullName:fullNameInput.value.trim(),
        idNumber:idNumberInput.value.trim(),
        monthlyIncome:parseFloat(monthlyIncomeInput.value),
        loanAmount:parseFloat(loanAmountInput.value),
        employmentStatus:employmentStatusInput.value,
        creditScore:parseInt(creditScoreInput.value.trim(),10)
    };
    const assessment=await verifyCustomer(formData);
    if(assessment)displayResults(assessment);
});

function scrollToAssessment(){document.getElementById('assessment').scrollIntoView({behavior:'smooth'});}
