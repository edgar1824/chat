import Comment, { IComment } from "../models/Comment.js";
import { IDelete, IFind } from "../types/index.js";

export class CommentService {
  static create = async (body: IComment) => {
    const comment = new Comment(body);
    await comment.save();
    return comment;
  };
  static delete = async (...options: IDelete<Comment>) => {
    const deletedComment = await Comment.deleteOne(...options);
    return deletedComment;
  };
  static deleteMany = async (...options: IDelete<Comment>) => {
    const deletedComment = await Comment.deleteMany(...options);
    return deletedComment;
  };
  static get = async (...options: IFind<Comment>) => {
    const conv = await Comment.findOne(...options);
    return conv;
  };
  static getMany = async (...options: IFind<Comment>) => {
    const convs = await Comment.find(...options);
    return convs;
  };
}
