const pool = require('../config/db');

exports.createOrder = async (req, res) => {
    const clientId = req.user.id;
    const { items } = req.body;

    let total = 0;

    for (const item of items) {
        const [dish] = await pool.query("SELECT Price FROM Dishes WHERE Id=?", [item.dishId]);
        total += dish[0].Price * item.quantity;
    }

    const [orderRes] = await pool.query(
        "INSERT INTO Orders (ClientId, TotalPrice, Status) VALUES (?, ?, 'Pending')",
        [clientId, total]
    );

    const orderId = orderRes.insertId;

    for (const item of items) {
        await pool.query(
            "INSERT INTO OrderItems (OrderId, DishId, Quantity) VALUES (?, ?, ?)",
            [orderId, item.dishId, item.quantity]
        );
    }

    res.json({ message: "Order created", orderId });
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query(
        "UPDATE Orders SET Status=? WHERE Id=?",
        [status, id]
    );

    res.json({ message: "Status updated" });
};
