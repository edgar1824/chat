import { FC, InputHTMLAttributes, ReactNode } from "react";
import { ErrorMessage } from "../../reusable";
import styles from "./customCheckbox.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  boxClassName?: string;
  error?: string;
  errorClassName?: string;
  label?: string;
}

export const CustomCheckbox: FC<Props> = ({
  boxClassName = "",
  className = "",
  label,
  error,
  errorClassName,
  ...props
}) => {
  return (
    <div className={"flex gap-2 pl-[1px] relative " + boxClassName}>
      <input
        {...props}
        type="checkbox"
        className={[styles.myCheckbox, className].join(" ")}
      />
      {label && <span className="text-[10px] text-gray">{label}</span>}
      {error && <ErrorMessage className={errorClassName}>{error}</ErrorMessage>}
    </div>
  );
};
