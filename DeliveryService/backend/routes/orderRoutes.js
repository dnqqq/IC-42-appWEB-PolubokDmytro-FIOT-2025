const express = require('express');
const router = express.Router();
const order = require('../controllers/orderController');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.post('/', authenticate, authorizeRole("Client"), order.createOrder);
router.put('/:id/status', authenticate, authorizeRole("Courier"), order.updateStatus);

module.exports = router;
