import { faTimesSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC, ReactNode } from "react";
import { Animated } from "../Animated";

interface Props {
  open?: boolean;
  handleClose?(): void;
  children?: ReactNode;
  className?: string;
  content?: string;
}

const duration = 200;

export const Modal: FC<Props> = ({
  open,
  handleClose,
  children,
  className = "",
  content = "",
}) => {
  return (
    <Animated
      removeOnEnd
      show={open}
      duration={duration}
      from={{ opacity: "0" }}
      to={{ opacity: "1" }}
      className="fixed top-0 left-0 w-full h-screen z-[99]"
    >
      <div
        className="bg-black/20 fixed top-0 left-0 w-full h-screen"
        onClick={handleClose}
      />
      <div
        className={
          "bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded px-8 py-10 min-w-[300px] " +
          className
        }
      >
        <FontAwesomeIcon
          icon={faTimesSquare}
          className="cursor-pointer absolute top-[10px] right-[10px]"
          color="#0071c2"
          onClick={handleClose}
        />
        <div className={content}>{children}</div>
      </div>
    </Animated>
  );
};
