window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('https://equitybankbackendmain.onrender.com/api/addadmin/balance');
    const data = await res.json();
    document.getElementById('balance-amount').textContent = `$${data.amount.toFixed(2)}`;
  } catch (err) {
    console.error('Failed to fetch balance');
  }
});