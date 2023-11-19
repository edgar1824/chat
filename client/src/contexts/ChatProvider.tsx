import { useMedia } from "hooks";
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { UserService } from "request/services";
import { IPagination, IUser } from "types";
import { useAuthContext } from "./AuthProvider";

interface Props extends PropsWithChildren {}
interface IOpen {
  optionsState?: boolean;
  state?: boolean;
  method?: string;
}
interface IContext {
  conversations?: Record<string, any>[];
  friends?: IPagination<IUser>;
  setFriendsPage: Dispatch<SetStateAction<number>>;

  open?: IOpen;
  setOpen?: Dispatch<SetStateAction<IOpen>>;
  handleClose?: () => void;

  show?: boolean;
  setShow?: Dispatch<SetStateAction<boolean>>;
  closeChatBar: () => void;

  currentConv?: Record<string, any>;
  setCurrentConv?: Dispatch<SetStateAction<Record<string, any>>>;
}
interface ILoaderData {
  conversations?: Record<string, any>[];
  friends?: IPagination<IUser>;
}

const ChatContext = createContext<IContext>(null!);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider: FC<Props> = ({ children }) => {
  const { me } = useAuthContext();
  const { conversations, friends: frnds } = useLoaderData() as ILoaderData;
  const [friends, setFriends] = useState(frnds);
  const [friendsPage, setFriendsPage] = useState(1);
  const { conversationId } = useParams();

  const [currentConv, setCurrentConv] = useState<Record<string, any>>(null!);

  const [open, setOpen] = useState<IOpen>({
    optionsState: false,
    state: false,
    method: "",
  });

  const max770 = useMedia(770);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setOpen((p) => ({ ...p, state: false }));
  };

  const closeChatBar = useCallback(() => {
    if (max770) setShow(false);
  }, [max770]);

  useEffect(() => {
    if (!conversationId) setCurrentConv(null!);
  }, [conversationId]);

  useEffect(() => {
    UserService.getFriends({ page: friendsPage }).then((d) => {
      setFriends(d);
    });
  }, [me?.friends]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        friends,
        setFriendsPage,

        open,
        setOpen,
        handleClose,

        show,
        setShow,
        closeChatBar,

        currentConv,
        setCurrentConv,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
