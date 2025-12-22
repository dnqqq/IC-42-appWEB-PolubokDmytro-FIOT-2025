document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    bindBackButton();
    bindCheckout();
});

document.addEventListener('DOMContentLoaded', () => {
    showUserName();
});

function showUserName() {
    const header = document.getElementById('userHeader');

    const user = JSON.parse(localStorage.getItem('user')); 

    if (header && user?.name) {
        header.innerText = `QuickBite — Корзина | ${user.name}`;
    }
}

document.querySelector('.checkout-btn').addEventListener('click', async () => {
    const cart = getCart();
    if (cart.length === 0) return;

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Будь ласка, увійдіть у систему");
        window.location.href = 'login.html';
        return;
    }

    const total = cart.reduce((sum, i) => sum + i.Price * i.quantity, 0) + 50; // доставка

    try {
        const res = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify({ items: cart, total })
        });

        const data = await res.json();

        if (res.ok) {
            alert('Замовлення оформлено!');
            localStorage.removeItem('cart');
            renderCart();
        } else {
            alert(data.message || 'Помилка оформлення');
        }
    } catch (err) {
        console.error(err);
        alert('Не вдалося зʼєднатися із сервером');
    }
});


document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');

    window.location.href = 'index.html';
});

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const summaryItems = document.querySelector('.summary-row span');
    const totalBlock = document.querySelector('.summary-total span');

    const cart = getCart();
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p class="empty-cart-text">Ваша корзина порожня</p>
                <button class="btn" onclick="window.location.href='index.html'">
                    Перейти до меню
                </button>
            </div>
        `;
        updateSummary();
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <img src="${item.Photo || '../img/no-image.png'}"
                 class="cart-item-img"
                 alt="${item.Name}">
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.Name}</h3>
                <p class="cart-item-price">${item.Price} ₴</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn minus">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="quantity-btn plus">+</button>
                <button class="remove-btn">Видалити</button>
            </div>
        `;

        // + / -
        cartItem.querySelector('.plus').onclick = () => {
            item.quantity++;
            saveCart(cart);
            renderCart();
        };

        cartItem.querySelector('.minus').onclick = () => {
            if (item.quantity > 1) {
                item.quantity--;
                saveCart(cart);
                renderCart();
            }
        };

        // Remove
        cartItem.querySelector('.remove-btn').onclick = () => {
            removeItem(item.Id);
        };

        cartItemsContainer.appendChild(cartItem);
    });

    updateSummary();
}

function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(i => i.Id !== id);
    saveCart(cart);
    renderCart();
}

function updateSummary() {
    const cart = getCart();

    const itemsCountEl = document.getElementById('itemsCount');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    const itemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = cart.reduce((sum, i) => sum + i.Price * i.quantity, 0);
    const delivery = cart.length > 0 ? 50 : 0;
    const total = subtotal + delivery;

    if (itemsCountEl) {
        itemsCountEl.innerText = `Товари (${itemsCount})`;
    }

    if (subtotalEl) {
        subtotalEl.innerText = `${subtotal} ₴`;
    }

    if (totalEl) {
        totalEl.innerText = `${total} ₴`;
    }
}


function bindBackButton() {
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.onclick = () => {
            window.location.href = 'index.html';
        };
    }
}

function bindCheckout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (getCart().length === 0) return;

            alert('Замовлення оформлено! (демо)');
            localStorage.removeItem('cart');
            renderCart();
        };
    }
}
