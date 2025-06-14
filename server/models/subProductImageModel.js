import mongoose from "mongoose";

const subProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: false, // Set to true if you want it mandatory
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    subProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubProduct",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubProductImage", subProductSchema);
