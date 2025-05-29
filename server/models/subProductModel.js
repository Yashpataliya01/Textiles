import mongoose from "mongoose";

const subProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("SubProduct", subProductSchema);