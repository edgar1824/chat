import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { socket } from "socket";
import { useAuthContext } from "./AuthProvider";
import { useChatContext } from "./ChatProvider";
import { iSocketUser, IMessage, IUser } from "types";
import { DBDocument } from "types/requests";

interface IOponenetTyping {
  state: boolean;
  username: string;
  userId: string;
}

interface Props extends PropsWithChildren {}
interface IContext {
  freeFriends?: iSocketUser[];
  groupMembers?: iSocketUser[];
  setGroupMembers?: Dispatch<SetStateAction<iSocketUser[]>>;

  groupMessage?: string;
  setGroupMessage?: Dispatch<SetStateAction<string>>;

  messages?: IMessage[];
  setMessages?: Dispatch<SetStateAction<IMessage[]>>;

  oponenetTyping?: IOponenetTyping;
  setOponenetTyping?: Dispatch<SetStateAction<IOponenetTyping>>;
}
interface ILoaderData {
  messages: (Record<string, any> & DBDocument)[];
  currentConv: Record<string, any>;
  conversationUsers: IUser[];
}

const addOnlineUsers = (
  users: IUser[],
  onlineUsers: (IUser & { userId?: string })[]
) =>
  users?.map((user) => ({
    ...user,
    isOnline: onlineUsers?.some((u) => u?.userId === user?._id),
  }));

const MessangesContext = createContext<IContext>(null!);

export const useMessagesContext = () => useContext(MessangesContext);

export const MessagesProvider: FC<Props> = ({ children }) => {
  const { onlineUsers, me } = useAuthContext();
  const { setCurrentConv, friends } = useChatContext();

  const {
    conversationUsers,
    messages: mess,
    currentConv,
  } = useLoaderData() as ILoaderData;
  const { conversationId } = useParams();
  const [groupMessage, setGroupMessage] = useState<string>("");
  // current group members
  const [groupMembers, setGroupMembers] = useState<IUser[]>([]);
  // other users that are not current group members
  const [freeFriends, setFreeFriends] = useState<IUser[]>([]);

  // all current group messages
  const [messages, setMessages] = useState<
    (Record<string, any> & DBDocument)[]
  >([]);
  const [oponenetTyping, setOponenetTyping] = useState({
    state: false,
    username: "",
    userId: "",
  });

  useEffect(() => {
    if (mess) setMessages(mess);
    setCurrentConv?.(currentConv);
  }, [conversationId]);

  useEffect(() => {
    const getMessage = (message: IMessage) => {
      setMessages((p) => [...p, message]);
    };
    const getTyping = ({
      isTyping,
      userId,
      username,
    }: {
      isTyping: boolean;
      userId: string;
      username: string;
    }) => {
      setOponenetTyping({ state: isTyping, username, userId });
    };
    const setWatchedMessage = (message: IMessage) => {
      setMessages((p) => p.map((m) => (m?._id === message?._id ? message : m)));
    };
    const getDeletedMessageId = (messageId: string) => {
      setMessages((p) => p?.filter((m) => m?._id !== messageId));
    };

    socket.on("messages-typing", getTyping);
    socket.on("get-message", getMessage);
    socket.on("get-message-watched", setWatchedMessage);
    socket.on("deleted-message", getDeletedMessageId);

    return () => {
      socket.off("messages-typing", getTyping);
      socket.off("get-message", getMessage);
      socket.off("get-message-watched", setWatchedMessage);
      socket.off("deleted-message", getDeletedMessageId);
    };
  }, []);

  // ##############################################################
  // ##############################################################
  // ##############################################################

  useEffect(() => {
    socket.emit("join", me?._id, conversationId);
    console.log("i joined");
  }, [conversationId]);

  useEffect(() => {
    setGroupMembers(conversationUsers);
    if (friends?.items?.length) {
      setFreeFriends(
        friends?.items?.filter(
          (f) => !conversationUsers?.some((u) => u?._id === f?._id)
        )
      );
    }

    const getMembers = (data: string[]) => {
      setGroupMembers(friends?.items?.filter((p) => data?.includes(p?._id!))!);
      setFreeFriends(friends?.items?.filter((p) => !data?.includes(p?._id!))!);
    };

    socket.on("conversation-members", getMembers);
    return () => {
      socket.off("conversation-members", getMembers);
    };
  }, [conversationUsers, friends]);

  const [gMembers, fUsers] = useMemo(
    () => [
      addOnlineUsers(groupMembers, onlineUsers!),
      addOnlineUsers(freeFriends, onlineUsers!),
    ],
    [onlineUsers, groupMembers, freeFriends, conversationUsers]
  );
  return (
    <MessangesContext.Provider
      value={{
        freeFriends: fUsers,
        groupMembers: gMembers,
        setGroupMembers,

        groupMessage,
        setGroupMessage,

        messages,
        setMessages,
        oponenetTyping,
        setOponenetTyping,
      }}
    >
      {children}
    </MessangesContext.Provider>
  );
};
