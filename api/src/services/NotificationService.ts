import { createError } from "../helpers/createError.js";
import Notification from "../models/Notification.js";

export class NotificationService {
  // {sender, type, text, title, recievers}
  static create = async (body) => {
    const candidate = await Notification.findOne({ ...body });
    if (candidate && body.type === "be-friend") {
      throw createError(409, "There is already notification like that");
    }
    const newNotif = new Notification({ ...body });
    const savedMessage = await newNotif.save();
    return savedMessage;
  };
  static get = async (id) => {
    const notif = await Notification.findOne({ _id: id })
      .select("-recievers")
      .populate("sender", ["-password", "-isAdmin"]);
    return notif;
  };
  static getSentNotifs = async (userId) => {
    const notifs = await Notification.find({ sender: userId })
      .populate("recievers", ["-password", "-isAdmin"])
      .sort({ createdAt: -1 })
      .exec();

    return notifs;
  };
  static getInBox = async (userId) => {
    const notifs = await Notification.find({
      recievers: { $in: [userId] },
    })
      .select("-recievers -sender")
      .sort({ createdAt: -1 });
    return notifs;
  };
  static delete = async (id) => {
    const notif = await Notification.findByIdAndDelete(id);
    return notif;
  };
}
