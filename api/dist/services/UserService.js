var _a;
import { createError } from "../helpers/createError.js";
import User from "../models/User.js";
import { NotificationService } from "./NotificationService.js";
import { ConversationService } from "./ConversationService.js";
import UploadService from "./UploadService.js";
export class UserService {
}
_a = UserService;
UserService.update = async (id, body) => {
    const user = await User.findById(id);
    if (body.img && body.img !== user.img) {
        UploadService.delete(user.img);
    }
    const updatedUser = await User.findByIdAndUpdate(id, { $set: body }, { new: true }).select(["-password", "-isAdmin"]);
    return updatedUser;
};
UserService.delete = async (id) => {
    const user = await User.findByIdAndDelete(id);
    UploadService.delete(user.img);
    return user;
};
UserService.get = async (id) => {
    const user = await User.findById(id);
    if (!user)
        throw createError(404, "User not defined!");
    return user;
};
UserService.getPrivate = async (id) => {
    const user = await User.findById(id).select(["-isAdmin", "-password"]);
    return user;
};
UserService.getAll = async (options) => {
    const users = await User.find(options);
    return users;
};
UserService.getNotPrivateUsers = async ({ include }) => {
    if (include !== undefined && include !== null) {
        const users = await User.find({
            _id: { $in: [...include.split(",")?.filter((e) => !!e)] },
        }).select(["-isAdmin", "-password"]);
        return users;
    }
    const users = await User.find().select(["-isAdmin", "-password"]);
    return users;
};
UserService.addFriend = async ({ senderId, friendId }) => {
    const sender = await User.findOne({ _id: senderId });
    if (sender.friends.includes(friendId)) {
        throw createError(409, `You already have that friend`);
    }
    sender.friends = sender.friends.filter((f) => !!f && f !== "0");
    sender.friends.push(friendId);
    await sender.save();
    const friend = await User.findOneAndUpdate({ _id: friendId }, { $push: { friends: senderId } }, { new: true });
    const notif = await NotificationService.create({
        sender: senderId,
        type: "friend-added",
        text: `You have been added to ${sender?.username}'s friends`,
        title: "Added to friends",
        recievers: [friendId],
    });
    return {
        notif,
        senderId,
        friendId,
        message: `${friend.username} was added to your friends`,
    };
};
UserService.deleteFriend = async ({ senderId, friendId }) => {
    const sender = await User.findOne({ _id: senderId });
    if (!sender.friends.includes(friendId)) {
        throw createError(404, `You don't have such friend!`);
    }
    sender.friends = sender.friends.filter((f) => f !== friendId && f !== "0" && !!f);
    await sender.save();
    const friend = await User.findOneAndUpdate({ _id: friendId }, { $pull: { friends: senderId } }, { new: true });
    const dialogue = await ConversationService.get({
        members: [friendId, senderId],
    });
    if (dialogue)
        await ConversationService.delete(dialogue?._id);
    const notif = await NotificationService.create({
        sender: senderId,
        type: "friend-removed",
        text: `You have been removed from ${sender?.username}'s friends`,
        title: "Removed from friends",
        recievers: [friendId],
    });
    return {
        notif,
        deletedConv: dialogue?._id,
        senderId,
        friendId,
        message: `${friend.username} was removed from your friends`,
    };
};
UserService.getAllFriendsId = async (userId) => {
    const user = await User.findOne({ _id: userId });
    return user.friends;
};
//# sourceMappingURL=UserService.js.map