var _a;
import { paginate } from "../middlewares/paginate.js";
import User from "../models/User.js";
import { UserService } from "../services/index.js";
class UserController {
}
_a = UserController;
UserController.updateUser = async (req, res, next) => {
    try {
        const updatedUser = await UserService.update(req.params.id, {
            ...req.body,
            img: req.files ? req.files?.img : req.body?.img,
        });
        res.status(200).json(updatedUser);
    }
    catch (err) {
        next(err);
    }
};
UserController.deleteUser = async (req, res, next) => {
    try {
        await UserService.delete(req.params.id);
        res.status(200).json({
            message: `User was deleted by id: ${req.params.id}`,
        });
    }
    catch (err) {
        next(err);
    }
};
UserController.getUser = async (req, res, next) => {
    try {
        const user = await UserService.get(req.params.id);
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
};
UserController.getPrivateUser = async (req, res, next) => {
    try {
        const user = await UserService.getPrivate(req.params.id);
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
};
UserController.getUsers = async (req, res, next) => {
    try {
        const user = await UserService.getAll(req.query);
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
};
UserController.getNotPrivateUsers = async (req, res, next) => {
    try {
        if (req.query?.page && res?.paginated && Object.keys(req.query).length) {
            return res.status(200).json(res.paginated);
        }
        const users = await UserService.getNotPrivateUsers(req.query);
        res.status(200).json(users);
    }
    catch (err) {
        next(err);
    }
};
UserController.addFriend = async (req, res, next) => {
    try {
        const data = await UserService.addFriend({
            ...req.body,
            senderId: req?._user?._id,
        });
        res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
};
UserController.deleteFriend = async (req, res, next) => {
    try {
        const user = await UserService.deleteFriend({
            senderId: req?._user?._id,
            ...req.body,
        });
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
};
UserController.getAllFriendsId = async (req, res, next) => {
    try {
        const ids = await UserService.getAllFriendsId(req?._user?._id);
        res.status(200).json(ids);
    }
    catch (err) {
        next(err);
    }
};
UserController.getMyInfo = async (req, res, next) => {
    try {
        const { username, img, city, email, phone, friends, _id, country } = await UserService.get(req?._user?._id);
        res
            .status(200)
            .json({ username, img, city, email, phone, friends, _id, country });
    }
    catch (err) {
        next(err);
    }
};
UserController.getFriends = async (req, res, next) => {
    try {
        const me = await User.findOne({ _id: req?._user?._id });
        req.query.include = [
            ...me?.friends.filter((el) => !!el && el !== "0"),
        ].join(",");
        req.query.exclude = req?._user?._id.toString();
        await paginate(User, false)(req, res, next);
        res.status(200).json(res.paginated);
    }
    catch (err) {
        next(err);
    }
};
export default UserController;
//# sourceMappingURL=UserController.js.map