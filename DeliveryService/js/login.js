document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('authForm');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const clearErrors = () => {
        emailError.innerText = '';
        passwordError.innerText = '';
        emailInput.classList.remove('input-error');
        passwordInput.classList.remove('input-error');
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        let valid = true;

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email) {
            emailError.innerText = 'Email обовʼязковий';
            emailInput.classList.add('input-error');
            valid = false;
        } else if (!emailRegex.test(email)) {
            emailError.innerText = 'Невірний формат email';
            emailInput.classList.add('input-error');
            valid = false;
        }

        if (!password) {
            passwordError.innerText = 'Пароль обовʼязковий';
            passwordInput.classList.add('input-error');
            valid = false;
        }

        if (!valid) return;

        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok && data.token) {
                localStorage.setItem('token', data.token);
                if (data.roles) {
                    localStorage.setItem('roles', JSON.stringify(data.roles));
                }
                // Додаємо user info для кошика
                localStorage.setItem('user', JSON.stringify({
                    id: data.userId,
                    name: data.name
                }));
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Помилка входу');
            }

        } catch (err) {
            console.error(err);
            alert('Не вдалося підключитися до сервера');
        }
    });
});
