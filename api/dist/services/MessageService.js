var _a;
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import UploadService from "./UploadService.js";
export class MessageService {
}
_a = MessageService;
MessageService.add = async (body, audio) => {
    const convId = body.conversationId;
    if (audio)
        body = { ...body, audio };
    const newMessage = new Message(body);
    const savedMessage = await newMessage.save();
    if (body.sender === process.env.REACT_APP_CHAT_GROUP_MESSAGE_ID) {
        return savedMessage;
    }
    await Conversation.updateOne({ _id: convId }, { $set: { lastMessage: savedMessage._id } }, { new: true });
    return savedMessage;
};
MessageService.getMultiple = async (...options) => {
    const messages = await Message.find(...options);
    // const messages = await Message.find({}, {}, { limit });
    return messages;
};
MessageService.edit = async (id, body) => {
    const message = await Message.findOneAndUpdate({ _id: id }, { $set: body }, { new: true });
    return message;
    // throw createError(500, "already has that user in message.watched");
};
MessageService.get = async (...options) => {
    const message = await Message.findOne(...options);
    return message;
};
MessageService.delete = async (...options) => {
    const message = await _a.get(...options);
    if (message?.audio)
        UploadService.delete(message?.audio);
    const removedMessage = await Message.deleteOne({ _id: message?._id });
    return removedMessage;
};
MessageService.deleteMultiple = async (options) => {
    const messages = await Message.find(options);
    UploadService.delete(...messages?.map((m) => m?.audio));
    await Message.deleteMany({ _id: { $in: [messages?.map((m) => m?._id)] } });
    return messages;
};
//# sourceMappingURL=MessageService.js.map