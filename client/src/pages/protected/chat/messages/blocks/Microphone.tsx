import {
  faMicrophone,
  faMicrophoneAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LongPressDetector } from "components/reusable";
import { secsToMins } from "helpers";
import { useMedia, useRecordAudio } from "hooks";

export const Microphone = ({
  start,
  stop,
  state,
  time,
  file,
  reset,
}: Partial<ReturnType<typeof useRecordAudio>>) => {
  const isMobile = useMedia(768);

  return (
    <div className="flex items-center gap-5 absolute top-1/2 right-1 -translate-y-1/2 h-[40px] select-none">
      {(state !== "inactive" || file) && (
        <div className="flex items-center gap-2">
          <span>{secsToMins(time!)}</span>
          <FontAwesomeIcon
            icon={faTimes}
            color="red"
            size="xl"
            className="cursor-pointer"
            title="Cancel voice message"
            onClick={reset}
          />
        </div>
      )}
      <LongPressDetector
        onCancel={() => {
          if (isMobile) stop?.();
        }}
        onLongPress={() => {
          if (isMobile) {
            reset?.();
            start?.();
          }
        }}
        onClick={() => {
          if (!isMobile) {
            if (state === "inactive") {
              reset?.();
              start?.();
            } else stop?.();
          }
        }}
      >
        <FontAwesomeIcon
          icon={state === "inactive" ? faMicrophone : faMicrophoneAlt}
          size="lg"
          className="cursor-pointer p-2 w-[20px] h-[20px] hover:bg-slate-100 rounded-full"
        />
      </LongPressDetector>
    </div>
  );
};
