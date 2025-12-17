async function addDish() {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;

    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:3000/api/dishes/admin', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, price, description, categoryId: 1 })
    });

    const data = await res.json();
    alert(data.message);
}
