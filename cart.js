// Get or initialize cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to Cart functionality
document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.add-to-cart');

  buttons.forEach(button => {
    button.addEventListener('click', function () {
      const card = button.closest(
        '.plant-card, .decor-card, .seed-card, .tool-card, .glove-card, .pot-card'
      );

      if (!card) {
        alert("Could not find product card for this button.");
        return;
      }

      const name = card.querySelector('h3').innerText;
      const priceText = card.querySelector('.price').innerText;
      const price = parseInt(priceText.replace('₹', '').trim());

      let cart = getCart();

      // Check if item already exists
      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      saveCart(cart);
      alert(`${name} added to cart!`);
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

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`;
    list.appendChild(li);
    total += item.price * item.quantity;
  });

  totalDiv.textContent = `Total: ₹${total}`;
}

function placeOrder() {
  alert("Order placed successfully! 🌱");
  localStorage.removeItem('cart');
  loadCart(); // Clear the cart display
}

// Auto-load cart items if on cart page
if (window.location.pathname.includes("cart.html")) {
  document.addEventListener('DOMContentLoaded', loadCart);
}
