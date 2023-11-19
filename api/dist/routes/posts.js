import express from "express";
import PostController from "../controllers/PostController.js";
import { verifyToken } from "../middlewares/index.js";
const router = express.Router();
// CREATE
router.post("/", verifyToken, PostController.create);
// GET POSTS OF USER
router.get("/my-posts", verifyToken, PostController.getMyPosts);
// DELETE
router.delete("/:id", verifyToken, PostController.delete);
// GET NEW POSTS OF FRIENDS
router.get("/get-new-posts", verifyToken, PostController.getNewPosts);
// Add LIKE
router.put("/add-like", verifyToken, PostController.addLike);
// DELETE LIKE
router.put("/delete-like", verifyToken, PostController.deleteLike);
// Add Watched
router.put("/add-watched", verifyToken, PostController.addWatched);
export default router;
//# sourceMappingURL=posts.js.map