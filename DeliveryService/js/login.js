document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.login-btn');

    if (loginBtn) {

        loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const emailInput = document.querySelector('input[type="text"]');
            const passwordInput = document.querySelector('input[type="password"]');
            
            const email = emailInput.value;
            const password = passwordInput.value;

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
                    
                    window.location.href = 'index.html'; 
                } else {
                    alert(data.message || 'Помилка входу');
                }
            } catch (err) {
                console.error('Помилка:', err);
                alert('Не вдалося з’єднатися із сервером');
            }
        });
    }
});