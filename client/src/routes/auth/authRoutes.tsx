import { Login, Registeration } from "pages";
import { RouteObject } from "react-router-dom";

export const authRoutes: RouteObject = {
  path: "auth",
  children: [
    {
      path: "login",
      children: [
        {
          index: true,
          element: <Login />,
          action: Login.action,
        },
        {
          path: "google",
          loader: Login.loader,
        },
      ],
    },
    {
      path: "register",
      element: <Registeration />,
      action: Registeration.action,
    },
  ],
};
