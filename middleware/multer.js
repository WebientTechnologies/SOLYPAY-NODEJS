const multer = require("multer");
const ErrorHandler = require("../utils/ErrorHandler");


const storage = multer.memoryStorage();
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept the file
    } else {
      cb(new ErrorHandler('Only image files are allowed!',400), false); // Reject the file
    }
  };
const videoFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept the file
    } else {
      cb(new ErrorHandler('Only image files are allowed!',400), false); // Reject the file
    }
  };


exports.imageSingleUpload = multer({storage,imageFileFilter}).single('image');
exports.videoSingleUpload = multer({storage,videoFileFilter}).single('video');

