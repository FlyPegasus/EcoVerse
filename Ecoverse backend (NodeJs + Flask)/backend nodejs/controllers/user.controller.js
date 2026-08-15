import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { APIError } from "../utils/APIError.js";

// register user
export const register = async (req, res) => {
  // try {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    // return res.status(401).json({
    //   message: "Something is missing!!",
    //   success: false,
    // });
    throw new APIError("All fields are required", 400);
  }
  // already user exists by that email
  const user = await User.findOne({ email });
  if (user) {
    return res.status(401).json({
      message: "Try different email",
      success: false,
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({
      username,
      email,
      hashedPassword,
    });
    return res.status(200).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "User already exists.",
      success: false,
    });
  }
};

// user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing!!",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      gender: user.gender,
      ecoPoints: user.ecoPoints,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      bookmarks: user.bookmarks,
      createdAt: user.createdAt,
    };
    // create token and send it to the client
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (_, res) => {
  try {
    // const x = res.cookie("token");
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
      // test: x,
    });
  } catch (error) {
    console.log(error);
  }
};

// get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId); //.populate({path:'posts', createdAt:-1}).populate('bookmarks');
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// edit user profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    // console.log(userId);
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile updated.",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

// follow or unfollow user

// const follow

// refresh user profile
export const refreshProfile = async (req, res) => {
  try {
    const userId = req.id;
    let user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// stats of user
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Total Likes
    const totalLikesAgg = await ImagePost.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      { $project: { likeCount: { $size: "$likes" } } },
      { $group: { _id: null, totalLikes: { $sum: "$likeCount" } } },
    ]);
    const totalLikes = totalLikesAgg[0]?.totalLikes || 0;

    // Total Views
    const totalViewsAgg = await ImagePost.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const totalViews = totalViewsAgg[0]?.totalViews || 0;

    // Posts This Month
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const postsThisMonth = await ImagePost.countDocuments({
      author: userId,
      createdAt: { $gte: startOfMonth },
    });

    // Eco Impact (based on ecoPoints field)
    const ecoImpact = Math.min(Math.floor(user.ecoPoints / 10), 100); // scale to 0-100%

    // Monthly Activity (bar chart)
    const postsByMonth = await ImagePost.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlyActivity = Array(12).fill(0);
    postsByMonth.forEach(({ _id, count }) => {
      monthlyActivity[_id - 1] = count;
    });

    return res.json({
      totalLikes,
      totalViews,
      postsThisMonth,
      ecoImpact,
      monthlyActivity,
    });
  } catch (error) {
    console.error("Error getting user stats:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
