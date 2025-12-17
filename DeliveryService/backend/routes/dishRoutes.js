const express = require('express');
const router = express.Router();
const dish = require('../controllers/dishController');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.get('/', dish.getAll);

router.post('/admin', authenticate, authorizeRole("Admin"), dish.create);
router.put('/admin/:id', authenticate, authorizeRole("Admin"), dish.update);
router.delete('/admin/:id', authenticate, authorizeRole("Admin"), dish.remove);

module.exports = router;
