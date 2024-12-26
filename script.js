const apiUrl = 'http://192.168.240.96:3000/expenses';

async function addExpense() {
  const nameInput = document.getElementById('expense-name');
  const amountInput = document.getElementById('expense-amount');
  const categoryInput = document.getElementById('expense-category');

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  if (name && amount > 0) {
    const expense = { name, amount, category };
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      const newExpense = await response.json();
      displayExpense(newExpense);
      updateTotalAmount();

      // Clear input fields after adding
      nameInput.value = '';
      amountInput.value = '';
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  }
}

// Function to load all expenses from the server
async function loadExpenses() {
  try {
    const response = await fetch(apiUrl);
    const expenses = await response.json();
    expenses.forEach(displayExpense);
    updateTotalAmount();
  } catch (error) {
    console.error('Error loading expenses:', error);
  }
}

// Function to display an expense in the list
function displayExpense(expense) {
  const expenseList = document.getElementById('expense-list');
  const listItem = document.createElement('li');
  listItem.dataset.id = expense.id; // Add a unique ID to the list item

  listItem.innerHTML = `
        <span>${expense.name} - $${expense.amount.toFixed(2)} (${expense.category})</span>
        <button onclick="removeExpense(${expense.id})">Remove</button>
    `;
  expenseList.appendChild(listItem);
}

// Function to remove an expense
async function removeExpense(id) {
  try {
    await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });

    // Refresh the expense list after removal
    document.getElementById('expense-list').innerHTML = '';
    loadExpenses();
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
}

// Function to calculate and display the total amount of expenses
async function updateTotalAmount() {
  try {
    const response = await fetch(apiUrl);
    const expenses = await response.json();
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
  } catch (error) {
    console.error('Error calculating total:', error);
  }
}

// Load expenses when the page is loaded
document.addEventListener('DOMContentLoaded', loadExpenses);
