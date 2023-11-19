import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styles from "./customBtn.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
}

export const CustomBtn: FC<Props> = ({
  type = "button",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={[
        styles.button,
        className,
        className === "gray" ? styles.grayBtn : "",
      ].join(" ")}
      type={type}
    >
      {children}
    </button>
  );
};
