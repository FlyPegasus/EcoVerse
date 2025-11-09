import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
  addNewPost,
  getAllPost,
  addComment,
  getCommentsOfPost,
  likePost,
  dislikePost,
  deletePost,
} from "../controllers/imgpost.controller.js";

const router = express.Router();

router
  .route("/addpost")
  .post(isAuthenticated, upload.single("image"), addNewPost);
router.route("/all").get(getAllPost);
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);

export default router;
