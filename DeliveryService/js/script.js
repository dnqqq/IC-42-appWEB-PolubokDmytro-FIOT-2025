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
    
    // Close menu when clicking on link (optional)
    const navLinks = document.querySelectorAll('.nav-item-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            burgerMenu.classList.remove('active');
            navList.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside (optional)
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.header-nav') && !event.target.closest('.burger-menu')) {
            burgerMenu.classList.remove('active');
            navList.classList.remove('active');
        }
    });
});

fetch("http://localhost:3000/api/dishes")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("dishes-list");
    container.innerHTML = "";

    if (data.length === 0) {
      container.textContent = "Меню порожнє";
      return;
    }

    data.forEach(dish => {
      const item = document.createElement("div");
      item.innerHTML = `
        <strong>${dish.Name}</strong><br>
        Ціна: ${dish.Price} грн<br><br>
      `;
      container.appendChild(item);
    });
  })
  .catch(error => {
    console.error(error);
    document.getElementById("dishes-list").textContent =
      "Помилка завантаження даних";
  });
