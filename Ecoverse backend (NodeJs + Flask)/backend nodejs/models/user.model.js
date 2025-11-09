import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
    ecoPoints: { type: Number, default: 0 }, // eco points for the user
    gender: { type: String, enum: ["male", "female"] },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // other users ref
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // other users reference
    ],
    imgposts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ImagePost" }, // other post ref
    ],
    imgbookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "ImagePost" }],
    // blogposts: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }, // other post ref
    // ],
    // blogbookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

export const User = mongoose.model("User", userSchema);
