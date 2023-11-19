import { SingleUser, Users } from "pages";
import { RouteObject } from "react-router-dom";

export const userRoutes: RouteObject = {
  path: "users",
  children: [
    {
      index: true,
      element: <Users />,
      action: Users.action,
    },
    {
      path: ":id",
      element: <SingleUser />,
      loader: SingleUser.loader,
      action: SingleUser.action,
    },
  ],
};
