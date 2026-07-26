const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyAdmin } = require('../middleware/auth');
const { uploadImage, uploadMultiple, uploadPdf } = require('../controllers/uploadController');

// All upload routes require admin privileges
router.use(verifyAdmin);

router.post('/image', upload.single('image'), uploadImage);
router.post('/multiple', upload.array('files', 10), uploadMultiple);
router.post('/pdf', upload.single('pdf'), uploadPdf);

module.exports = router;
