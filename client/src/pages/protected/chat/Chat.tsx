import { ChatProvider } from "contexts";
import { formFn, routeActionHandler } from "helpers";
import { Outlet, redirect } from "react-router-dom";
import { ConversationService } from "request/services";
import instance from "request/api";
import { ChatBar } from "./ChatBar";
import styles from "./chat.module.css";
import { Conversations } from "./conversations/Conversations";
import { IConv, IMessage, IUser } from "types";

export interface IChatLoaderData {
  conversations: IConv<string[], string[], IMessage<IUser, string[]>>[];
  friends: IUser[];
}

const Component = () => {
  return (
    <ChatProvider>
      <div className={styles.chat}>
        <Conversations />
        <div className="flex-[2] flex flex-col relative">
          <ChatBar />
          <Outlet />
        </div>
      </div>
    </ChatProvider>
  );
};

const loader = routeActionHandler(async () => {
  const convs = await instance.get(`conversations/of-user`);
  const friends = await instance.get("users/friends?limit=6");

  return {
    conversations: convs.data,
    friends: friends?.data?.items,
  };
});

const action = routeActionHandler(async ({ request }) => {
  const fd = await request.formData();
  const data = formFn.toObject(fd);

  switch (data.role) {
    case "create-group":
      const res = await ConversationService.create({
        ...data,
        members: data?.members,
      });
      return redirect(`/chat/${res.data?._id}`);
    default:
      return null;
  }
});

export const Chat = Object.assign(Component, { loader, action });
