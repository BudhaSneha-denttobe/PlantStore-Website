// Get or initialize cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function injectCartStyles() {
  if (document.getElementById('cart-js-styles')) return;

  const style = document.createElement('style');
  style.id = 'cart-js-styles';
  style.textContent = `
    .order-status {
      margin: 0 0 20px;
      padding: 18px 22px;
      border-radius: 14px;
      font-size: 20px;
      text-align: center;
      display: none;
      transition: opacity 0.25s ease;
    }

    .order-status.success {
      display: block;
      background-color: #d4f9dc;
      color: #166534;
      border: 1px solid #a7f3d0;
    }

    .order-status.error {
      display: block;
      background-color: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .add-to-cart.added {
      background-color: #2f855a;
    }

    .add-to-cart.added:hover {
      background-color: #276749;
    }

    .add-to-cart .button-count {
      margin-left: 10px;
      font-weight: 700;
    }
  `;
  document.head.appendChild(style);
}

function getStatusElement() {
  let statusEl = document.getElementById('order-status');
  if (!statusEl && window.location.pathname.includes('cart.html')) {
    const cartContainer = document.querySelector('.cart-container');
    if (cartContainer) {
      statusEl = document.createElement('div');
      statusEl.id = 'order-status';
      statusEl.className = 'order-status';
      cartContainer.insertBefore(statusEl, cartContainer.firstChild);
    }
  }
  return statusEl;
}

function setStatusMessage(message, type = 'info') {
  const statusEl = getStatusElement();
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = `order-status ${type}`;
}

function updateButtonState(button, count) {
  if (count > 0) {
    button.classList.add('added');
    button.innerHTML = `Added <span class="button-count">(${count})</span>`;
  } else {
    button.classList.remove('added');
    button.textContent = 'Add to Cart';
  }
}

// Add to Cart functionality
document.addEventListener('DOMContentLoaded', function () {
  injectCartStyles();

  const buttons = document.querySelectorAll('.add-to-cart');

  buttons.forEach(button => {
    const card = button.closest(
      '.plant-card, .decor-card, .seed-card, .tool-card, .glove-card, .pot-card'
    );

    if (!card) {
      return;
    }

    const name = card.querySelector('h3').innerText;
    const cart = getCart();
    const existingItem = cart.find(item => item.name === name);
    updateButtonState(button, existingItem ? existingItem.quantity : 0);

    button.addEventListener('click', function () {
      const priceText = card.querySelector('.price').innerText;
      const price = parseInt(priceText.replace('₹', '').trim());

      let updatedCart = getCart();
      const item = updatedCart.find(item => item.name === name);
      if (item) {
        item.quantity += 1;
      } else {
        updatedCart.push({ name, price, quantity: 1 });
      }

      saveCart(updatedCart);
      updateButtonState(button, item ? item.quantity : 1);
      setStatusMessage(`${name} added to cart!`, 'success');
    });
  });
});

// For cart.html page
function loadCart() {
  const cart = getCart();
  const list = document.getElementById('cart-items');
  const totalDiv = document.getElementById('total-cost');
  list.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = 'Your cart is currently empty.';
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.color = '#4a5568';
    emptyMessage.style.padding = '20px 0';
    list.appendChild(emptyMessage);
  }

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`;
    list.appendChild(li);
    total += item.price * item.quantity;
  });

  totalDiv.textContent = `Total: ₹${total}`;
}

function placeOrder() {
  const cart = getCart();

  if (cart.length === 0) {
    setStatusMessage('Your cart is empty. Add products before placing an order.', 'error');
    return;
  }

  setStatusMessage('Order placed successfully! 🌱', 'success');
  localStorage.removeItem('cart');
  loadCart(); // Clear the cart display
}

// Auto-load cart items if on cart page
if (window.location.pathname.includes('cart.html')) {
  document.addEventListener('DOMContentLoaded', function () {
    injectCartStyles();
    loadCart();
  });
}
