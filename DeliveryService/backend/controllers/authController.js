const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
    const { name, email, phone, password, address } = req.body;

    try {
        const [existing] = await pool.query(
            "SELECT * FROM Users WHERE Email = ?", [email]
        );
        if (existing.length > 0)
            return res.status(400).json({ message: "Email already used" });

        const hash = await bcrypt.hash(password, 10);

        const [userResult] = await pool.query(
            "INSERT INTO Users (Name, Email, Phone, PasswordHash) VALUES (?, ?, ?, ?)",
            [name, email, phone, hash]
        );

        const userId = userResult.insertId;

        // Assign Client role
        await pool.query(
            "INSERT INTO UserRoles (UserId, RoleId) VALUES (?, 1)",
            [userId]
        );

        // Create Client profile
        await pool.query(
            "INSERT INTO Clients (UserId, Address) VALUES (?, ?)",
            [userId, address]
        );

        const token = generateToken({ Id: userId, roles: ["Client"] });

        res.json({ message: "Registered successfully", token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query(
            "SELECT * FROM Users WHERE Email = ?", [email]
        );

        if (users.length === 0)
            return res.status(400).json({ message: "Invalid email" });

        const user = users[0];

        const match = await bcrypt.compare(password, user.PasswordHash);

        if (!match)
            return res.status(400).json({ message: "Wrong password" });

        // Get roles
        const [roles] = await pool.query(
            "SELECT r.Name FROM Roles r JOIN UserRoles ur ON r.Id = ur.RoleId WHERE ur.UserId = ?",
            [user.Id]
        );

        const roleNames = roles.map(r => r.Name);

        const token = generateToken({ Id: user.Id, roles: roleNames });

        res.json({ token, roles: roleNames });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
