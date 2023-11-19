import { useRef, useState } from "react";

export const useRecordAudio = () => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>(null!);
  const [state, setState] = useState("inactive"); // "inactive", "paused", "recording"
  const [time, setTime] = useState(0);
  let tm: NodeJS.Timer;

  const start = async () => {
    if (navigator.mediaDevices.getUserMedia) {
      if (mediaRecorder.current) {
        mediaRecorder.current = null!;
      }
      setLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (e) => {
          setFile(new File([e?.data], "voice.mp3", { type: e?.data?.type }));
        };
        mediaRecorder.current.onstart = () => {
          startTimer();
        };
        mediaRecorder.current.onstop = () => {
          clearInterval(tm);
        };
        ["dataavailable", "error", "pause", "resume", "start", "stop"].forEach(
          (event) => {
            mediaRecorder.current?.addEventListener(event, () => {
              setState(mediaRecorder.current?.state!);
            });
          }
        );

        mediaRecorder.current.start();
      } catch (err) {
        alert(err);
      }
      setLoading(false);
    } else {
      alert("Your Browser does not support microphone actions!");
    }
  };

  const stop = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
  };
  const pause = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.pause();
    }
  };
  const resume = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "paused") {
      mediaRecorder.current.resume();
    }
  };
  const reset = () => {
    setFile(null!);
    setTime(0);
    setState("inactive");
    setLoading(false);
  };
  const startTimer = () => {
    tm = setInterval(() => {
      setTime((p) => p + 1);
    }, 1000);
  };

  return {
    start,
    stop,
    pause,
    resume,
    file,
    state,
    loading,
    stream: mediaRecorder.current?.stream,
    time,
    reset,
  };
};
