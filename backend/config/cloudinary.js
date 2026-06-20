const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Cloudinary Credentials Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer ke liye Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pdfcraft_documents", // Cloudinary par is naam ka folder banega
    allowed_formats: ["pdf"],    // Sirf PDF allow karenge
    resource_type: "raw",        // PDFs ko raw format mein upload karna padta hai
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };