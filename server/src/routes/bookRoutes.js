const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { verifyAdmin } = require('../middleware/auth');

router.route('/')
  .get(getBooks)
  .post(verifyAdmin, createBook);

router.route('/:id')
  .get(getBookById)
  .put(verifyAdmin, updateBook)
  .delete(verifyAdmin, deleteBook);

module.exports = router;
