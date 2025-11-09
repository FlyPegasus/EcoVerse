import { ImagePost } from "../models/imgpost.model.js";
import { User } from "../models/user.model.js";
import { ImageComment } from "../models/imgcomment.model.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";
import axios from "axios";
import FormData from "form-data";

export const addNewPost = async (req, res) => {
  try {
    const { caption, locationLatitude, locationLongitude, locationName } =
      req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Image required" });

    // image analysis
    const formData = new FormData();
    formData.append("file", image.buffer, {
      filename: image.originalname, // required
      contentType: image.mimetype,
    });
    const severity = await axios.post(
      "http://localhost:5000/analyse",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    // image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // analysed image upload
    const analysed_img = severity.data.analysed_img;
    const severityScore = severity.data.score;
    // const
    // const analysedImgBuffer = await sharp(analysed_img.buffer)
    //   .resize({ width: 800, height: 800, fit: "inside" })
    //   .toFormat("jpeg", { quality: 80 })
    //   .toBuffer();

    // buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    // const analysedFileUri = `data:image/jpeg;base64,${analysedImgBuffer.toString(
    //   "base64"
    // )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    // const analysedCloudResponse = await cloudinary.uploader.upload(
    //   analysedFileUri
    // );
    const post = await ImagePost.create({
      caption,
      image: cloudResponse.secure_url,
      analysedImage: analysed_img,
      author: authorId,
      severity: {
        score: severityScore,
      },
      location: {
        type: "Point",
        coordinates: [
          parseFloat(locationLongitude),
          parseFloat(locationLatitude),
        ], // Note: [longitude, latitude]
      },
      locationName,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.imgposts.push(post._id);
      const ecoPointsIncrement = Math.floor(severityScore);
      // console.log(
      //   `Eco points increment: ${ecoPointsIncrement} for user ${user.username}`
      // );
      user.ecoPoints += ecoPointsIncrement / 10;
      console.log(
        `Eco points increment: ${user.ecoPoints} for user ${user.username}`
      );
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added",
      post,
      updatedUser: user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const getAllPost = async (req, res) => {
//   try {
//     const posts = await ImagePost.find()
//       .sort({ createdAt: -1 })
//       .populate({ path: "author", select: "username profilePicture" })
//       .populate({
//         path: "comments",
//         sort: { createdAt: -1 },
//         populate: {
//           path: "author",
//           select: "username profilePicture",
//         },
//       });
//     return res.status(200).json({
//       posts,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getAllPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 5; // default to 5 posts per page
    const skip = (page - 1) * limit;

    const totalPosts = await ImagePost.countDocuments();

    const posts = await ImagePost.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const likerId = req.id;
    const postId = req.params.id; // why postid is in req.params.id?
    const post = await ImagePost.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }

    // like logic
    await post.updateOne({
      $addToSet: {
        // addToSet hashset ki tarah h, taki per user ek hi like register ho
        likes: likerId,
      },
    });
    await post.save();

    // socketio implementation for real time interaction

    return res.status(200).json({
      message: "Post liked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likerId = req.id;
    const postId = req.params.id; // why postid is in req.params.id?
    const post = await ImagePost.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }

    // like logic
    await post.updateOne({
      $pull: {
        // addToSet hashset ki tarah h, taki per user ek hi like register ho
        likes: likerId,
      },
    });
    await post.save();

    // socketio implementation for real time interaction

    return res.status(200).json({
      message: "Post disliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// // post comments
// export const addComment = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const commenterId = req.id;
//     const { newComment } = req.body;

//     const post = await ImagePost.findById(postId);
//     if (!newComment) {
//       res.status(400).json({
//         message: "Comment required",
//         success: false,
//       });
//     }

//     const comment = await ImageComment.create({
//       text: newComment,
//       author: commenterId,
//       post: postId,
//     });

//     await comment.populate({
//       path: "author",
//       select: "username, profilePicture",
//     });
//     post.comments.push(comment._id);
//     await post.save();
//     return res.status(201).json({
//       message: "Comment added",
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// post comments
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commenterId = req.id;
    const { newComment } = req.body;

    const post = await ImagePost.findById(postId);
    if (!post) {
      // Added check if post exists
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    if (!newComment) {
      return res.status(400).json({
        // Return added
        message: "Comment required",
        success: false,
      });
    }

    const comment = await ImageComment.create({
      text: newComment,
      author: commenterId,
      post: postId,
    });

    // Populate the author details directly on the 'comment' object
    await comment.populate({
      path: "author",
      select: "username profilePicture", // Corrected select syntax
    });

    post.comments.push(comment._id); // Store only the ID in the post's comments array
    await post.save();

    // Send the populated comment object back to the frontend
    return res.status(201).json({
      message: "Comment added",
      success: true,
      comment: comment, // <--- Crucial change: send the populated comment object
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      // Added error response
      message: "Failed to add comment",
      success: false,
      error: error.message,
    });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const { id: postId } = req.params; // destructure karke id nikala fir postId = id kar diya
    const comments = await ImageComment.find({ post: postId }).populate({
      path: "author",
      select: "username, profilePicture",
    });
    if (!comments) {
      return res.status(404).json({
        message: "No comments found!",
        success: false,
      });
    }
    return res.status(200).json({
      comments,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// delete post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await ImagePost.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }
    // delete post
    await post.deleteOne();
    // remove post from user
    const user = await User.findById(post.author);
    if (user) {
      user.imgposts = user.imgposts.filter((id) => id.toString() !== postId);
      await user.save();
    }
    // delete comments
    await ImageComment.deleteMany({ post: postId });
    return res.status(200).json({
      message: "Post deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
