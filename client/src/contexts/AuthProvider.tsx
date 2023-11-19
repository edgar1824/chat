import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { socket } from "socket";
import { IUser, iSocketUser } from "types";
import { useAppContext } from "./AppProvider";
import { AuthService } from "request/services";

interface Props extends PropsWithChildren {}
interface IContext {
  onlineUsers?: iSocketUser[];
  notifs?: Record<string, any>[];
  me?: IUser;
  setMe?: Dispatch<SetStateAction<IUser>>;
}
interface ILoaderData {
  notifs: Record<string, any>[];
  myInfo: IUser;
}

const AuthContext = createContext<IContext>(null!);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: FC<Props> = ({ children }) => {
  const data = useLoaderData() as ILoaderData;
  const { setError } = useAppContext();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { conversationId } = useParams();
  const [notifs, setNotifs] = useState<Record<string, any>[]>(
    data?.notifs || []
  );
  const [me, setMe] = useState<IUser>(data?.myInfo || null!);

  useEffect(() => {
    setNotifs(data?.notifs);
    setMe(data?.myInfo);
  }, [data]);

  // useEffect(() => {
  //   const controller = new AbortController();

  //   const fetchInboxNotifications = async () => {
  //     try {
  //       const res = await getNotifs({ signal: controller.signal });
  //       setNotifs(res);
  //     } catch (err) {
  //       if (!controller.signal.aborted) {
  //         console.error(err);
  //         setError(err);
  //       }
  //     }
  //   };
  //   let tm = setInterval(fetchInboxNotifications, 1000 * 60 * 5);

  //   return () => {
  //     controller.abort();
  //     clearInterval(tm);
  //   };
  // }, []);

  useEffect(() => {
    socket.connect();
    socket.emit(
      "add-user",
      data?.myInfo?._id || me?._id,
      data?.myInfo?.username || me?.username,
      conversationId || 0
    );
    socket.on("get-users", (users) => {
      setOnlineUsers(users);
    });
    socket.on("get-notification", (data) => {
      setNotifs((p) => [data, ...p]);
    });

    ["get-friend", "remove-friend"].forEach((event) => {
      socket.on(event, () => {
        AuthService.getMyInfo()
          .then((d) => setMe(d))
          .catch((err) => setError(err));
      });
    });

    return () => {
      socket.off("get-users");
      socket.off("get-notification");
      socket.off("get-friend");
      socket.off("remove-friend");
      socket.disconnect();
    };
  }, [me, data]);

  return (
    <AuthContext.Provider value={{ onlineUsers, notifs, me, setMe }}>
      {children}
    </AuthContext.Provider>
  );
};
