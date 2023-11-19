import { RequestHandler } from "../types/index.js";
import { NotificationService } from "../services/index.js";

class ConversationController {
  static create: RequestHandler = async (req, res, next) => {
    try {
      const conv = await NotificationService.create({
        ...req.body,
      });
      res.status(200).json(conv);
    } catch (err) {
      next(err);
    }
  };
  static delete: RequestHandler = async (req, res, next) => {
    try {
      const conv = await NotificationService.delete(req.params.id);
      res.status(200).json(conv);
    } catch (err) {
      next(err);
    }
  };
  static get: RequestHandler = async (req, res, next) => {
    try {
      const notifs = await NotificationService.get(req.params.id);
      res.status(200).json(notifs);
    } catch (err) {
      next(err);
    }
  };
  static getSentNotifs: RequestHandler = async (req, res, next) => {
    try {
      const notifs = await NotificationService.getSentNotifs(req?._user?._id);
      res.status(200).json(notifs);
    } catch (err) {
      next(err);
    }
  };
  static getInBox: RequestHandler = async (req, res, next) => {
    try {
      const notifs = await NotificationService.getInBox(req?._user?._id);
      res.status(200).json(notifs);
    } catch (err) {
      next(err);
    }
  };
}

export default ConversationController;
