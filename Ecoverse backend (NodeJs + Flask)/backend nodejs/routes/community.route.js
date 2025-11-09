import express from "express";
import { getTopContributors } from "../controllers/community.controller.js";

const router = express.Router();

router.route("/get").get(getTopContributors);

export default router;
