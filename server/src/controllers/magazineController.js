const Magazine = require('../models/Magazine');
const asyncHandler = require('../utils/asyncHandler');
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const getMagazines = asyncHandler(async (req, res) => {
  const { featured, public: isPublic } = req.query;
  const filter = {};

  if (featured === 'true') filter.featured = true;
  if (isPublic === 'true') {
    filter.isPublic = true;
    filter.publishedDate = { $lte: new Date() };
  }

  const magazines = await Magazine.find(filter).sort('-publishedDate');
  res.json(magazines);
});

const getMagazineById = asyncHandler(async (req, res) => {
  const magazine = await Magazine.findById(req.params.id);
  if (magazine) {
    res.json(magazine);
  } else {
    res.status(404);
    throw new Error('Magazine not found');
  }
});

const createMagazine = asyncHandler(async (req, res) => {
  const magazine = new Magazine(req.body);
  const createdMagazine = await magazine.save();
  res.status(201).json(createdMagazine);
});

const updateMagazine = asyncHandler(async (req, res) => {
  const magazine = await Magazine.findById(req.params.id);
  if (magazine) {
    Object.assign(magazine, req.body);
    const updatedMagazine = await magazine.save();
    res.json(updatedMagazine);
  } else {
    res.status(404);
    throw new Error('Magazine not found');
  }
});

const deleteMagazine = asyncHandler(async (req, res) => {
  const magazine = await Magazine.findById(req.params.id);
  if (magazine) {
    if (magazine.coverImage && magazine.coverImage.publicId) {
      await deleteFromCloudinary(magazine.coverImage.publicId);
    }
    if (magazine.pdf && magazine.pdf.publicId) {
      await deleteFromCloudinary(magazine.pdf.publicId);
    }
    await magazine.deleteOne();
    res.json({ message: 'Magazine removed' });
  } else {
    res.status(404);
    throw new Error('Magazine not found');
  }
});

module.exports = { getMagazines, getMagazineById, createMagazine, updateMagazine, deleteMagazine };
