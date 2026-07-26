const { cloudinary } = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadToCloudinary = (buffer, folder = 'srishtipadam', resourceType = 'auto', originalName = null) => {
  return new Promise((resolve, reject) => {
    let options = { folder, resource_type: resourceType, chunk_size: 6000000 };
    
    if (originalName) {
      // Remove extension for public_id
      const nameParts = originalName.split('.');
      const ext = nameParts.pop();
      const baseName = nameParts.join('.');
      
      options.public_id = baseName;
      // Tell Cloudinary to use this specific format for the file in the URL
      options.format = ext;
    }

    let cld_upload_stream = cloudinary.uploader.upload_chunked_stream(
      options,
      (error, result) => {
        if (result) {
          resolve({ url: result.secure_url, publicId: result.public_id });
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (publicId) await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
