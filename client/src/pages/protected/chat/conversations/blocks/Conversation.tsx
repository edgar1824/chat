import { AnimatedDots } from "components/reusable";
import { useAppContext, useAuthContext } from "contexts";
import { useEffect, useState } from "react";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { ConversationService } from "request/services";
import { socket } from "socket";
import { IConv, IMessage, IUser } from "types";
import { IResponse } from "types/requests";

export const Conversation = ({
  _id,
  title,
  img,
  isOnline,
  lastMessage,
  type,
}: IConv<string[], string[], IMessage<IUser, string[]>> & {
  isOnline?: boolean;
}) => {
  const [typing, setTyping] = useState({
    state: false,
    username: "",
    userId: "",
  });
  const [lMessage, setLMessaage] = useState({
    ...lastMessage,
    username: lastMessage?.sender?.username,
    userId: lastMessage?.sender?._id,
  });

  const { conversationId } = useParams();
  const { state } = useNavigation();
  const { me } = useAuthContext();
  const { setError } = useAppContext();
  const navigate = useNavigate();

  const handleCLick = () => {
    if (state === "idle" && _id !== conversationId) {
      navigate(`/chat/${_id}`);
    }
  };

  useEffect(() => {
    const getSocketLastMessage = (convId: string, message: IMessage) => {
      if (convId === _id) {
        // setLMessaage((p) => ({ ...p, ...message, userId: message?.sender }));
        setLMessaage((p) => ({ ...p, userId: message?.sender }));
      }
    };
    const getTyping = ({
      isTyping,
      convId,
      ...rest
    }: { isTyping: boolean; convId: string } & typeof typing) => {
      if (convId === _id) {
        setTyping({ ...rest, state: isTyping });
      }
    };

    socket.on("conv-typing", getTyping);
    socket.on("get-last-message", getSocketLastMessage);
    return () => {
      socket.off("conv-typing", getTyping);
      socket.off("get-last-message", getSocketLastMessage);
    };
  }, []);

  useEffect(() => {
    const checkLastMessage = async (messageId: string) => {
      if (messageId === lMessage?._id) {
        try {
          const m = await ConversationService.setLastMessage(conversationId);
          setLMessaage(m);
          setError(m);
        } catch (err) {
          console.error(err);
          setError(err as IResponse);
        }
      }
    };

    socket.on("deleted-message", checkLastMessage);
    return () => {
      socket.off("deleted-message", checkLastMessage);
    };
  }, [lMessage]);

  return (
    <div
      onClick={handleCLick}
      className={`rounded-[15px] cursor-pointer flex justify-between gap-5 px-8 py-3 hover:bg-slate-300 duration-300 md:px-4 ${
        _id === conversationId ? "bg-slate-300" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-5 md:gap-3">
        <img
          className="w-[80px] h-[80px] rounded-full md:w-[50px] md:h-[50px]"
          src={img || "https://cdn-icons-png.flaticon.com/512/25/25437.png"}
          alt=""
        />
        <div className="flex flex-col gap-3">
          <span className="font-semibold">
            {type === "dialogue" && Array.isArray(title)
              ? title?.find((e) => e !== me?.username)
              : title || "Group"}
          </span>
          <div className="text-[16px]">
            <div className="flex gap-1">
              {me?._id !== typing.userId && typing.state ? (
                <div className="text-[12px] text-black flex items-center gap-1">
                  <span>{typing.username} </span>
                  <AnimatedDots size="sm" />
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  {lMessage?.userId !== me?._id && lMessage?.username && (
                    <span className="text-black font-semibold text-[12px]">
                      {lMessage.username}:
                    </span>
                  )}
                  <span className="text-slate-500 whitespace-nowrap text-ellipsis max-w-[100px] block overflow-hidden md:max-w-[135px]">
                    {lMessage?.text}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isOnline && (
        <div className="w-[20px] h-[20px] rounded-full bg-green-600 shrink-0" />
      )}
    </div>
  );
};
