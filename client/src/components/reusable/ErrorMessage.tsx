import { FC, HTMLAttributes, ReactNode, useEffect, useRef } from "react";

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  isParentRelative?: boolean;
  children?: ReactNode;
}

export const ErrorMessage: FC<Props> = ({
  children,
  isParentRelative,
  className,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (isParentRelative) {
      ref.current?.parentElement?.classList.add("relative");
    }
  }, []);
  return (
    <p
      ref={ref}
      className={
        className +
        " text-[red] text-xs leading-3 -translate-x-1/2 whitespace-nowrap w-full left-[53%] -bottom-3 absolute"
      }
    >
      {children}
    </p>
  );
};
