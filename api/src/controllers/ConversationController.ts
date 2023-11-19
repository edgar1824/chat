import { createError } from "../helpers/createError.js";
import Conversation from "../models/Conversation.js";
import { Types } from "mongoose";
import {
  ConversationService,
  MessageService,
  UserService,
} from "../services/index.js";
import { RequestHandler } from "types/index.js";

class ConversationController {
  static delete: RequestHandler = async (req, res, next) => {
    try {
      const conv = await ConversationService.delete(
        req.params.convId,
        req._user
      );
      res.status(200).json(conv);
    } catch (err) {
      next(err);
    }
  };
  static create: RequestHandler = async (req, res, next) => {
    try {
      const conv = await ConversationService.create({
        ...req.body,
        ...req.files,
      });
      res.status(200).json(conv);
    } catch (err) {
      next(err);
    }
  };
  static get: RequestHandler = async (req, res, next) => {
    try {
      const conv = await ConversationService.get({
        _id: req.params.conversationId,
      });
      res.status(200).json(conv);
    } catch (err) {
      next(err);
    }
  };
  static edit: RequestHandler = async (req, res, next) => {
    try {
      const conversation = await ConversationService.get({
        _id: req.params.convId,
      });
      if (
        conversation?.type !== "dialogue" &&
        (!(
          conversation?.admins?.length &&
          conversation.admins.includes(req?._user?._id as Types.ObjectId)
        ) ||
          req?._user?.isAdmin)
      ) {
        throw createError(500, "you are not Admin in this group");
      }
      const conv = await ConversationService.edit({
        id: req.params.convId,
        user: req._user,
        values: { ...req.body, ...req.files },
      });
      res.status(200).json(conv);
    } catch (err) {
      next(err);
    }
  };
  static getOfUser: RequestHandler = async (req, res, next) => {
    try {
      const convs = await ConversationService.getOfUser(req?._user?._id);
      res.status(200).json(convs);
    } catch (err) {
      next(err);
    }
  };
  static updateDate: RequestHandler = async (req, res, next) => {
    try {
      const conv = await Conversation.findByIdAndUpdate(req.params.convId, {
        $set: { updatedAt: Date.now() },
      });

      res.status(200).json(conv);
    } catch (err) {
      next(err);
    }
  };
  static check: RequestHandler = async (req, res, next) => {
    try {
      const conv = await ConversationService.check(
        req.body?.members,
        req.body?.type
      );
      res.status(200).json(conv);
    } catch (err) {
      next(err);
    }
  };
  static addUser: RequestHandler = async (req, res, next) => {
    try {
      const conv = await ConversationService.addUser(
        req.body.userId,
        req.params.convId,
        req._user
      );
      res.status(200).json(conv);
    } catch (err) {
      next(err);
    }
  };
  static deleteUser: RequestHandler = async (req, res, next) => {
    try {
      const conv = await ConversationService.deleteUser(
        req.body.userId,
        req.params.convId,
        req._user
      );
      res.status(200).json(conv);
    } catch (err) {
      next(err);
    }
  };
  static getUsersOfConversation: RequestHandler = async (req, res, next) => {
    try {
      const friends = await ConversationService.getUsersOfConversation(
        req.params.conversationId
      );
      res.status(200).json(friends);
    } catch (err) {
      next(err);
    }
  };
  static makeAdmin: RequestHandler = async (req, res, next) => {
    try {
      const friends = await ConversationService.makeAdmin(
        req.params.convId,
        req.body.userId
      );
      res.status(200).json(friends);
    } catch (err) {
      next(err);
    }
  };
  static unmakeAdmin: RequestHandler = async (req, res, next) => {
    try {
      const friends = await ConversationService.unmakeAdmin(
        req.params.convId,
        req.body.userId
      );
      res.status(200).json(friends);
    } catch (err) {
      next(err);
    }
  };
  static setLastMessage: RequestHandler = async (req, res, next) => {
    try {
      const messages = await MessageService.getMultiple({
        conversationId: req.params.convId,
      });
      const message = messages[messages.length - 1];
      if (messages?.length && message) {
        const conv = await ConversationService.edit({
          id: message?.conversationId,
          values: { lastMessage: message?._id },
        });
      }

      res.status(200).json({
        ...(message || message),
        message: "Conversation was updated successfully",
        success: true,
      });
    } catch (err) {
      next(err);
    }
  };
  static toDialogue: RequestHandler = async (req, res, next) => {
    try {
      const friend = await UserService.get(req.body.friendId);
      const me = await UserService.get(req?._user?._id);
      if (!friend?.friends.includes(req?._user?._id)) {
        throw createError(403, "You are not friends");
      }
      const conv = await ConversationService.get({
        members: { $all: [req.body.friendId, req?._user?._id] },
        type: "dialogue",
      });
      if (conv) {
        return res.status(200).json({ ...(conv || conv), new: false });
      }
      const newConv = await ConversationService.create({
        members: [req.body.friendId, req?._user?._id],
        title: [friend.username, me?.username],
        type: "dialogue",
      });

      return res.status(200).json({ ...newConv, new: true });
    } catch (err) {
      next(err);
    }
  };
}

export default ConversationController;
