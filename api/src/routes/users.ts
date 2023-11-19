import express from "express";
import UserController from "../controllers/UserController.js";
import {
  paginate,
  verifyAdmin,
  verifyUser,
  verifyToken,
} from "../middlewares/index.js";
import User from "../models/User.js";

const router = express.Router();

// UPDATE
router.put("/update/:id", verifyUser, UserController.updateUser);
router.put("/add-friend", verifyToken, UserController.addFriend);
router.put("/delete-friend", verifyToken, UserController.deleteFriend);
// DELETE
router.delete("/:id", verifyUser, UserController.deleteUser);
// GET
router.get("/find/private/:id", verifyUser, UserController.getUser);
router.get("/find/not-private/:id", verifyToken, UserController.getPrivateUser);
router.get("/friends-ids", verifyToken, UserController.getAllFriendsId);
// GET ALL
router.get("/private", verifyAdmin, UserController.getUsers);
router.get(
  "/not-private",
  verifyToken,
  paginate(User),
  UserController.getNotPrivateUsers
);
// GET MY PERSONAL INFO
router.get("/my-info", verifyToken, UserController.getMyInfo);
router.get("/friends", verifyToken, UserController.getFriends);

export default router;
