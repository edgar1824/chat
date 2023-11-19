import React, { FC, HTMLAttributes, PropsWithChildren } from "react";

interface Props extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {}

export const Container: FC<Props> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={"container " + className} {...props}>
      {children}
    </div>
  );
};
