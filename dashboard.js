/* ==========================================
   ADMIN DASHBOARD JS - Backend API Integration
   Handles table population & Add Customer modal
   ========================================== */

const customerTableBody = document.querySelector('#customerTable tbody');
const addCustomerBtn = document.getElementById('addCustomerBtn');
const customerModal = document.getElementById('customerModal');
const addCustomerForm = document.getElementById('addCustomerForm');
const cancelBtn = document.getElementById('cancelBtn');

const newFullNameInput = document.getElementById('newFullName');
const newCreditScoreInput = document.getElementById('newCreditScore');

// Show modal
addCustomerBtn.addEventListener('click', () => {
    customerModal.classList.remove('hidden');
});

// Cancel modal
cancelBtn.addEventListener('click', () => {
    customerModal.classList.add('hidden');
    addCustomerForm.reset();
});

// Load customers from backend API
async function loadCustomers() {
    try {
        const response = await fetch('/api/customers'); // Node.js backend endpoint
        const customers = await response.json();

        // Update cards
        document.getElementById('totalCustomers').textContent = customers.length;
        document.getElementById('safeCount').textContent = customers.filter(c => c.creditScore >= 700).length;
        document.getElementById('warningCount').textContent = customers.filter(c => c.creditScore >= 580 && c.creditScore < 700).length;
        document.getElementById('criticalCount').textContent = customers.filter(c => c.creditScore < 580).length;

        // Populate table
        customerTableBody.innerHTML = '';
        customers.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.fullName}</td>
                <td>${c.idNumber}</td>
                <td>${c.creditScore}</td>
                <td>${c.dateJoined}</td>
            `;
            customerTableBody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error loading customers:', err);
        alert('Failed to load customer data.');
    }
}

// Add new customer via backend API
addCustomerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newCustomer = {
        fullName: newFullNameInput.value.trim(),
        creditScore: parseInt(newCreditScoreInput.value)
    };

    try {
        const response = await fetch('/api/addCustomer', { // Node.js backend endpoint
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newCustomer)
        });

        const result = await response.json();

        if (response.ok && result.message) {
            alert(result.message);
            customerModal.classList.add('hidden');
            addCustomerForm.reset();
            loadCustomers(); // Refresh table
        } else {
            alert(result.error || 'Failed to add customer.');
        }
    } catch (err) {
        console.error('Error adding customer:', err);
        alert('Failed to add customer.');
    }
});

// Initial table load
loadCustomers();