// app.js

// بيانات المنتجات
const catalog = [
  {game:'PUBG MOBILE', title:'60 UC', price:55},
  {game:'PUBG MOBILE', title:'120 UC', price:110},
  {game:'PUBG MOBILE', title:'325 UC', price:235},
  {game:'PUBG MOBILE', title:'385 UC', price:290},
  {game:'PUBG MOBILE', title:'660 UC', price:465},
  {game:'PUBG MOBILE', title:'985 UC', price:695},
  {game:'PUBG MOBILE', title:'1320 UC', price:920},
  {game:'PUBG MOBILE', title:'1800 UC', price:1200},
  {game:'PUBG MOBILE', title:'3850 UC', price:2250},

  {game:'FREE FIRE', title:'عضوية شهرية', price:350},
  {game:'FREE FIRE', title:'عضوية أسبوعية', price:75},
  {game:'FREE FIRE', title:'دروب 1 دولار', price:50},
  {game:'FREE FIRE', title:'دروب 2 دولار', price:85},
  {game:'FREE FIRE', title:'عضوية مخففة', price:35},

  {game:'ROBLOX', title:'40 روبوكس', price:35},
  {game:'ROBLOX', title:'80 روبوكس', price:60},
  {game:'ROBLOX', title:'400 روبوكس', price:255},
  {game:'ROBLOX', title:'800 روبوكس', price:490},
  {game:'ROBLOX', title:'1700 روبوكس', price:995}
];

// عرض المنتجات لكل لعبة
const groups = {};
catalog.forEach(it => {
  groups[it.game] = groups[it.game] || [];
  groups[it.game].push(it);
});
document.querySelectorAll('.items').forEach(container => {
  const game = container.dataset.game;
  const items = groups[game] || [];
  container.innerHTML = items.map(it => `
    <div class="item">
      <div>
        <strong>${it.title}</strong>
        <div class="muted">${it.price} L.E</div>
      </div>
      <button class="add" onclick="addToCart(${catalog.indexOf(it)})">+</button>
    </div>
  `).join('');
});

// السلة
let cart = [];
const cartList = document.getElementById('cartList');
const totalEl = document.getElementById('total');

function addToCart(i) {
  const found = cart.find(c => c.idx === i);
  if (found) found.qty++;
  else cart.push({idx: i, qty: 1});
  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartList.innerHTML = '<div class="muted">لا توجد عناصر بعد</div>';
    totalEl.textContent = '0 L.E';
    return;
  }

  cartList.innerHTML = cart.map(c => {
    const item = catalog[c.idx];
    return `
      <div class="cart-item">
        <div>
          <strong>${item.title}</strong>
          <div class="muted" style="font-size:12px">${item.game}</div>
        </div>
        <div>${item.price * c.qty} L.E</div>
      </div>
    `;
  }).join('');

  const total = cart.reduce((sum, c) => sum + catalog[c.idx].price * c.qty, 0);
  totalEl.textContent = total + ' L.E';
}

document.getElementById('clearCart').onclick = () => {
  cart = [];
  renderCart();
};

// إنهاء الطلب
document.getElementById('checkout').onclick = () => {
  if (cart.length === 0) { alert('السلة فارغة'); return; }

  const name = document.getElementById('playerName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const phone = document.getElementById('phone').value.trim();
  const payment = document.getElementById('payment').value;

  if (!name || !email || !password || !phone) { alert('املأ جميع الحقول'); return; }
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) { alert('الرجاء إدخال بريد إلكتروني صحيح'); return; }

  window.orderData = {name, email, password, phone, payment, cart: [...cart]};
  document.getElementById('paymentScreen').style.display = 'block';
};

// تأكيد الدفع
document.getElementById('confirmPayment').onclick = () => {
  const screenshot = document.getElementById('paymentScreenshot').files[0];
  if (!screenshot) { alert('من فضلك ارفع صورة الدفع قبل المتابعة'); return; }

  const data = window.orderData;
  let orderText = `طلب شحن ⚡\n`;
  orderText += `الاسم: ${data.name}\n`;
  orderText += `البريد الإلكتروني: ${data.email}\n`;
  orderText += `كلمة المرور: ${data.password}\n`;
  orderText += `الهاتف: ${data.phone}\n`;
  orderText += `طريقة الدفع: ${data.payment}\n---\nالمنتجات:\n`;
  data.cart.forEach(c => {
    const it = catalog[c.idx];
    orderText += `${it.game} | ${it.title} x${c.qty} = ${it.price * c.qty} L.E\n`;
  });
  const total = data.cart.reduce((s, c) => s + catalog[c.idx].price * c.qty, 0);
  orderText += `الإجمالي: ${total} L.E`;

  const waText = encodeURIComponent(orderText);
  const waNumber = '201125494828';
  const waURL = `https://wa.me/${waNumber}?text=${waText}`;
  window.open(waURL, '_blank');

  document.getElementById('paymentScreen').style.display = 'none';
  cart = [];
  renderCart();

  document.getElementById('playerName').value = '';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('paymentScreenshot').value = '';
};

// إلغاء الدفع
document.getElementById('cancelPayment').onclick = () => {
  document.getElementById('paymentScreen').style.display = 'none';
};
