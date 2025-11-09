// models/Comment.model.js
import mongoose from "mongoose";

const imageCommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ImagePost",
    required: true,
  },
});

export const ImageComment = mongoose.model("ImageComment", imageCommentSchema);
