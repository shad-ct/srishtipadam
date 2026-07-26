const asyncHandler = require('../utils/asyncHandler');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }
  const result = await uploadToCloudinary(req.file.buffer, 'srishtipadam/images');
  res.status(200).json(result);
});

const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files provided');
  }

  const uploadPromises = req.files.map(file =>
    uploadToCloudinary(file.buffer, 'srishtipadam/media')
  );

  const results = await Promise.all(uploadPromises);
  res.status(200).json(results);
});

const uploadPdf = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No PDF file provided');
  }
  try {
    const result = await uploadToCloudinary(req.file.buffer, 'srishtipadam/pdfs', 'image', req.file.originalname);
    res.status(200).json(result);
  } catch (error) {
    console.error('PDF Upload Error:', error);
    require('fs').writeFileSync('cloudinary_error.log', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    res.status(500).json({ error: error.message || error });
  }
});

module.exports = { uploadImage, uploadMultiple, uploadPdf };
