/* ===============================
   CARRINHO DE COMPRAS COMPLETO
================================ */

// Recupera carrinho salvo
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Elementos
const cartModal = document.getElementById("cart-modal");
const openCart = document.getElementById("open-cart");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout");

/* ===============================
   ABRIR / FECHAR CARRINHO
================================ */

openCart.addEventListener("click", () => {
  cartModal.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cartModal.classList.remove("active");
});

/* ===============================
   ADICIONAR AO CARRINHO
================================ */

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        name,
        price,
        quantity: 1
      });
    }

    updateCart();
  });
});

/* ===============================
   ATUALIZAR CARRINHO
================================ */

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    count += item.quantity;

    cartItems.innerHTML += `
      <li class="cart-item">
        <span>${item.name}</span>
        <div class="cart-actions">
          <button onclick="changeQty(${index}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
          <button onclick="removeItem(${index})">❌</button>
        </div>
      </li>
    `;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = count;

  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ===============================
   ALTERAR QUANTIDADE
================================ */

function changeQty(index, amount) {
  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
}

/* ===============================
   REMOVER ITEM
================================ */

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

/* ===============================
   FINALIZAR PEDIDO (PIX + WHATS)
================================ */

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("🛒 Seu carrinho está vazio!");
    return;
  }

  let message = "🍔 *Pedido Stars Burgers*%0A%0A";
  let total = 0;

  cart.forEach(item => {
    message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
    total += item.price * item.quantity;
  });

  message += `%0A💰 *Total:* R$ ${total.toFixed(2)}`;
  message += `%0A💳 *PIX:* 123.456.789-00`;

  const phone = "5599999999999"; // 🔴 TROQUE PELO SEU NÚMERO

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = [];
  updateCart();
});

/* ===============================
   INICIALIZA
================================ */

updateCart();

