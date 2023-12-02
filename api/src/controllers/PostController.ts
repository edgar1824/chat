import { Document, Types } from "mongoose";
import { createError } from "../helpers/createError.js";
import { PostService, UserService } from "../services/index.js";
import { RequestHandler } from "../types/index.js";
import { IPost } from "../models/Post.js";
import { CommentService } from "../services/CommentService.js";

const convertToResp = async (
  post: Document<unknown, {}, IPost> &
    IPost & {
      _id: Types.ObjectId;
    },
  req: Parameters<RequestHandler>[0]
) => {
  const peopleLiked = (
    await UserService.getAll({
      _id: { $in: post.likes.slice(0, 3).map((e) => e.toString()) },
    })
  ).map((u) => u?.img);
  const commentCount = await CommentService.getMany({ postId: post._id });
  const result = {
    ...post,
    peopleLiked,
    commentCount: commentCount.length,
    likes: post.likes.length,
    watched: post.watched.length,
    hasMyLike: post.likes
      .map((e) => e.toString())
      .includes(req._user._id.toString()),
    haveWatched: post.watched
      .map((e) => e.toString())
      .includes(req._user._id.toString()),
  };
  return result;
};

class PostController {
  static delete: RequestHandler = async (req, res, next) => {
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
    } catch (err) {
      next(err);
    }
  };
  static create: RequestHandler = async (req, res, next) => {
    try {
      const psot = await PostService.create({
        user: req?._user?._id,
        ...req.body,
        ...req.files,
      });
      res.status(200).json(psot);
    } catch (err) {
      next(err);
    }
  };
  static getById: RequestHandler = async (req, res, next) => {
    try {
      const post = await PostService.getOne(
        { _id: req.params.id },
        {},
        { lean: true, populate: { path: "user", select: "username img _id" } }
      );

      res.status(200).json(await convertToResp(post, req));
    } catch (err) {
      next(err);
    }
  };
  static getMyPosts: RequestHandler = async (req, res, next) => {
    try {
      const posts = await PostService.getMultiple(
        { user: req?._user?._id },
        {},
        {
          lean: true,
          sort: { createdAt: -1 },
          populate: { path: "user", select: "username img _id" },
        }
      );
      res
        .status(200)
        .json(
          await Promise.all(posts.map(async (p) => await convertToResp(p, req)))
        );
    } catch (err) {
      next(err);
    }
  };
  static getNewPosts: RequestHandler = async (req, res, next) => {
    try {
      const me = await UserService.get(req?._user?._id);
      const friends_ids = [...me.friends, me._id]
        ?.filter(Boolean)
        .filter((id) => id !== "0");
      const posts = await PostService.getMultiple(
        { user: friends_ids },
        {},
        {
          sort: { createdAt: -1 },
          lean: true,
          populate: { path: "user", select: "username img _id" },
        }
      );

      res
        .status(200)
        .json(
          await Promise.all(posts.map(async (p) => await convertToResp(p, req)))
        );
    } catch (err) {
      next(err);
    }
  };
  static addLike: RequestHandler = async (req, res, next) => {
    try {
      const post = await PostService.getOne({ _id: req.body.postId });
      post.likes.push(req._user._id);
      const newPost = await post.save();
      const obj = "_doc" in newPost && (newPost?._doc as typeof newPost);
      res.status(200).json(await convertToResp(obj, req));
    } catch (err) {
      next(err);
    }
  };
  static deleteLike: RequestHandler = async (req, res, next) => {
    try {
      const post = await PostService.getOne({ _id: req.body.postId });
      post.likes = post.likes.filter(
        (l) => l.toString() !== req._user._id.toString()
      );
      const newPost = await post.save();
      const obj = "_doc" in newPost && (newPost?._doc as typeof newPost);
      res.status(200).json(await convertToResp(obj, req));
    } catch (err) {
      next(err);
    }
  };
  static addWatched: RequestHandler = async (req, res, next) => {
    try {
      const post = await PostService.getOne({ _id: req.body.postId });
      let newPost, obj;

      if (
        !post.watched.some((e) => e.toString() === req._user._id.toString())
      ) {
        post.watched.push(req._user._id);
        newPost = await post.save();
        obj = "_doc" in newPost && (newPost?._doc as typeof newPost);
      }
      res.status(200).json(await convertToResp(obj, req));
    } catch (err) {
      next(err);
    }
  };
}

export default PostController;
