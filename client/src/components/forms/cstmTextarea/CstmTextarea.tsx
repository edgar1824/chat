import { FC, TextareaHTMLAttributes } from "react";
import { ErrorMessage } from "../../reusable";
import styles from "./cstmTextarea.module.css";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  boxClassName?: string;
  error?: string;
  errorClassName?: string;
}

export const CstmTextarea: FC<Props> = ({
  className = "",
  error,
  errorClassName,
  boxClassName,
  ...props
}) => {
  return (
    <div className={"flex flex-col relative w-full " + boxClassName}>
      <textarea
        {...props}
        wrap="off"
        className={`${className} scrollbar_hidden ${styles.textarea} main-input`}
      />
      {error && <ErrorMessage className={errorClassName}>{error}</ErrorMessage>}
    </div>
  );
};
