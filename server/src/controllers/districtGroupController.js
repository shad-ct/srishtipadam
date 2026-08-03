const DistrictGroup = require('../models/DistrictGroup');
const asyncHandler = require('../utils/asyncHandler');

const getDistrictGroups = asyncHandler(async (req, res) => {
  const groups = await DistrictGroup.find({}).sort('order');
  res.json(groups);
});

const createDistrictGroup = asyncHandler(async (req, res) => {
  const group = new DistrictGroup(req.body);
  const created = await group.save();
  res.status(201).json(created);
});

const updateDistrictGroup = asyncHandler(async (req, res) => {
  const group = await DistrictGroup.findById(req.params.id);
  if (group) {
    Object.assign(group, req.body);
    const updated = await group.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('District group not found');
  }
});

const deleteDistrictGroup = asyncHandler(async (req, res) => {
  const group = await DistrictGroup.findById(req.params.id);
  if (group) {
    await group.deleteOne();
    res.json({ message: 'District group removed' });
  } else {
    res.status(404);
    throw new Error('District group not found');
  }
});

module.exports = { getDistrictGroups, createDistrictGroup, updateDistrictGroup, deleteDistrictGroup };
