import { FC, InputHTMLAttributes, LegacyRef, ReactNode } from "react";
import { ErrorMessage } from "../reusable";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  boxClassName?: string;
  error?: string;
  errorClassName?: string;
  myRef?: LegacyRef<HTMLInputElement>;
  children?: ReactNode;
}

export const CstmInput: FC<Props> = ({
  className = "",
  boxClassName = "",
  error,
  errorClassName,
  myRef,
  children,
  ...props
}) => {
  return (
    <div className={"flex w-full relative " + boxClassName}>
      <input {...props} ref={myRef} className={`main-input ${className}`} />
      {children}
      {error && <ErrorMessage className={errorClassName}>{error}</ErrorMessage>}
    </div>
  );
};
