let adminUnlocked = false;

// Format user input in currency style ($650,000.00)
function formatCurrency(input) {
    const value = input.value.replace(/[^0-9.]/g, '');
    const floatValue = parseFloat(value);
    if (!isNaN(floatValue)) {
        input.value = `$${floatValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
        input.value = '';
    }
}

// Parse formatted currency string back to raw float (e.g., "$650,000.00" → 650000)
function parseCurrency(str) {
    return parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
}

function checkAdminCode() {
    const code = document.getElementById('admin-code').value;
    const panel = document.getElementById('admin-panel');
    if (code === "3237") {
        panel.style.display = 'block';
        adminUnlocked = true;
        showDeleteButtons();
    } else {
        panel.style.display = 'none';
        adminUnlocked = false;
        hideDeleteButtons();
    }
}

function showDeleteButtons() {
    document.querySelectorAll('.delete-btn').forEach(btn => btn.style.display = 'inline-block');
}

function hideDeleteButtons() {
    document.querySelectorAll('.delete-btn').forEach(btn => btn.style.display = 'none');
}

async function handleAdminTransaction(e) {
    e.preventDefault();

    const description = document.getElementById('admin-description').value;
    const amountRaw = document.getElementById('admin-amount').value;
    const customBalanceRaw = document.getElementById('admin-balance').value;
    const status = document.getElementById('admin-status').value;

    const amount = parseCurrency(amountRaw);
    const customBalance = parseCurrency(customBalanceRaw);

    const balance = customBalanceRaw
        ? customBalance
        : (status === "Completed" ? amount : "Pending");

    try {
        const res = await fetch('https://equitybankbackendmain.onrender.com/api/addadmin/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, amount, status, balance })
        });
        const data = await res.json();

        if (res.ok) {
            const table = document.querySelector('.transaction-history tbody');
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${new Date().toLocaleDateString()}</td>
                <td>${description}</td>
                <td>${amount >= 0 ? '+' : '-'}$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td>${typeof balance === "number" ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : balance}</td>
                <td><button class="delete-btn" onclick="deleteTransaction('${data._id}', this)" style="display:inline-block;">Delete</button></td>
            `;
            table.appendChild(row);

            document.getElementById('admin-transaction-form').reset();
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteTransaction(id, btn) {
    try {
        const res = await fetch(`https://equitybankbackendmain.onrender.com/api/addadmin/transactions/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            btn.closest('tr').remove();
        }
    } catch (err) {
        console.error(err);
    }
}

async function handleBalanceUpdate(e) {
    e.preventDefault();
    const balanceRaw = document.getElementById('update-balance-input').value;
    const newBalance = parseCurrency(balanceRaw);

    try {
        const res = await fetch('https://equitybankbackendmain.onrender.com/api/addadmin/balance', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: newBalance })
        });

        if (res.ok) {
            document.getElementById('balance-amount').textContent = `$${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            document.getElementById('update-balance-input').value = '';
        }
    } catch (err) {
        console.error(err);
    }
}

