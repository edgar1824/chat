import UploadService from "./UploadService.js";
import Post, { IPost } from "../models/Post.js";
import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import { IFind } from "../types/index.js";

export class PostService {
  static create = async (body?: any, files?: any) => {
    console.log(body, files);

    const newPost = new Post({ ...body, ...files });
    await newPost.save();
    return newPost;
  };
  static getMultiple = async (...options: IFind<IPost>) => {
    const posts = await Post.find(...options).exec();
    return posts;
  };
  static getOne = async (...options: IFind<IPost>) => {
    const post = await Post.findOne(...options);
    return post;
  };
  static deleteOne = async (...options: IFind<IPost>) => {
    const post = await Post.findOne(...options);
    if (post.img) UploadService.delete(post.img);
    await post.deleteOne();
    return post;
  };
  static deleteMultiple = async (
    ...options: [
      FilterQuery<IPost>,
      ProjectionType<IPost> | QueryOptions<IPost>
    ]
  ) => {
    const posts = await Post.find(...options).exec();
    posts.forEach((post) => {
      if (post.img) UploadService.delete(post?.img);
    });
    const deletedPosts = await Post.deleteMany(
      ...(options as [FilterQuery<IPost>, QueryOptions<IPost>])
    );
    return deletedPosts;
  };
}
