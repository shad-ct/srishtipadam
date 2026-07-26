const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { verifyAdmin } = require('../middleware/auth');
const { validate, orderSchema } = require('../middleware/validate');
const rateLimit = require('express-rate-limit');

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many orders created from this IP, please try again after 15 minutes' }
});

router.route('/')
  .post(orderLimiter, validate(orderSchema), createOrder)
  .get(verifyAdmin, getOrders);

router.route('/:id')
  .put(verifyAdmin, updateOrderStatus);

module.exports = router;
