var _a;
import { createError } from "../helpers/createError.js";
import Conversation from "../models/Conversation.js";
import { ConversationService, MessageService, UserService, } from "../services/index.js";
class ConversationController {
}
_a = ConversationController;
ConversationController.delete = async (req, res, next) => {
    try {
        const conv = await ConversationService.delete(req.params.convId, req._user);
        res.status(200).json(conv);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.create = async (req, res, next) => {
    try {
        const conv = await ConversationService.create({
            ...req.body,
            ...req.files,
        });
        res.status(200).json(conv);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.get = async (req, res, next) => {
    try {
        const conv = await ConversationService.get({
            _id: req.params.conversationId,
        });
        res.status(200).json(conv);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.edit = async (req, res, next) => {
    try {
        const conversation = await ConversationService.get({
            _id: req.params.convId,
        });
        if (conversation?.type !== "dialogue" &&
            (!(conversation?.admins?.length &&
                conversation.admins.includes(req?._user?._id)) ||
                req?._user?.isAdmin)) {
            throw createError(500, "you are not Admin in this group");
        }
        const conv = await ConversationService.edit({
            id: req.params.convId,
            user: req._user,
            values: { ...req.body, ...req.files },
        });
        res.status(200).json(conv);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.getOfUser = async (req, res, next) => {
    try {
        const convs = await ConversationService.getOfUser(req?._user?._id);
        res.status(200).json(convs);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.updateDate = async (req, res, next) => {
    try {
        const conv = await Conversation.findByIdAndUpdate(req.params.convId, {
            $set: { updatedAt: Date.now() },
        });
        res.status(200).json(conv);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.check = async (req, res, next) => {
    try {
        const conv = await ConversationService.check(req.body?.members, req.body?.type);
        res.status(200).json(conv);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.addUser = async (req, res, next) => {
    try {
        const conv = await ConversationService.addUser(req.body.userId, req.params.convId, req._user);
        res.status(200).json(conv);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.deleteUser = async (req, res, next) => {
    try {
        const conv = await ConversationService.deleteUser(req.body.userId, req.params.convId, req._user);
        res.status(200).json(conv);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.getUsersOfConversation = async (req, res, next) => {
    try {
        const friends = await ConversationService.getUsersOfConversation(req.params.conversationId);
        res.status(200).json(friends);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.makeAdmin = async (req, res, next) => {
    try {
        const friends = await ConversationService.makeAdmin(req.params.convId, req.body.userId);
        res.status(200).json(friends);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.unmakeAdmin = async (req, res, next) => {
    try {
        const friends = await ConversationService.unmakeAdmin(req.params.convId, req.body.userId);
        res.status(200).json(friends);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.setLastMessage = async (req, res, next) => {
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
    }
    catch (err) {
        next(err);
    }
};
ConversationController.toDialogue = async (req, res, next) => {
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
    }
    catch (err) {
        next(err);
    }
};
export default ConversationController;
//# sourceMappingURL=ConversationController.js.map