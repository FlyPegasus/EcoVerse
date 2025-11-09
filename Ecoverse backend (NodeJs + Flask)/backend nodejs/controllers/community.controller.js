// controllers/community/getTopContributors.js
import { User } from "../models/user.model.js";
import { ImagePost } from "../models/imgpost.model.js";

export const getTopContributors = async (req, res) => {
  try {
    const users = await User.find({})
      .populate("imgposts")
      .select("username profilePicture ecoPoints imgposts")
      .lean();

    const contributors = users.map((user) => ({
      id: user._id,
      name: user.username,
      avatar: user.profilePicture,
      coins: user.ecoPoints,
      posts: user.imgposts.length,
      badge: getBadge(user.ecoPoints),
      level: getLevel(user.ecoPoints),
    }));

    // Sort by ecoPoints descending and pick top 5
    contributors.sort((a, b) => b.coins - a.coins);
    res.status(200).json(contributors.slice(0, 5));
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching top contributors", error: err.message });
  }
};

const getBadge = (points) => {
  if (points >= 500) return "Environmental Champion";
  if (points >= 400) return "Climate Hero";
  if (points >= 300) return "Sustainability Expert";
  if (points >= 200) return "Eco Innovator";
  return "Green Pioneer";
};

const getLevel = (points) => {
  if (points >= 500) return "Gold";
  if (points >= 300) return "Silver";
  return "Bronze";
};
