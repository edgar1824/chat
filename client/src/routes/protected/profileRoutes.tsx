import { Profile } from "pages";
import { RouteObject } from "react-router-dom";

export const profileRoutes: RouteObject = {
  path: "profile",
  element: <Profile />,
  action: Profile.action,
};
