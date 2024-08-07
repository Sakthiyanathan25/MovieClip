const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv').config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'MovieClip/uploads',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'bmp', 'svg', 'webp', 'heic', 'tiff', 'mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'm4v', 'webm', 'ogg', 'ogv', '3gp', '3g2', 'mpeg', 'mpg', 'mpe', 'm2v', 'm4v', 'mxf'],
  },
});

const upload = multer({ storage });


module.exports = { cloudinary, upload };
