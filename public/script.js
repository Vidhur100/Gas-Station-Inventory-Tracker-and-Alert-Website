$(document).ready(function() {
  // DOM Elements
  const loginContainer = $('#loginContainer');
  const loginForm = $('#loginForm');
  const passwordInput = $('#passwordInput');
  const togglePassword = $('#togglePassword'); // Show Password Button
  const inventoryContainer = $('#inventoryContainer');
  const addForm = $('#addForm');
  const itemNameInput = $('input[name="name"]');
  const itemQuantityInput = $('input[name="quantity"]');
  const itemPriceInput = $('input[name="price"]');
  const inventory = $('#inventory');
  const searchBar = $('#searchBar');

  // Event Listener for Login Form Submission
  loginForm.on('submit', function(event) {
    event.preventDefault();

    // Validate password
    const password = passwordInput.val();
    if (password === 'your_password_here') { // Replace 'your_password_here' with your actual password
      loginContainer.hide();
      inventoryContainer.show();
    } else {
      alert('Invalid password. Please try again.');
      passwordInput.val('');
    }
  });

  // Event Listener for Show Password Button
  togglePassword.on('click', function() {
    const passwordFieldType = passwordInput.attr('type');
    if (passwordFieldType === 'password') {
      passwordInput.attr('type', 'text');
      togglePassword.removeClass('far fa-eye-slash').addClass('far fa-eye'); // Change icon to an open eye
    } else {
      passwordInput.attr('type', 'password');
      togglePassword.removeClass('far fa-eye').addClass('far fa-eye-slash'); // Change icon to a closed eye
    }
  });

  // Event Listener for Item Form Submission
  addForm.on('submit', function(event) {
    event.preventDefault();

    // Get input values
    const itemName = itemNameInput.val();
    const itemQuantity = itemQuantityInput.val();
    const itemPrice = itemPriceInput.val();

    // Create new item element
    const newItem = $('<div>').addClass('card');
    newItem.html(`
      <h3>${itemName}</h3>
      <p>Quantity: <span class="quantity">${itemQuantity}</span></p>
      <p>Price: $${itemPrice}</p>
      <button class="delete-btn">Delete</button>
      <button class="quantity-btn increment">+</button>
      <button class="quantity-btn decrement">-</button>
    `);

    // Delete item button event listener
    newItem.find('.delete-btn').on('click', function() {
      newItem.remove();
    });

    // Increment button event listener
    newItem.find('.increment').on('click', function() {
      updateQuantity(newItem, 1);
    });

    // Decrement button event listener
    newItem.find('.decrement').on('click', function() {
      updateQuantity(newItem, -1);
    });

    // Add new item to the inventory
    inventory.append(newItem);

    // Clear input fields
    itemNameInput.val('');
    itemQuantityInput.val('');
    itemPriceInput.val('');
  });

  // Event Listener for Search Bar
  searchBar.on('input', function() {
    const searchTerm = searchBar.val().toLowerCase();
    const items = $('.card');

    items.sort(function(a, b) {
      const aName = $(a).find('h3').text().toLowerCase();
      const bName = $(b).find('h3').text().toLowerCase();

      if (aName.includes(searchTerm) && !bName.includes(searchTerm)) {
        return -1;
      } else if (!aName.includes(searchTerm) && bName.includes(searchTerm)) {
        return 1;
      } else {
        return 0;
      }
    });

    items.detach().appendTo(inventory);
  });

  // Function to update the quantity
  function updateQuantity(item, change) {
    const quantityElement = item.find('.quantity');
    let currentQuantity = parseInt(quantityElement.text());
    currentQuantity += change;

    if (currentQuantity < 0) {
      currentQuantity = 0;
    }

    quantityElement.text(currentQuantity);
  }
});
