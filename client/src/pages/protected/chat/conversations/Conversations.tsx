import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, OutsideDetector } from "components/reusable";
import { useAuthContext, useChatContext } from "contexts";
import { sortByUpDate } from "helpers";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { socket } from "socket";
import { Conversation, New } from "./blocks";
import styles from "./conversations.module.css";
import { IChatLoaderData } from "../Chat";
import { IConv, IMessage, IUser } from "types";

export const Conversations = () => {
  const { onlineUsers, me } = useAuthContext();
  const { show, setShow, closeChatBar } = useChatContext();
  const { conversations } = useLoaderData() as IChatLoaderData;
  const [convs, setConvs] = useState<
    IConv<string[], string[], IMessage<IUser, string[]>>[]
  >(conversations || []);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setConvs((p) =>
      p.map((el) => ({
        ...el,
        isOnline: onlineUsers
          ?.filter((e) => e?.userId !== me?._id)
          .some((onlineUser) => el?.members?.includes(onlineUser?.userId!)),
      }))
    );
    const checkConvs = (data?: string[], convId?: string) => {
      setConvs((p) =>
        p.map((conv) => {
          if (conv._id === convId) {
            return {
              ...conv,
              isOnline: onlineUsers
                ?.filter((e) => e.userId !== me?._id)
                .some((onlineUser) => data?.includes(onlineUser.userId!)),
            };
          }
          return conv;
        })
      );
    };

    const getConvs = (
      data?: IConv<string[], string[], IMessage<IUser, string[]>>[]
    ) => {
      setConvs((p) =>
        [...p, ...data!].map((conv) => ({
          ...conv,
          isOnline: conv?.members
            ?.filter((u) => u !== me?._id)
            .some((u) =>
              onlineUsers?.some((onlineUser) => onlineUser?.userId === u)
            ),
        }))
      );
    };
    const deleteConv = (convId?: string) => {
      setConvs((p) => p.filter((conv) => conv._id !== convId));
      if (window.location.pathname.includes(`/chat/${convId}`)) {
        navigate("/chat");
      }
    };

    const getEditedConv = (
      conv: IConv<string[], string[], IMessage<IUser, string[]>>
    ) => {
      setConvs((p) => p.map((c) => (c?._id === conv?._id ? conv : c)));
    };

    socket.on("edited-conversation", getEditedConv);
    socket.on("get-conversations", getConvs);
    socket.on("removed-conversation", deleteConv);
    socket.on("conversation-members", checkConvs);
    return () => {
      socket.off("edited-conversation", getEditedConv);
      socket.off("conversation-members", checkConvs);
      socket.off("get-conversations", getConvs);
      socket.off("removed-conversation", deleteConv);
    };
  }, [onlineUsers]);

  return (
    <>
      <OutsideDetector
        onOutside={closeChatBar}
        className={`flex-[1] flex flex-col shadow-cst bg-slate-50 md:absolute md:top-[50px] max-w-[500px] min-w-[300px] md:w-[70%] md:h-[calc(100vh_-_50px)] md:z-[5] duration-300 ${
          show ? "left-0" : "left-[-100%]"
        }`}
      >
        <div className="bg-slate-300 px-8 py-5 flex items-center gap-5 justify-between md:px-5 relative h-[72px] shadow-[-7px_7px_10px_5px_rgb(0_0_0_/_10%)] border-r">
          <FontAwesomeIcon
            icon={faAdd}
            onClick={() => setOpen(true)}
            className="bg-blue-500 text-white px-2 cursor-pointer py-1 rounded h-[22px] box-border"
          />
          <div
            onClick={() => {
              setShow?.(false);
            }}
            className="hidden md:block bg-blue-500 text-white px-4 cursor-pointer py-2 rounded"
          >
            Close
          </div>
        </div>
        <div className={styles.conversations}>
          {!!convs?.length ? (
            sortByUpDate(convs).map((el) => (
              <Conversation
                lastMessage={el.lastMessage}
                key={el?._id}
                {...el}
              />
            ))
          ) : (
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              No Conversations
            </p>
          )}
        </div>
      </OutsideDetector>
      <Modal {...{ open, handleClose }}>
        <New />
      </Modal>
    </>
  );
};
