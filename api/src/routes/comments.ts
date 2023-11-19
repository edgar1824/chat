import express from "express";
import CommentController from "../controllers/CommentController.js";
import { verifyToken } from "../middlewares/index.js";

const router = express.Router();

// CREATE
router.post("/", verifyToken, CommentController.create);
// GET
router.get("/of-post/:id", verifyToken, CommentController.getAllOfPost);

export default router;
