import express from "express";
import { dummyMap, getHeatmapData } from "../controllers/map.controller.js";

const router = express.Router();

router.route("/heatmap").get(getHeatmapData);

export default router;
