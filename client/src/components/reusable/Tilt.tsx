import { FC, ReactNode } from "react";
import ReactTilt from "react-parallax-tilt";

interface Props {
  children?: ReactNode;
  className?: string;
}

export const Tilt: FC<Props> = ({ children, className = "" }) => {
  return (
    <ReactTilt className={className} tiltReverse>
      {children}
    </ReactTilt>
  );
};
