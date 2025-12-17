const pool = require('../config/db');

exports.getAll = async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM Dishes WHERE IsAvailable = 1");
    res.json(rows);
};

exports.create = async (req, res) => {
    const { name, price, description, categoryId } = req.body;

    await pool.query(
        "INSERT INTO Dishes (Name, Price, Description, CategoryId) VALUES (?, ?, ?, ?)",
        [name, price, description, categoryId]
    );

    res.json({ message: "Dish created" });
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const { name, price, description } = req.body;

    await pool.query(
        "UPDATE Dishes SET Name=?, Price=?, Description=? WHERE Id=?",
        [name, price, description, id]
    );

    res.json({ message: "Dish updated" });
};

exports.remove = async (req, res) => {
    try {
        const id = req.params.id;

        await pool.query(
            "UPDATE Dishes SET IsAvailable = 0 WHERE Id = ?",
            [id]
        );

        res.json({ message: "Dish disabled" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
