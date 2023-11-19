import { Friends } from "pages";
import { RouteObject } from "react-router-dom";

export const friendsRoute: RouteObject = {
  path: "friends",
  element: <Friends />,
  loader: Friends.loader,
  action: Friends.action,
};
