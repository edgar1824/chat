import { FC, ReactNode } from "react";
import { classes } from "./utils";

export const Stymbol: FC<{
  handler?: () => void;
  children?: ReactNode;
  className?: string;
}> = ({ handler, children, className }) => {
  return (
    <span
      onClick={handler}
      className={classes(
        className,
        "select-none cursor-pointer font-mono p-1 grid place-content-center rounded-full w-4 h-4 leading-[6px]"
      )}
    >
      {children}
    </span>
  );
};
