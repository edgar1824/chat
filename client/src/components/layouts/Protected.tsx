import { AuthProvider, useAuthContext } from "contexts";
import { formFn, routeActionHandler, userHandler } from "helpers";
import { Navigate, Outlet, redirect } from "react-router-dom";
import {
  AuthService,
  NotificationService,
  UserService,
} from "request/services";
import { Loading, Navbar } from "../main";
import { ReactNode } from "react";

const Component = () => {
  return (
    <AuthProvider>
      <AuthLoading>
        <Navbar />
        <main className="flex-[1] flex flex-col">
          <Outlet />
        </main>
      </AuthLoading>
    </AuthProvider>
  );
};

const AuthLoading = ({ children }: { children: ReactNode }) => {
  const authContext = useAuthContext();
  if (!authContext?.me) return <Loading />;

  const token = userHandler.getToken();
  const { me } = authContext;

  if (!me && !token) {
    return <Navigate to={"/auth/login"} replace />;
  }
  return <>{children}</>;
};

const loader = routeActionHandler(async () => {
  try {
    const notifs = await NotificationService.getNotifs();
    const myInfo = await AuthService.getMyInfo();
    const friends = await UserService.getFriends();

    return { notifs: notifs.data, myInfo, friends };
  } catch (err: any) {
    // if (
    //   err?.config?.url === "users/my-info" &&
    //   err?.response?.data?.status === 404
    // ) {
    //   return redirect("/auth/login");
    // }
    throw err;
  }
});

const action = routeActionHandler(async ({ request }) => {
  const fd = await request.formData();
  const data = formFn.toObject(fd);
  switch (data?.role) {
    case "logout":
      return await AuthService.logout();
    default:
      return null;
  }
});

export const Protected = Object.assign(Component, { loader, action });
