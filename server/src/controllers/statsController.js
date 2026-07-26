const Book = require('../models/Book');
const CommitteeMember = require('../models/CommitteeMember');
const JoinRequest = require('../models/JoinRequest');
const asyncHandler = require('../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const [bookCount, memberCount, joinCount] = await Promise.all([
    Book.countDocuments(),
    CommitteeMember.countDocuments(),
    JoinRequest.countDocuments(),
  ]);

  res.json({
    books: bookCount,
    members: joinCount,       // people who applied to join
    committee: memberCount,   // committee members
  });
});

module.exports = { getStats };
