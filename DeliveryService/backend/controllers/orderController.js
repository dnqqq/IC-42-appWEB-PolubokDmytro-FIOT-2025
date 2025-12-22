const pool = require('../config/db');

// Створення нового замовлення
exports.createOrder = async (req, res) => {
    try {
        const clientId = req.user.Id; // з JWT
        const { items } = req.body;   // items = [{Id, quantity}]

        if (!items || items.length === 0) return res.status(400).json({ message: "Cart empty" });

        let total = 0;

        for (const item of items) {
            const [dish] = await pool.query("SELECT Price FROM Dishes WHERE Id=?", [item.Id]);
            total += dish[0].Price * item.quantity;
        }

        // Створюємо замовлення
        const [orderRes] = await pool.query(
            "INSERT INTO Orders (ClientId, TotalPrice, Status) VALUES (?, ?, 'Pending')",
            [clientId, total]
        );

        const orderId = orderRes.insertId;

        // Створюємо order items
        for (const item of items) {
            await pool.query(
                "INSERT INTO OrderItems (OrderId, DishId, Quantity) VALUES (?, ?, ?)",
                [orderId, item.Id, item.quantity]
            );
        }

        res.json({ message: "Order created", orderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create order" });
    }
};

// Оновлення статусу замовлення (для адміна)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await pool.query(
            "UPDATE Orders SET Status=? WHERE Id=?",
            [status, id]
        );

        res.json({ message: "Status updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update status" });
    }
};
