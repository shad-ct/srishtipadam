const Order = require('../models/Order');
const Book = require('../models/Book');
const asyncHandler = require('../utils/asyncHandler');

const createOrder = asyncHandler(async (req, res) => {
  const { bookId, fullName, mobile, address, notes } = req.body;

  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  const order = new Order({
    book: bookId,
    bookNameSnapshot: book.name,
    fullName,
    mobile,
    address,
    notes
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('book', 'name coverImage').sort('-createdAt');
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = { createOrder, getOrders, updateOrderStatus };
