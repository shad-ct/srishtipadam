const Book = require('../models/Book');
const asyncHandler = require('../utils/asyncHandler');
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const getBooks = asyncHandler(async (req, res) => {
  const { category, search, featured } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (featured === 'true') filter.featured = true;
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const books = await Book.find(filter).sort('-createdAt');
  res.json(books);
});

const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

const createBook = asyncHandler(async (req, res) => {
  const book = new Book(req.body);
  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    Object.assign(book, req.body);
    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    if (book.coverImage && book.coverImage.publicId) {
      await deleteFromCloudinary(book.coverImage.publicId);
    }
    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
