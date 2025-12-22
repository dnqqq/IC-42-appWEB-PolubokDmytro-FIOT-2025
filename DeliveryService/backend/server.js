const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const dishRoutes = require('./routes/dishRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('DeliveryService API running...');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Server error" });
});
