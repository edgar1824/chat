import { CreatePost, Posts } from "pages";
import { MyPosts } from "pages/protected/posts/MyPosts";
import { NewPosts } from "pages/protected/posts/NewPosts";
import { Single } from "pages/protected/posts/Single";
import { RouteObject } from "react-router-dom";

export const postsRoutes: RouteObject = {
  path: "posts",
  element: <Posts />,
  action: Posts.action,
  children: [
    {
      index: true,
      element: <NewPosts />,
      loader: NewPosts.loader,
    },
    {
      path: "new",
      element: <CreatePost />,
      action: CreatePost.action,
    },
    {
      path: "mine",
      element: <MyPosts />,
      loader: MyPosts.loader,
    },
    {
      path: ":id",
      element: <Single />,
      loader: Single.loader,
      action: Single.action,
    },
  ],
};
