import {
  FC,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
  TouchEventHandler,
  useEffect,
  useState,
} from "react";

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  dur?: number;
  onLongPress?({ isLong }: { isLong?: boolean }): void;
  onCancel?(): void;
  children?: (({ pressing }: { pressing: boolean }) => ReactNode) | ReactNode;
}

export const LongPressDetector: FC<Props> = ({
  dur = 500,
  onLongPress,
  onCancel,
  className = "",
  children,
  ...props
}) => {
  const [isLong, setIsLong] = useState(false);

  const onMouseDown: MouseEventHandler = () => {
    setIsLong(true);
  };
  const onMouseUp: MouseEventHandler = () => {
    setIsLong(false);
  };
  const onTouchStart: TouchEventHandler = (e) => {
    setIsLong(true);
  };
  const onTouchEnd: TouchEventHandler = (e) => {
    // e?.preventDefault?.();
    setIsLong(false);
  };

  useEffect(() => {
    let tm: NodeJS.Timeout;
    if (isLong) {
      tm = setTimeout(() => {
        onLongPress?.({ isLong });
      }, dur);
    }
    return () => {
      clearTimeout(tm);
      isLong && onCancel?.();
    };
  }, [isLong]);

  return (
    <div
      {...{
        className,
        onMouseDown,
        onMouseUp,
        onTouchStart,
        onTouchEnd,
        ...props,
      }}
    >
      {typeof children === "function"
        ? children({ pressing: isLong })
        : children}
    </div>
  );
};
