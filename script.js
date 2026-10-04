import {menuArray} from './data.js'

const orderSection = document.getElementById('order-section')
const cartSection = document.getElementById('cart')
const dishesList = document.getElementById('cart-dishes')
const cartTotal = document.getElementById('cart-total')
const completeOrderBtn = document.getElementById('complete-btn')
const thanksSectionText = document.getElementById('thanks-text')
const thanksSection = document.getElementById('thanks')
const modal = document.getElementById('payment-modal');
const form = document.getElementById('payment-form');

const cart = [];

function renderMenu(){
  orderSection.innerHTML = menuArray.map(element => `
    <div class="dish">
      <div class="dish-info">
        <div class="dish-icon">${element.emoji}</div>
        <div class="dish-desc">
          <h3>${element.name}</h3>
          <p>${element.ingredients.join(", ")}</p>
          <h4>$${element.price}</h4>
        </div>
      </div>
      <button class="dish-btn" data-id="${element.id}">+</button>
    </div>
  `).join("");
}

orderSection.addEventListener('click', e => {
  thanksSection.style.display = 'none'
  const btn = e.target.closest('.dish-btn');
  if (!btn) return;

  addToCart(Number(btn.dataset.id));
});

function addToCart(id) {
  const dish = menuArray.find(item => item.id === id);
  if (!dish) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...dish, quantity: 1 });
  }

  renderCart()
}

function renderCart(){
  getCartDishesList(cart)
  cartSection.style.display = cart.length ? 'flex' : 'none';
  let total = 0
  cart.forEach(el => {
    total += el.price * el.quantity
  })
  cartTotal.innerText = "$" + String(total)
}

function getCartDishesList(arrayOfDishes){
  dishesList.innerHTML = arrayOfDishes.map(el => `
      <div class="cart-dish" data-id="${el.id}">
        <div class="cart-dish-container">
          <p class="cart-dish-name">${el.name}, ${el.quantity}</p>
          <button class="cart-dish-btn">remove</button>
        </div>
        <p>$${el.price * el.quantity}</p>
      </div>
    `).join('')
}

cartSection.addEventListener('click', e => {
  const btn = e.target.closest('.cart-dish-btn');
  if (!btn) return;

  const dishEl = btn.closest('.cart-dish');
  const id = Number(dishEl.dataset.id);

  removeFromCart(id);
  renderCart()
});

function removeFromCart(dishId){
  const index = cart.findIndex(item => item.id === dishId)
  if (index === -1) return;

  if(cart[index].quantity === 1){
    cart.splice(index, 1)
    renderCart()
  } else{
    cart[index].quantity--
  }
}

completeOrderBtn.addEventListener('click', () => {
  modal.showModal();
})

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get('name');

  modal.close();
  form.reset();
  cartSection.style.display = 'none'
  thanksSection.style.display = 'flex'
  thanksSectionText.innerText = `Thanks, ${name}! Your order is on its way!`
});

renderMenu()