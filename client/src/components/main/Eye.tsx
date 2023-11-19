import React, { FC, useEffect, useRef, useState } from "react";

const DEFAULT_SIZE = 50;

interface Props {
  size: "sm" | "md" | "lg";
}

// size = "sm" | "md" | "lg"
export const Eye: FC<Props> = ({ size }) => {
  const eyeSize =
    size === "sm"
      ? 30
      : size === "md"
      ? 50
      : size === "lg"
      ? 100
      : DEFAULT_SIZE;

  const [rotate, setRotate] = useState(0);
  const eye = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eyeTracking = (event: MouseEvent) => {
      if (eye.current) {
        let x =
          eye.current?.getBoundingClientRect().left +
          eye.current?.clientWidth / 2;
        let y =
          eye.current?.getBoundingClientRect().top +
          eye.current?.clientHeight / 2;

        let radian = Math.atan2(event.pageX - x, event.pageY - y);
        let rot = radian * (180 / Math.PI) * -1 + 270;
        setRotate(rot);
      }
    };

    window.addEventListener("mousemove", eyeTracking);
    return () => {
      window.removeEventListener("mousemove", eyeTracking);
    };
  }, []);

  return (
    <div
      ref={eye}
      style={{
        transform: `rotate(${rotate}deg)`,
        width: `${eyeSize}px`,
        height: `${eyeSize}px`,
      }}
      className="relative block rounded-full bg-white shadow-[0_5px_45px_rgba(0,_0,_0,_0.2),_inset_0_0_15px_#00000059,_inset_0_0_25px_#00000026]"
    >
      <div
        style={{
          width: `${eyeSize / 2}px`,
          height: `${eyeSize / 2}px`,
        }}
        className="top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 absolute"
      >
        <div className="w-[50%] h-[50%] rounded-full bg-black absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"></div>
      </div>
    </div>
  );
};
