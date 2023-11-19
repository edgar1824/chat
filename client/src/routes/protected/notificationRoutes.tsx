import { CenterText } from "components/reusable";
import { Notifications, SingleNotification, Inbox, SentNotifs } from "pages";
import { RouteObject } from "react-router-dom";

export const notificationRoutes: RouteObject = {
  path: "notifications",
  element: <Notifications />,
  children: [
    {
      index: true,
      element: <CenterText>Notifiactions</CenterText>,
    },
    {
      path: "sent",
      element: <SentNotifs />,
      loader: SentNotifs.loader,
    },
    {
      path: "inbox",
      element: <Inbox />,
      action: Inbox.action,
    },
    {
      path: ":id",
      element: <SingleNotification />,
      loader: SingleNotification.loader,
      action: SingleNotification.action,
    },
  ],
};
