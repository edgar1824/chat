var _a;
import UploadService from "./UploadService.js";
import Post from "../models/Post.js";
export class PostService {
}
_a = PostService;
PostService.create = async (body, files) => {
    console.log(body, files);
    const newPost = new Post({ ...body, ...files });
    await newPost.save();
    return newPost;
};
PostService.getMultiple = async (...options) => {
    const posts = await Post.find(...options).exec();
    return posts;
};
PostService.getOne = async (...options) => {
    const post = await Post.findOne(...options);
    return post;
};
PostService.deleteOne = async (...options) => {
    const post = await Post.findOne(...options);
    if (post.img)
        UploadService.delete(post.img);
    await post.deleteOne();
    return post;
};
PostService.deleteMultiple = async (...options) => {
    const posts = await Post.find(...options).exec();
    posts.forEach((post) => {
        if (post.img)
            UploadService.delete(post?.img);
    });
    const deletedPosts = await Post.deleteMany(...options);
    return deletedPosts;
};
//# sourceMappingURL=PostService.js.map