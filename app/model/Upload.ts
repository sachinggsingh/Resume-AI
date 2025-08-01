import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  cloudinary_url: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

const UploadModel = mongoose.models.Upload || mongoose.model('Upload', uploadSchema);

export default UploadModel; 