var _a;
import { NotificationService } from "../services/index.js";
class ConversationController {
}
_a = ConversationController;
ConversationController.create = async (req, res, next) => {
    try {
        const conv = await NotificationService.create({
            ...req.body,
        });
        res.status(200).json(conv);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.delete = async (req, res, next) => {
    try {
        const conv = await NotificationService.delete(req.params.id);
        res.status(200).json(conv);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.get = async (req, res, next) => {
    try {
        const notifs = await NotificationService.get(req.params.id);
        res.status(200).json(notifs);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.getSentNotifs = async (req, res, next) => {
    try {
        const notifs = await NotificationService.getSentNotifs(req?._user?._id);
        res.status(200).json(notifs);
    }
    catch (err) {
        next(err);
    }
};
ConversationController.getInBox = async (req, res, next) => {
    try {
        const notifs = await NotificationService.getInBox(req?._user?._id);
        res.status(200).json(notifs);
    }
    catch (err) {
        next(err);
    }
};
export default ConversationController;
//# sourceMappingURL=NotificationController.js.map