import express from "express";
import MessageController from "../controllers/MessageController.js";
import { verifyToken, verifyUser } from "../middlewares/index.js";
import Message from "../models/Message.js";

const router = express.Router();

// CREATE
router.post("/", verifyToken, MessageController.add);
// GET
router.get(
  "/find/:conversationId",
  verifyToken,
  MessageController.getOfConversation
);
// PUT
router.put("/watched/:id", verifyToken, MessageController.addWatched);
// DELETE
router.delete("/delete/:id", verifyToken, MessageController.delete);

router.delete("/", async (req, res) => {
  await Message.deleteMany();
  res.json({ message: "success" });
});

export default router;
