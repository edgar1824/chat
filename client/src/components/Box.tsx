import {
  FC,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  ReactNode,
  RefObject,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
  createElement,
} from "react";

interface Props {
  onDoubleClick?(): void;

  onOutside?: () => void;
  onInside?: () => void;

  onRef?: (ref: RefObject<HTMLDivElement>) => void;

  longPressDur?: number;
  onLongPress?({ isLong }: { isLong?: boolean }): void;
  onLongPressCancel?(): void;

  className?: string;
  children?:
    | (({ isPressing }: { isPressing: boolean }) => ReactNode)
    | ReactNode;
  elementProps?: Omit<HTMLAttributes<HTMLDivElement>, "className">;
  as?: keyof JSX.IntrinsicElements;
  as2?: JSX.Element;
}

export const Box: FC<Props> = ({
  children,
  onDoubleClick,
  onOutside,
  onInside,
  onRef,
  longPressDur = 500,
  onLongPress,
  onLongPressCancel,
  elementProps,
  className = "",
  as = "div",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [clickCount, setClickCount] = useState(0);
  const [isLong, setIsLong] = useState(false);

  // For detecting long press
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
    setIsLong(false);
  };
  // =======================

  const handleDoubleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    setClickCount((p) => p + 1);
    if (clickCount === 1) {
      onDoubleClick?.();
    }
    setTimeout(() => setClickCount(0), 300);
    elementProps?.onClick?.(e);
  };

  useEffect(() => {
    if (ref.current) {
      onRef?.(ref);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current?.contains(event.target as Node | null)) {
        onOutside?.();
      } else {
        onInside?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  // For detecting long press
  useEffect(() => {
    let tm: NodeJS.Timeout;
    if (isLong) {
      tm = setTimeout(() => {
        onLongPress?.({ isLong });
      }, longPressDur);
    }
    return () => {
      clearTimeout(tm);
      isLong && onLongPressCancel?.();
    };
  }, [isLong]);

  return createElement(
    as,
    {
      ...{ onMouseDown, onMouseUp, onTouchStart, onTouchEnd, ...elementProps },
      className: className,
      onClick: handleDoubleClick,
      ref: ref,
    },
    typeof children === "function" ? children({ isPressing: isLong }) : children
  );
};
