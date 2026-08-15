import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import mapRoute from "./routes/map.route.js";
import postRoute from "./routes/post.route.js";
import communityRoute from "./routes/community.route.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config({});

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

// Standard middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/map", mapRoute);
app.use("/api/v1/community", communityRoute);

// Error handling middleware (must be after routes, passed without parentheses)
app.use(errorHandler);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server listening on PORT ${PORT}`);
});