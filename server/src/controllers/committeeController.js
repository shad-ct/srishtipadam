const CommitteeMember = require('../models/CommitteeMember');
const asyncHandler = require('../utils/asyncHandler');
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const getCommitteeMembers = asyncHandler(async (req, res) => {
  const members = await CommitteeMember.find({}).sort('order');
  res.json(members);
});

const createCommitteeMember = asyncHandler(async (req, res) => {
  const member = new CommitteeMember(req.body);
  const createdMember = await member.save();
  res.status(201).json(createdMember);
});

const updateCommitteeMember = asyncHandler(async (req, res) => {
  const member = await CommitteeMember.findById(req.params.id);
  if (member) {
    Object.assign(member, req.body);
    const updatedMember = await member.save();
    res.json(updatedMember);
  } else {
    res.status(404);
    throw new Error('Committee member not found');
  }
});

const deleteCommitteeMember = asyncHandler(async (req, res) => {
  const member = await CommitteeMember.findById(req.params.id);
  if (member) {
    if (member.photo && member.photo.publicId) {
      await deleteFromCloudinary(member.photo.publicId);
    }
    await member.deleteOne();
    res.json({ message: 'Committee member removed' });
  } else {
    res.status(404);
    throw new Error('Committee member not found');
  }
});

module.exports = { getCommitteeMembers, createCommitteeMember, updateCommitteeMember, deleteCommitteeMember };
