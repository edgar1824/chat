import { Root } from "components/layouts";
import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth/authRoutes";
import { protectedRoutes } from "./protected/protectedRoutes";

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [protectedRoutes, authRoutes],
  },
]);
