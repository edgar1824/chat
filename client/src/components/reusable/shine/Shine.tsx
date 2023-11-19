import React, { FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./shine.module.css";

interface Props extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {}

export const Shine: FC<Props> = ({ children, className = "" }) => {
  return <div className={[styles.div, className].join(" ")}>{children}</div>;
};
