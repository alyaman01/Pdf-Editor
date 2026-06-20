const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String, // Cloudinary ka secure URL yahan aayega
      required: true,
    },
    // Jo texts user ne frontend par add aur drag kiye hain unka data
    textLayers: [
      {
        page: Number,
        text: String,
        x: Number,
        y: Number,
        fontSize: Number,
        isBold: Boolean,
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);