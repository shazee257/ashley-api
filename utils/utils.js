const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const sensitiveKeys = ["password", "salt", "is_deleted", "updatedAt", "__v"];

// Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = 'src/assets/uploads/';
    fs.mkdirSync(path, { recursive: true })
    cb(null, path);
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

exports.comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword).then((isEqual) => {
    return isEqual;
  });
};

exports.errorHandler = (message, statusCode) => {
  const error = new Error(message);
  if (statusCode) {
    error.statusCode = statusCode;
  }
  return error;
};

exports.filterSensitiveInformation = (object) => {
  let result = object;
  sensitiveKeys.forEach((keyname) => {
    if (keyname in object) {
      result[keyname] = undefined;
    }
  });
  return result;
};

exports.imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(null, false);
  }
  cb(null, true);
};

exports.imageUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000 // 10000000 Bytes = 10 MB
  },
  fileFilter: this.imageFilter,
})

// verify token based on request user_id with params id
exports.verifyIdWithToken = (paramsId, requestId) => {
  if (paramsId != requestId.toString()) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  return true;
}

exports.thumbnail = async (req, str) => {
  if (req.file) {
    await sharp(req.file.path, { failOnError: false })
      .resize(128, 128)
      .withMetadata()
      .toFile(path.resolve(`src/assets/uploads/thumbs/${str}/${req.file.filename}`))
  }
}

exports.multiThumbnail = async (req, str) => {
  if (req.files) {
    await Promise.all(req.files.map(async (file) => {
      await sharp(file.path, { failOnError: false })
        .resize(128, 128)
        .withMetadata()
        .toFile(path.resolve(`src/assets/uploads/thumbs/${str}/${file.filename}`))
    }))
  }
}

exports.upload = (folderName) => {
  return imageUpload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const path = `src/assets/uploads/${folderName}/`;
        fs.mkdirSync(path, { recursive: true })
        cb(null, path);
      },

      // By default, multer removes file extensions so let's add them back
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    }),
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(null, false);
      }
      cb(null, true);
    }
  })
}

// generate response 
exports.generateResponse = (success, statusCode, data, message, res) => {
  res.send({
    success,
    statusCode,
    data,
    message
  });
}