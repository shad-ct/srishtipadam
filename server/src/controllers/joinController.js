const JoinRequest = require('../models/JoinRequest');
const asyncHandler = require('../utils/asyncHandler');

const createJoinRequest = asyncHandler(async (req, res) => {
  const { name, district, mobile, reason } = req.body;
  const joinRequest = new JoinRequest({ name, district, mobile, reason });
  const createdJoinRequest = await joinRequest.save();
  res.status(201).json(createdJoinRequest);
});

const getJoinRequests = asyncHandler(async (req, res) => {
  const joinRequests = await JoinRequest.find({}).sort('-createdAt');
  res.json(joinRequests);
});

module.exports = { createJoinRequest, getJoinRequests };
