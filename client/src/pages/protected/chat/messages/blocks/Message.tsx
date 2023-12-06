import {
  AudioWave,
  DoubleClick,
  LongPressDetector,
  OutsideDetector,
} from "components/reusable";
import { chat_colors } from "constants/chat";
import { useAuthContext, useMessagesContext } from "contexts";
import { formFn, timeDifference } from "helpers";
import { useClickOutside, useMedia } from "hooks";
import {
  Component,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormAction, useSubmit } from "react-router-dom";
import { IMessage } from "types";
import WaveSurfer from "wavesurfer.js";

interface Props extends IMessage {
  voiceId?: string;
  setVoiceId?: Dispatch<SetStateAction<string>>;
}

export const Message: FC<Props> = ({
  _id,
  sender,
  text,
  audio,
  device,
  createdAt,
  voiceId,
  setVoiceId,
}) => {
  const { groupMembers } = useMessagesContext();
  const { me } = useAuthContext();
  const action = useFormAction();
  const submit = useSubmit();
  // for voice message
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>(null!);
  // for deleting message button
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUser = groupMembers?.find((e) => e?._id === sender);
  const otherGroupMembers = groupMembers?.filter((e) => e?._id !== me?._id);
  const messageColor = chat_colors[otherGroupMembers?.indexOf(currentUser!)!];

  useEffect(() => {
    if (voiceId !== _id) wavesurfer?.pause?.();
  }, [voiceId, _id, wavesurfer]);

  const deleteMessageHandler = () => {
    setIsDeleting(false);
    submit(formFn.toFormData({ messageId: _id, role: "delete-message" }), {
      action,
      encType: "multipart/form-data",
      method: "delete",
    });
  };

  if (sender === process.env.REACT_APP_CHAT_GROUP_MESSAGE_ID) {
    return <div className="text-center text-[20px]">{text}</div>;
  }

  if (sender === me?._id) {
    return (
      <div className="flex gap-1 w-full justify-end  md:gap-[1px]">
        <MessageWrapper
          className="items-end w-fit max-w-[70%] lg:max-w-[80%] md:!max-w-[90%]"
          onAction={() => setIsDeleting(true)}
          onCancel={() => setIsDeleting(false)}
        >
          {audio ? (
            <AudioWave
              onPlayClick={() => {
                setVoiceId?.(_id!);
              }}
              url={audio}
              onWavesurfer={(ws) => setWavesurfer(ws)}
              {...{ device }}
            />
          ) : (
            <p
              style={{ wordBreak: "break-word" }}
              className="px-5 py-3 rounded-xl bg-blue-600 text-white"
            >
              {text}
            </p>
          )}

          <span className="text-[10px] select-none text-slate-500 md:text-[7px] md:leading-[7px]">
            {timeDifference(createdAt!)}
          </span>
          {isDeleting && (
            <div
              onClick={deleteMessageHandler}
              className="select-none flex justify-center items-center w-full relative -top-2 md:-top-0.5"
            >
              <div className="relative px-2 py-1 bg-red-500 rounded text-white cursor-pointer md:text-xs md:px-1 md:py-0.5">
                Delete?
                <div className="absolute left-1/2 bg-red-500 -translate-x-1/2 -top-1 w-3 h-3 rotate-45 z-[-1]" />
              </div>
            </div>
          )}
        </MessageWrapper>

        <img
          src={
            currentUser?.img ||
            "https://austinpeopleworks.com/wp-content/uploads/2020/12/blank-profile-picture-973460_1280.png"
          }
          className="w-[35px] shadow-xl border h-[35px] rounded-full select-none shrink-0 md:w-[20px] md:h-[20px]"
          alt=""
        />
      </div>
    );
  }
  return (
    <>
      <div className="flex w-full justify-start">
        <div className="flex flex-col gap-1 w-full md:gap-[1px]">
          <span className="text-[#645555] text-sm md:leading-3 md:text-xs">
            {currentUser?.username || "user left"}
          </span>
          <div className="flex gap-1 md:gap-[1px]">
            <img
              src={
                currentUser?.img ||
                "https://austinpeopleworks.com/wp-content/uploads/2020/12/blank-profile-picture-973460_1280.png"
              }
              className="w-[35px] shadow-xl border h-[35px] rounded-full select-none shrink-0 md:w-[20px] md:h-[20px]"
              alt=""
            />
            <div className="flex flex-col gap-0.5 w-fit max-w-[70%] lg:max-w-[80%] md:max-w-[90%]">
              {audio ? (
                <AudioWave
                  {...{ device }}
                  colors={(p) => ({
                    ...p,
                    wave: "white",
                    progress: "lightslate",
                    play: "slategray",
                    parent: messageColor || "slategray",
                    playBg: "white",
                  })}
                  url={audio}
                />
              ) : (
                <p
                  style={{
                    backgroundColor: messageColor || "slategray",
                    wordBreak: "break-word",
                  }}
                  className="px-5 py-3 rounded-xl text-white"
                >
                  {text}
                </p>
              )}
              <span className="text-[10px] select-none text-slate-500 md:text-[7px] md:leading-[7px]">
                {timeDifference(createdAt!)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* {messageslength} */}
    </>
  );
};

const MessageWrapper = ({
  onAction,
  className,
  children,
  onCancel,
  ...props
}: {
  onAction: () => void;
  onCancel?: () => void;
  className?: string;
  children?: ReactNode;
} & Partial<Component<typeof OutsideDetector>>) => {
  const isMobile = useMedia(768);
  const clName = "relative flex flex-col gap-0.5";
  return (
    <OutsideDetector onOutside={onCancel} className={className} {...props}>
      {isMobile ? (
        <LongPressDetector {...{ onLongPress: onAction, className: clName }}>
          {children}
        </LongPressDetector>
      ) : (
        <DoubleClick {...{ onDoubleClick: onAction, className: clName }}>
          {children}
        </DoubleClick>
      )}
    </OutsideDetector>
  );
};
