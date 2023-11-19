// Import React hooks
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { secsToMins } from "helpers";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import WaveSurfer from "wavesurfer.js";

const default_colors = {
  play: "white",
  parent: "rgb(37 99 235 / 1)",
  wave: "white",
  progress: "rgb(101,160,255)",
  playBg: "rgb(101,160,255)",
};

interface Props {
  url?: string;
  device?: "PC" | "Mobile";
  onWavesurfer?(ws: WaveSurfer): void;
  onPlayClick?({ isPlaying }: { isPlaying: boolean }): void;
  colors?(names: typeof default_colors): typeof default_colors;
}

export const AudioWave: FC<Props> = ({
  url,
  device = "PC",
  onWavesurfer,
  onPlayClick,
  colors = ({ play, parent, wave, progress, playBg } = default_colors) => ({
    play,
    parent,
    wave,
    progress,
    playBg,
  }),
}) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState<string | number>(0);
  const [currentTime, setCurrentTime] = useState<string | number>(0);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>(null!);

  const playCLickHandler = useCallback(() => {
    wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
    onPlayClick?.({ isPlaying: wavesurfer.isPlaying() });
  }, [wavesurfer]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      url,
      container: containerRef.current,
      barWidth: 2,
      barRadius: 1000,
      barGap: 2,
      height: 50,
      waveColor: colors(default_colors).wave,
      progressColor: colors(default_colors).progress,
      cursorWidth: 0,
      dragToSeek: true,
      barHeight: device === "Mobile" ? 2 : 1,
    });

    const subscriptions = [
      ws.on("play", () => setIsPlaying(true)),
      ws.on("pause", () => setIsPlaying(false)),
      ws.on("ready", () => setTime(ws.getDuration().toFixed())),
      ws.on("audioprocess", () =>
        setCurrentTime(ws.getCurrentTime().toFixed())
      ),
    ];

    setWavesurfer(ws);
    onWavesurfer?.(ws);

    return () => {
      subscriptions.forEach((unsub) => unsub());
      ws.destroy();
    };
  }, [containerRef, url]);

  const showTime = useMemo(() => {
    const seconds = currentTime || time;
    return secsToMins(seconds as number);
  }, [currentTime, time]);

  return (
    <div
      className="flex items-center gap-3 px-1.5 py-1.5 rounded-xl w-fit select-none md:py-0.5"
      style={{ background: colors(default_colors).parent }}
    >
      <FontAwesomeIcon
        onClick={playCLickHandler}
        style={{ background: colors(default_colors).playBg }}
        className="cursor-pointer mt-30 p-3 w-[24px] h-[24px] rounded-full"
        icon={isPlaying ? faPause : faPlay}
        color={colors(default_colors).play}
      />
      <div className="flex flex-col">
        <div
          ref={containerRef}
          className="w-[250px] lg:w-[200px] md:!w-[140px]"
        />
        <span className="text-white text-xs leading-3 md:pb-0.5">
          {showTime}
        </span>
      </div>
    </div>
  );
};
