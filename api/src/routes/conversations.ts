import express from "express";
import ConversationController from "../controllers/ConversationController.js";
import { verifyToken } from "../middlewares/index.js";
import Conversation from "../models/Conversation.js";

const router = express.Router();

router.get("/of-user", verifyToken, ConversationController.getOfUser);
router.get("/find/:conversationId", verifyToken, ConversationController.get);
router.get(
  "/current-users/:conversationId",
  verifyToken,
  ConversationController.getUsersOfConversation
);

router.post("/", verifyToken, ConversationController.create);
router.post("/check", verifyToken, ConversationController.check);
router.put(
  "/update-date/:convId",
  verifyToken,
  ConversationController.updateDate
);
router.put("/add-user/:convId", verifyToken, ConversationController.addUser);
router.put(
  "/delete-user/:convId",
  verifyToken,
  ConversationController.deleteUser
);
router.put("/edit/:convId", verifyToken, ConversationController.edit);
router.put(
  "/make-admin/:convId",
  verifyToken,
  ConversationController.makeAdmin
);
router.put(
  "/unmake-admin/:convId",
  verifyToken,
  ConversationController.unmakeAdmin
);
// SET LAST MESSAGE
router.put(
  "/last-message/:convId",
  verifyToken,
  ConversationController.setLastMessage
);
// DELETE BY ID
router.delete("/:convId", verifyToken, ConversationController.delete);
// TO DIALOGUE
router.post("/to-dialogue", verifyToken, ConversationController.toDialogue);

export default router;
