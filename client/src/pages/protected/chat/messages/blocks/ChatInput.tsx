import { CstmInput, CustomBtn } from "components/forms";
import { useAppContext, useAuthContext, useMessagesContext } from "contexts";
import { useMedia, useRecordAudio } from "hooks";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "socket";
import { Microphone } from "./Microphone";
import { MessageService } from "request/services";

export const ChatInput = () => {
  const isMobile = useMedia(768);

  const { me } = useAuthContext();
  const { setError, error } = useAppContext();
  const { groupMembers } = useMessagesContext();
  const { conversationId } = useParams();
  const { start, stop, state, file, loading, time, reset } = useRecordAudio();

  const [isTyping, setIsTyping] = useState(false);
  const [value, setValue] = useState("");

  // Voice message recording

  // Sending message
  const submitMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((value || file) && !(error && error?.role === "Message_ERR")) {
      setIsTyping(true);
      MessageService.create({
        conversationId,
        text: value,
        audio: file,
        device: isMobile ? "Mobile" : "PC",
        sender: me?._id,
        members: groupMembers?.map((m) => m?._id!)?.filter(Boolean),
      })
        .catch((err) => {
          console.error(err);
          setError(err);
        })
        .finally(() => {
          reset();
          setValue("");
          setIsTyping(false);
        });
    }
  };

  // Clean up input value when going to other conversation
  useEffect(() => {
    setValue("");
  }, [conversationId]);

  // Checking whenever i am typing
  useEffect(() => {
    if (value) {
      setIsTyping(true);
    }
    const s = setTimeout(() => {
      setIsTyping(false);
    }, 5000);
    return () => {
      clearTimeout(s);
    };
  }, [value]);

  // Sending to SOCKET data while i'm typing
  useEffect(() => {
    socket.emit("typing", {
      userId: me?._id,
      conversationId,
      isTyping,
      members: groupMembers?.map((m) => m?._id),
    });
  }, [isTyping]);

  // Shoing loading effect
  useEffect(() => {
    setValue(loading ? "Loading..." : "");
  }, [loading]);

  // While recording voice message
  useEffect(() => {
    if (state !== "inactive") setValue("Speak!");
    else setValue("");
  }, [state]);

  return (
    <form
      onSubmit={submitMessage}
      className="shadow-cst flex items-center w-full gap-3 md:gap-0.5 md:bg-white md:p-0.5 md:rounded-md"
    >
      <CstmInput
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setIsTyping(false)}
        value={value}
        className="w-full !pr-14 md:h-11"
        placeholder="Write..."
        disabled={
          (error && error?.role === "Message_ERR") ||
          state !== "inactive" ||
          !!file ||
          loading
        }
      >
        <Microphone {...{ start, stop, state, time, file, reset }} />
      </CstmInput>
      <CustomBtn
        disabled={error && error?.role === "Message_ERR"}
        type="submit"
        className="h-full min-w-[100px] text-[20px] md:min-w-[60px] md:px-2 shrink-0"
      >
        Send
      </CustomBtn>
    </form>
  );
};
