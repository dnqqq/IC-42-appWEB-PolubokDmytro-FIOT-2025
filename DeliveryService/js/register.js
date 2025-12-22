document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');

    const fields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        password: document.getElementById('password'),
        address: document.getElementById('address')
    };

    const errors = {
        name: document.getElementById('nameError'),
        email: document.getElementById('emailError'),
        phone: document.getElementById('phoneError'),
        password: document.getElementById('passwordError'),
        address: document.getElementById('addressError')
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;

    const clearErrors = () => {
        Object.keys(errors).forEach(key => {
            errors[key].innerText = '';
            fields[key].classList.remove('input-error');
        });
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        let valid = true;

        const data = {};
        Object.keys(fields).forEach(key => {
            data[key] = fields[key].value.trim();
            if (!data[key]) {
                errors[key].innerText = 'Поле обовʼязкове';
                fields[key].classList.add('input-error');
                valid = false;
            }
        });

        if (data.email && !emailRegex.test(data.email)) {
            errors.email.innerText = 'Невірний формат email';
            fields.email.classList.add('input-error');
            valid = false;
        }

        if (data.phone && !phoneRegex.test(data.phone)) {
            errors.phone.innerText = 'Телефон: 10–15 цифр';
            fields.phone.classList.add('input-error');
            valid = false;
        }

        if (data.password && data.password.length < 6) {
            errors.password.innerText = 'Мінімум 6 символів';
            fields.password.classList.add('input-error');
            valid = false;
        }

        if (!valid) return;

        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok && result.token) {
                localStorage.setItem('token', result.token);
                window.location.href = 'index.html';
            } else {
                alert(result.message || 'Помилка реєстрації');
            }

        } catch (err) {
            console.error(err);
            alert('Помилка зʼєднання з сервером');
        }
    });
});
