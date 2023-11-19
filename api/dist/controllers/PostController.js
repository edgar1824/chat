var _a;
import { createError } from "../helpers/createError.js";
import { PostService, UserService } from "../services/index.js";
class PostController {
}
_a = PostController;
PostController.delete = async (req, res, next) => {
    try {
        const post = await PostService.getOne({ _id: req.params.id });
        if (req?._user?._id !== post._id)
            throw createError(403, "This is not your post!");
        const deletedPost = await PostService.deleteOne({ _id: req.params.id });
        res.status(200).json({
            ...deletedPost,
            success: true,
            message: "post deleted successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
PostController.create = async (req, res, next) => {
    try {
        const psot = await PostService.create({
            user: req?._user?._id,
            ...req.body,
            ...req.files,
        });
        res.status(200).json(psot);
    }
    catch (err) {
        next(err);
    }
};
PostController.getMyPosts = async (req, res, next) => {
    try {
        const posts = await PostService.getMultiple({ user: req?._user?._id }, {}, {
            lean: true,
            sort: { createdAt: -1 },
            populate: { path: "user", select: "username img _id" },
        });
        res.status(200).json(posts.map((p) => ({
            ...p,
            likes: p.likes.length,
            watched: p.watched.length,
            hasMyLike: p.likes.includes(req._user._id),
            haveWatched: p.likes.includes(req._user._id),
        })));
    }
    catch (err) {
        next(err);
    }
};
PostController.getNewPosts = async (req, res, next) => {
    try {
        const me = await UserService.get(req?._user?._id);
        const friends_ids = [...me.friends, me._id]
            ?.filter(Boolean)
            .filter((id) => id !== "0");
        const posts = await PostService.getMultiple({ user: friends_ids }, {}, {
            sort: { createdAt: -1 },
            lean: true,
            populate: { path: "user", select: "username img _id" },
        });
        res.status(200).json(posts.map((p) => ({
            ...p,
            likes: p.likes.length,
            watched: p.watched.length,
            hasMyLike: p.likes
                .map((e) => e.toString())
                .includes(req._user._id.toString()),
            haveWatched: p.watched
                .map((e) => e.toString())
                .includes(req._user._id.toString()),
        })));
    }
    catch (err) {
        next(err);
    }
};
PostController.addLike = async (req, res, next) => {
    try {
        const post = await PostService.getOne({ _id: req.body.postId });
        post.likes.push(req._user._id);
        await post.save();
        res.status(200).json({
            ...post,
            likes: post.likes.length,
            watched: post.watched.length,
            hasMyLike: post.likes
                .map((e) => e.toString())
                .includes(req._user._id.toString()),
            haveWatched: post.watched
                .map((e) => e.toString())
                .includes(req._user._id.toString()),
        });
    }
    catch (err) {
        next(err);
    }
};
PostController.deleteLike = async (req, res, next) => {
    try {
        const post = await PostService.getOne({ _id: req.body.postId });
        post.likes = post.likes.filter((l) => l.toString() !== req._user._id.toString());
        await post.save();
        res.status(200).json({
            ...post,
            likes: post.likes.length,
            watched: post.watched.length,
            hasMyLike: post.likes
                .map((e) => e.toString())
                .includes(req._user._id.toString()),
            haveWatched: post.watched
                .map((e) => e.toString())
                .includes(req._user._id.toString()),
        });
    }
    catch (err) {
        next(err);
    }
};
PostController.addWatched = async (req, res, next) => {
    try {
        const post = await PostService.getOne({ _id: req.body.postId });
        if (!post.watched.some((e) => e.toString() === req._user._id.toString())) {
            post.watched.push(req._user._id);
            await post.save();
        }
        res.status(200).json({
            ...post.toObject(),
            likes: post.likes.length,
            watched: post.watched.length,
            hasMyLike: post.likes
                .map((e) => e.toString())
                .includes(req._user._id.toString()),
            haveWatched: post.watched
                .map((e) => e.toString())
                .includes(req._user._id.toString()),
        });
    }
    catch (err) {
        next(err);
    }
};
export default PostController;
//# sourceMappingURL=PostController.js.map