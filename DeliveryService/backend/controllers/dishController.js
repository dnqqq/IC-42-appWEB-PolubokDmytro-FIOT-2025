const pool = require('../config/db');

/**
 * GET /api/dishes
 * Повертає всі доступні страви
 * (фільтрація на фронті по CategoryId)
 */
exports.getAll = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                d.Id,
                d.Name,
                d.Price,
                d.Photo,
                d.Description,
                d.CategoryId,
                c.Name AS CategoryName
            FROM Dishes d
            JOIN MenuCategories c ON d.CategoryId = c.Id
            WHERE d.IsAvailable = 1
            ORDER BY d.CategoryId, d.Name
        `);

        res.json(rows);
    } catch (err) {
        console.error('GET dishes error:', err);
        res.status(500).json({ message: 'Failed to load dishes' });
    }
};

/**
 * POST /api/dishes/admin
 * Створення нової страви
 */
exports.create = async (req, res) => {
    try {
        const { name, price, description, photo, categoryId } = req.body;

        if (!name || !price || !categoryId) {
            return res.status(400).json({
                message: 'Name, price and categoryId are required'
            });
        }

        await pool.query(
            `
            INSERT INTO Dishes
            (Name, Price, Photo, Description, CategoryId, IsAvailable)
            VALUES (?, ?, ?, ?, ?, 1)
            `,
            [
                name,
                price,
                photo || null,
                description || null,
                categoryId
            ]
        );

        res.status(201).json({ message: 'Dish created successfully' });
    } catch (err) {
        console.error('CREATE dish error:', err);
        res.status(500).json({ message: 'Failed to create dish' });
    }
};

/**
 * PUT /api/dishes/admin/:id
 * Оновлення страви
 */
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, photo, categoryId } = req.body;

        if (!name || !price || !categoryId) {
            return res.status(400).json({
                message: 'Name, price and categoryId are required'
            });
        }

        await pool.query(
            `
            UPDATE Dishes
            SET
                Name = ?,
                Price = ?,
                Description = ?,
                Photo = ?,
                CategoryId = ?
            WHERE Id = ?
            `,
            [name, price, description || null, photo || null, categoryId, id]
        );

        res.json({ message: 'Dish updated successfully' });
    } catch (err) {
        console.error('UPDATE dish error:', err);
        res.status(500).json({ message: 'Failed to update dish' });
    }
};

/**
 * DELETE /api/dishes/admin/:id
 * Мʼяке видалення (IsAvailable = 0)
 */
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            'UPDATE Dishes SET IsAvailable = 0 WHERE Id = ?',
            [id]
        );

        res.json({ message: 'Dish disabled successfully' });
    } catch (err) {
        console.error('DELETE dish error:', err);
        res.status(500).json({ message: 'Failed to disable dish' });
    }
};
