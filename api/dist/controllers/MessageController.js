var _a;
import { createError } from "../helpers/createError.js";
import { MessageService } from "../services/index.js";
class MessageController {
}
_a = MessageController;
MessageController.add = async (req, res, next) => {
    try {
        const savedMessage = await MessageService.add(req.body, req?.files?.audio);
        res.status(200).json(savedMessage);
    }
    catch (err) {
        next(err);
    }
};
MessageController.getOfConversation = async (req, res, next) => {
    try {
        const messages = await MessageService.getMultiple({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    }
    catch (err) {
        next(err);
    }
};
MessageController.addWatched = async (req, res, next) => {
    try {
        const message = await MessageService.get({ _id: req.params.id });
        const editedMessage = await MessageService.edit(req.params.id, {
            watched: [...message?.watched, req.body.userId],
        });
        res.status(200).json(editedMessage);
    }
    catch (err) {
        next(err);
    }
};
MessageController.delete = async (req, res, next) => {
    try {
        const message = await MessageService.get({ _id: req.params?.id });
        if (!message)
            throw createError(404, "Message not found!");
        if (req._user?._id !== message?.sender)
            throw createError(403, "This is not the message that you send!");
        const removedMessage = await MessageService.delete({ _id: message?._id });
        if (removedMessage?.deletedCount < 1)
            throw createError(404, "Message not found!");
        res
            .status(200)
            .json({ success: true, message: "Message deleted successfully" });
    }
    catch (err) {
        next(err);
    }
};
export default MessageController;
//# sourceMappingURL=MessageController.js.map