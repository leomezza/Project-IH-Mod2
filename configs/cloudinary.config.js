const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// const storage = new CloudinaryStorage({
//   cloudinary,
//   folder: 'avatars',
//   allowedFormats: ['jpg', 'png'],
//   filename: function (req, file, cb) {
//     console.log(file);
//     cb(null, file.originalname);
//   }
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'png'],
    public_id: (req, file) => req.session.currentUser._id,
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
