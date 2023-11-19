import express from "express";
import NotificationController from "../controllers/NotificationController.js";
import { verifyToken, verifyUser } from "../middlewares/index.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// CREATE
router.post("/", verifyToken, NotificationController.create);

// OUT-BOX
router.get("/sent-notifs", verifyToken, NotificationController.getSentNotifs);
// IN-BOX
router.get("/in-box", verifyToken, NotificationController.getInBox);
// GET ONE
router.get("/find/:id", verifyToken, NotificationController.get);

// DELETE
router.delete("/:id", verifyToken, NotificationController.delete);

// DELETE ALL
router.delete("/", async (req, res, next) => {
  try {
    const notifs = await Notification.deleteMany();
    res.status(200).json({ message: "notifications deleted succesfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
