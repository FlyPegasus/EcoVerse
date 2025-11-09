import express from "express";
import {
  login,
  register,
  logout,
  getProfile,
  editProfile,
  refreshProfile,
  getUserStats,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/me").get(isAuthenticated, refreshProfile);
router.route("/login").post(login, isAuthenticated);
router.route("/logout").get(logout);
router.route("/:id/profile").get(getProfile, isAuthenticated);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePhoto"), editProfile);
router.route("/:userId/stats").get(getUserStats);

export default router;
