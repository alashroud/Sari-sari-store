// renderer.js
const fs = require('fs');
const path = require('path');

// Path to inventory data file
const dataPath = path.join(__dirname, 'data', 'inventory.json');

// Select HTML elements
const addForm = document.getElementById('addForm');
const nameInput = document.getElementById('name');
const quantityInput = document.getElementById('quantity');
const inventoryList = document.getElementById('inventoryList');

// Load inventory when app starts
function loadInventory() {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading inventory.json:', err);
      return;
    }

    try {
      const items = JSON.parse(data);
      displayInventory(items);
    } catch (parseErr) {
      console.error('Error parsing inventory.json:', parseErr);
    }
  });
}

// Display items on the page
function displayInventory(items) {
  inventoryList.innerHTML = ''; // clear previous list

  if (items.length === 0) {
    inventoryList.innerHTML = '<li>No products yet.</li>';
    return;
  }

  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add('inventory-item');
    li.innerHTML = `
      <span>${item.name} — ${item.quantity} pcs</span>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    inventoryList.appendChild(li);
  });

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      deleteItem(index);
    });
  });
}

// Add new product
addForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const quantity = parseInt(quantityInput.value);

  if (!name || isNaN(quantity) || quantity <= 0) {
    alert('Please enter a valid product name and quantity.');
    return;
  }

  fs.readFile(dataPath, 'utf8', (err, data) => {
    let items = [];
    if (!err && data) {
      try {
        items = JSON.parse(data);
      } catch (parseErr) {
        console.error('Error parsing inventory.json:', parseErr);
      }
    }

    // Add new item
    items.push({ name, quantity });

    fs.writeFile(dataPath, JSON.stringify(items, null, 2), (err) => {
      if (err) {
        console.error('Error writing to inventory.json:', err);
        return;
      }

      // Refresh list
      loadInventory();
      addForm.reset();
    });
  });
});

// Delete an item
function deleteItem(index) {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading inventory.json:', err);
      return;
    }

    let items = JSON.parse(data);
    items.splice(index, 1);

    fs.writeFile(dataPath, JSON.stringify(items, null, 2), (err) => {
      if (err) {
        console.error('Error updating inventory.json:', err);
        return;
      }
      loadInventory();
    });
  });
}

// Run on startup
loadInventory();
