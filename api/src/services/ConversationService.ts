import mongoose, { Types } from "mongoose";
import { IMe } from "../types/index.js";
import { createError } from "../helpers/createError.js";
import Conversation, { IConversation } from "../models/Conversation.js";
import { MessageService } from "./MessageService.js";
import UploadService from "./UploadService.js";
import { UserService } from "./UserService.js";

export class ConversationService {
  static delete = async (id, me?: IMe) => {
    const conv = await Conversation.findOne({ _id: id });
    if (
      conv.type === "group" &&
      !(
        (conv?.admins?.length &&
          conv.admins.includes(me?._id as Types.ObjectId)) ||
        me?.isAdmin
      ) &&
      conv.members.length > 1
    ) {
      throw createError(500, "you are not Admin in this group");
    }
    const messages = await MessageService.getMultiple({
      conversationId: conv?._id,
    });
    if (messages) {
      await Promise.all(
        messages.map((m) => MessageService.delete({ _id: m?._id }))
      );
    }
    UploadService.delete(conv?.img);
    await conv.deleteOne();
    return conv;
  };
  static get = async (...options) => {
    const conv = await Conversation.findOne(...options);
    return conv;
  };
  static edit = async ({
    id,
    user,
    values,
  }: {
    id?: Types.ObjectId | string;
    user?: IMe;
    values?: Partial<IConversation>;
  }) => {
    const conv = await Conversation.findOne({ _id: id });
    if (values?.img && values.img !== conv?.img) UploadService.delete(conv.img);
    const newConv = await Conversation.findOneAndUpdate(
      { _id: id },
      { $set: { ...values } },
      { new: true }
    );
    return newConv;
  };
  static create = async ({
    members,
    img,
    title,
    _id,
    ...rest
  }: Partial<IConversation>) => {
    const conv = new Conversation({
      _id: _id || new mongoose.Types.ObjectId(),
      members,
      img: img || "https://cdn-icons-png.flaticon.com/512/25/25437.png",
      title: title ? title : members?.length > 2 ? "Group" : "Dialogue",
      ...rest,
    });
    const newDoc = await conv.save();
    return newDoc;
  };
  static getOfUser = async (userId) => {
    const conv = await Conversation.find({
      members: { $in: [userId] },
    }).populate({
      path: "lastMessage",
      select: ["text", "sender", "createdAt"],
      populate: { path: "sender", select: "username" },
    });

    return conv;
  };
  static getUsersOfConversation = async (conversationId) => {
    const conv = await this.get({ _id: conversationId });
    const users = await Promise.all(
      conv.members.map((member) => UserService.getPrivate(member))
    );
    return users;
  };
  static check = async (members, type) => {
    const cand = await Conversation.findOne({ members: [...members], type });
    return cand;
  };
  static addUser = async (userId, conversationId, user) => {
    const conv = await Conversation.findOne({ _id: conversationId });
    if (conv.type === "dialogue")
      throw createError(403, "You can't add user in dialogue!");
    if (
      !(
        (conv?.admins?.length && conv.admins.includes(user._id)) ||
        user.isAdmin
      )
    ) {
      throw createError(500, "you are not Admin in this group");
    }
    conv.members.push(userId);
    const res = await conv.save();
    return res;
  };
  static deleteUser = async (userId, conversationId, user) => {
    const conv = await Conversation.findOne({ _id: conversationId });
    if (conv.type === "dialogue") {
      if (userId === user?._id) {
        const leftUser = await UserService.get(userId);
        const res = await this.delete(conversationId, user);
        return {
          message: `Dialogue was closed because ${leftUser?.username} left`,
          success: true,
          type: "removed",
          ...res,
        };
      } else {
        throw createError(403, "You can't delete user from dialogue!");
      }
    }
    if (
      !(
        (conv?.admins?.length && conv.admins.includes(user._id)) ||
        user._id === userId ||
        user.isAdmin
      ) &&
      conv.members.length > 1
    ) {
      throw createError(500, "you are not Admin in this group");
    }
    conv.members = conv.members.filter((m) => m != userId);
    const res = await conv.save();

    if (!res?.members?.length) {
      await this.delete(conversationId, user);
      return {
        message: "Conversation was deleted because all members left the group",
        success: true,
        type: "removed",
      };
    }
    return res;
  };
  static makeAdmin = async (conversationId, userId) => {
    const conv = await Conversation.findOne({ _id: conversationId });
    if (conv.type === "dialogue")
      throw createError(403, "There is no Admins in dialogue!");
    if (!conv?.admins?.length || conv.admins.includes(userId)) {
      throw createError(500, "You are already Admin in this group");
    }
    conv.admins.push(userId);
    const res = await conv.save();
    return res;
  };
  static unmakeAdmin = async (conversationId, userId) => {
    const conv = await Conversation.findOne({ _id: conversationId });
    if (conv.type === "dialogue")
      throw createError(403, "There is no Admins in dialogue!");
    if (!conv?.admins?.length || !conv.admins.includes(userId)) {
      throw createError(500, "User is not Admin in this group");
    }
    conv.admins = conv.admins.filter((m) => m !== userId);
    const res = await conv.save();
    return res;
  };
}
