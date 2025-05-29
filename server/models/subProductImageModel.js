import mongoose from "mongoose";

const subProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
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
