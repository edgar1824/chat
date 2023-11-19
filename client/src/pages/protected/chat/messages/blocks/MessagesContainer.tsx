import { AnimatedDots } from "components/reusable";
import { useAppContext, useAuthContext, useMessagesContext } from "contexts";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageService } from "request/services";
import { IMessage } from "types";
import { Message } from "./Message";
import { IErrData, IResponse } from "types/requests";
import { AxiosResponse } from "axios";

// const getLastMessage = (messages) =>
//   messages.sort(
//     (a, b) =>
//       new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
//   )[0];
const getLastMessage = (messages: IMessage[]) => messages[messages?.length - 1];

export const MessagesContainer = () => {
  const { conversationId } = useParams();
  const {
    groupMessage,
    groupMembers,
    setGroupMembers,
    messages,
    oponenetTyping,
  } = useMessagesContext();
  const { error, setError } = useAppContext();
  const scrollRef = useRef<HTMLDivElement>(null!);
  const { me } = useAuthContext();

  // for voice messages
  const [voiceId, setVoiceId] = useState("");

  useEffect(() => {
    if (scrollRef.current && scrollRef.current.scroll) {
      scrollRef.current?.scroll({
        behavior: "smooth",
        top: scrollRef.current.scrollHeight,
      });
    }
  }, [conversationId, messages, oponenetTyping, groupMessage, groupMembers]);

  useEffect(() => {
    let controller = new AbortController();
    const requestWatchedAmount = async () => {
      if (
        messages?.[messages?.length - 1] &&
        !messages[messages?.length - 1]?.watched?.includes(me?._id!) &&
        messages[messages?.length - 1]?.sender !== me?._id
      ) {
        try {
          await MessageService.watched(
            messages[messages?.length - 1]?._id,
            me?._id,
            { signal: controller.signal }
          );
        } catch (err) {
          setError(err as IResponse);
        }
      }
    };
    requestWatchedAmount();

    return () => {
      controller.abort();
    };
  }, [messages]);

  useEffect(() => {
    setGroupMembers?.((p) =>
      p.map((member) => {
        const lastMessage = getLastMessage(
          messages?.filter(
            (m) => m?.watched?.length && m?.watched.includes(member?._id!)
          )!
        );
        return {
          ...member,
          messageWatched:
            messages?.[messages?.length - 1]?.sender !== member?._id &&
            lastMessage?._id,
        };
      })
    );
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="scrollbar-hidden flex flex-col gap-5 overflow-y-auto pr-3 duration-300 md:gap-2 md:shadow-cst md:rounded-md md:!px-0.5 md:py-2 flex-[1]"
    >
      {!!messages?.length &&
        messages.map((el, i) => (
          <Fragment key={i}>
            <Message {...{ ...el, voiceId, setVoiceId }} />
            {groupMembers?.some(
              (m) => el?._id === m?.messageWatched && m?._id !== me?._id
            ) && (
              <div className="flex items-center justify-end py-2">
                {groupMembers.map((member) => {
                  if (
                    el?._id === member?.messageWatched &&
                    member?._id !== me?._id
                  ) {
                    return (
                      <img
                        key={member?._id}
                        className="w-5 h-5 rounded-full shadow-cst"
                        src={member?.img}
                      />
                    );
                  }
                })}
              </div>
            )}
          </Fragment>
        ))}
      {me?.username !== oponenetTyping?.username && oponenetTyping?.state && (
        <div className="text-sm text-slate-500 flex items-center gap-1">
          <span>{oponenetTyping.username}</span>
          <AnimatedDots />
        </div>
      )}
      {error && error?.role === "Message_ERR" && (
        <p className="font-bold text-[20px] text-center text-red-600">
          {error?.message ||
            error?.response?.data?.message ||
            error?.response?.statusText}
        </p>
      )}
      {groupMessage && <p className="text-center">{groupMessage}</p>}
    </div>
  );
};
