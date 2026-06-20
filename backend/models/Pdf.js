const mongoose = require("mongoose");

const PdfSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Yeh hamare User Model se linked hai
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String, // Cloudinary ka link yahan aayega baad mein
      required: true,
    },
    fileSize: {
      type: String, // Jaise: "2.4 MB" (Optional)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pdf", PdfSchema);