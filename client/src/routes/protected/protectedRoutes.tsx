import { Protected } from "components/layouts";
import { chatRoutes } from "./chatRoutes";
import { friendsRoute } from "./friendsRoute";
import { notificationRoutes } from "./notificationRoutes";
import { profileRoutes } from "./profileRoutes";
import { userRoutes } from "./userRoutes";
import { postsRoutes } from "./postsRouter";
import { Navigate } from "react-router-dom";

export const protectedRoutes = {
  path: "/",
  element: <Protected />,
  action: Protected.action,
  loader: Protected.loader,
  children: [
    { index: true, element: <Navigate to="/posts" /> },
    postsRoutes,
    userRoutes,
    chatRoutes,
    profileRoutes,
    notificationRoutes,
    friendsRoute,
  ],
};
