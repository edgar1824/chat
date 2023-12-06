import { CreatePost, Posts } from "pages";
import { MyPosts } from "pages/protected/posts/MyPosts";
import { NewPosts } from "pages/protected/posts/NewPosts";
import { Single } from "pages/protected/posts/Single";
import { Link, RouteObject } from "react-router-dom";
import { IUser } from "types";

export const postsRoutes: RouteObject = {
  path: "posts",
  element: <Posts />,
  handle: {
    crumb: () => "Posts",
    path: "/posts",
  },
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
      handle: {
        crumb: () => "Create Post",
        path: "/posts/new",
      },
    },
    {
      path: "mine",
      element: <MyPosts />,
      loader: MyPosts.loader,
      handle: {
        crumb: () => "My Posts",
        path: "/posts/mine",
      },
    },
    {
      path: ":id",
      element: <Single />,
      loader: Single.loader,
      action: Single.action,
      handle: {
        crumb: (data: typeof Single.loaderType) => (
          <>
            <Link
              className="font-semibold text-black"
              to={`/users/${data?.post.user?._id}`}
            >
              {data?.post.user?.username}
            </Link>
            's post
          </>
        ),
      },
    },
  ],
};
