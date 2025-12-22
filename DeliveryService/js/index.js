// Burger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navList = document.querySelector('.nav-list');
    
    if (burgerMenu && navList) {
        burgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on link
    const navLinks = document.querySelectorAll('.nav-item-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            burgerMenu.classList.remove('active');
            navList.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.header-nav') && !event.target.closest('.burger-menu')) {
            burgerMenu.classList.remove('active');
            navList.classList.remove('active');
        }
    });
});

// Login Btn Change
document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('authBtn');
    const token = localStorage.getItem('token');

    if (authBtn) {
        if (token) {
            authBtn.innerHTML = '<img src="../img/cart.svg" class="profile-img">Корзина';
            authBtn.onclick = () => window.location.href = 'cart.html';
        } else {
            authBtn.onclick = () => window.location.href = 'login.html';
        }
    }
});

// Load Menu
async function loadMenuFromDB() {
    const sections = document.querySelectorAll('.food-section');

    try {
        const res = await fetch('http://localhost:3000/api/dishes');
        const dishes = await res.json();

        sections.forEach(section => {
            const categoryId = section.dataset.categoryId;

            const categoryDishes = dishes.filter(
                d => d.CategoryId == categoryId
            );

            if (categoryDishes.length === 0) {
                section.innerHTML += `
                    <p class="empty-text">
                        Немає страв у цій категорії
                    </p>`;
                return;
            }

            const restaurantBlock = document.createElement('div');
            restaurantBlock.className = 'restaurant-section';

            const grid = document.createElement('div');
            grid.className = 'menu-items-grid';

            categoryDishes.forEach(d => {
                const item = document.createElement('div');
                item.className = 'menu-item';

                item.innerHTML = `
                    <img src="${d.Photo || '../img/no-image.png'}"
                         class="menu-item-img"
                         alt="${d.Name}">
                    <h4 class="menu-item-name">${d.Name}</h4>
                    <p class="price-txt">${d.Price} ₴</p>
                    <button class="add-to-cart-btn btn">У кошик</button>
                `;

                item.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                    addToCart(d);
                });

                grid.appendChild(item);
            });

            restaurantBlock.appendChild(grid);
            section.appendChild(restaurantBlock);
        });

    } catch (err) {
        console.error('Menu load error:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadMenuFromDB);


function addToCart(dish) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existing = cart.find(i => i.Id === dish.Id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            Id: dish.Id,
            Name: dish.Name,
            Price: Number(dish.Price),
            Photo: dish.Photo,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showToast('Товар додано у кошик');
}

function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = text;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        toast.remove();
    }, 2000);
}
