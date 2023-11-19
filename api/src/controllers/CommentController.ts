import { CommentService } from "../services/CommentService.js";
import { RequestHandler } from "../types/index.js";

class CommentController {
  static create: RequestHandler = async (req, res, next) => {
    try {
      const comment = await CommentService.create({
        ...req.body,
        comentatorId: req?._user?._id,
      });
      res.status(200).json(comment);
    } catch (err) {
      next(err);
    }
  };
  static getAllOfPost: RequestHandler = async (req, res, next) => {
    try {
      const comments = await CommentService.getMany(
        { postId: req.params.id },
        {},
        { populate: { path: "comentatorId", select: "username _id img" } }
      );
      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  };
}

export default CommentController;
