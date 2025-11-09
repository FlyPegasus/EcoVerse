import mongoose from "mongoose";

const imagePostSchema = new mongoose.Schema(
  {
    caption: { type: String, default: "" },
    image: { type: String, required: true }, // imageUrl equivalent
    analysedImage: { type: String, default: "" }, // analysedImageUrl equivalent
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    locationName: {
      type: String,
      default: "", // e.g., "Kolkata"
    },
    severity: {
      level: {
        type: String,
        enum: ["low", "moderate", "high"],
        default: "low",
      },
      score: { type: Number, default: 0 },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "ImageComment" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const ImagePost = mongoose.model("ImagePost", imagePostSchema);
