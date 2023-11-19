import React, { FC, HTMLAttributes, PropsWithChildren } from "react";

interface Props
  extends PropsWithChildren,
    HTMLAttributes<HTMLParagraphElement> {}

export const CenterText: FC<Props> = ({ children, className = "" }) => {
  return (
    <p
      className={
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 " +
        className
      }
    >
      {children}
    </p>
  );
};
