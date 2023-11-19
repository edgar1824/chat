import { MessagesProvider } from "contexts";
import { formFn, routeActionHandler } from "helpers";
import instance from "request/api";
import { ConversationService, MessageService } from "request/services";
import { ChatInput, MessagesContainer } from "./blocks";
import { ChatModal } from "./blocks/chatModal/ChatModal";
import styles from "./messages.module.css";
import { IConv, IMessage, IUser } from "types";

export interface IMessagesLoaderData {
  messages: IMessage[];
  currentConv: IConv;
  conversationUsers: IUser[];
}

const Component = () => {
  return (
    <MessagesProvider>
      <div className={styles.messages}>
        <MessagesContainer />
        <ChatInput />
      </div>
      <ChatModal />
    </MessagesProvider>
  );
};

const loader = routeActionHandler(async ({ params: { conversationId } }) => {
  // Updating date on click
  if (conversationId)
    await instance.put(`conversations/update-date/${conversationId}`);

  // current messanger
  const currentMessages = await instance.get(`messages/find/${conversationId}`);
  // current conversation
  const currentConv = await instance.get(
    `conversations/find/${conversationId}`
  );
  // current conversation users
  const convUsers = await instance.get(
    `conversations/current-users/${conversationId}`
  );

  return {
    messages: currentMessages.data,
    currentConv: currentConv.data,
    conversationUsers: convUsers?.data,
  };
});

const action = routeActionHandler(
  async ({ params: { conversationId }, request }) => {
    const fd = await request.formData();
    const data = formFn.toObject(fd);

    switch (data.role) {
      case "add-user":
        return await ConversationService.addUser({ ...data, conversationId });
      case "delete-user":
        return await ConversationService.deleteUser({
          ...data,
          conversationId,
          members: data?.members,
        });
      case "leave-group":
        return await ConversationService.leave({
          ...data,
          conversationId,
          members: data?.members,
        });
      case "delete-chat":
        return await ConversationService.delete({
          conversationId: conversationId!,
          members: data?.members,
        });
      case "edit":
        return await ConversationService.edit({ formData: fd, conversationId });
      case "make-admin":
        return await ConversationService.setAdmin({ ...data, conversationId });
      case "unmake-admin":
        return await ConversationService.unsetAdmin({
          ...data,
          conversationId,
        });
      case "delete-message":
        return await MessageService.delete({ ...data, convId: conversationId });
      default:
        return null;
    }
  }
);

export const Messages = Object.assign(Component, { loader, action });
