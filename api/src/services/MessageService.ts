import { IDelete, IFind } from "types/index.js";
import Conversation from "../models/Conversation.js";
import Message, { IMessage } from "../models/Message.js";
import UploadService from "./UploadService.js";

export class MessageService {
  static add = async (body, audio) => {
    const convId = body.conversationId;

    if (audio) body = { ...body, audio };

    const newMessage = new Message(body);
    const savedMessage = await newMessage.save();
    if (body.sender === process.env.REACT_APP_CHAT_GROUP_MESSAGE_ID) {
      return savedMessage;
    }

    await Conversation.updateOne(
      { _id: convId },
      { $set: { lastMessage: savedMessage._id } },
      { new: true }
    );
    return savedMessage;
  };
  static getMultiple = async (...options: IFind<IMessage>) => {
    const messages = await Message.find(...options);
    // const messages = await Message.find({}, {}, { limit });
    return messages;
  };
  static edit = async (id, body) => {
    const message = await Message.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true }
    );
    return message;
    // throw createError(500, "already has that user in message.watched");
  };
  static get = async (...options: IFind<IMessage>) => {
    const message = await Message.findOne(...options);
    return message;
  };
  static delete = async (...options: IDelete<IMessage>) => {
    const message = await this.get(...options);
    if (message?.audio) UploadService.delete(message?.audio);
    const removedMessage = await Message.deleteOne({ _id: message?._id });
    return removedMessage;
  };
  static deleteMultiple = async (options: IDelete<IMessage>) => {
    const messages = await Message.find(options);
    UploadService.delete(...messages?.map((m) => m?.audio));
    await Message.deleteMany({ _id: { $in: [messages?.map((m) => m?._id)] } });
    return messages;
  };
}
