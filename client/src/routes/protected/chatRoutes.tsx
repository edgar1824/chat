import { Chat, Messages } from "pages";
import { RouteObject } from "react-router-dom";

export const chatRoutes: RouteObject = {
  path: "chat",
  element: <Chat />,
  loader: Chat.loader,
  action: Chat.action,
  children: [
    {
      index: true,
      element: (
        <p className="text-center text-[32px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          Choose Conversation
        </p>
      ),
    },
    {
      path: ":conversationId",
      element: <Messages />,
      loader: Messages.loader,
      action: Messages.action,
    },
  ],
};
