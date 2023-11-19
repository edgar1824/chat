import { FC, ReactNode, forwardRef, useState } from "react";

interface Props {
  onDoubleClick?(): void;
  onCancel?(): void;
  className?: string;
  children?: ReactNode;
}

export const DoubleClick: FC<Props> = ({
  children,
  onDoubleClick,
  onCancel,
  ...props
}) => {
  const [clickCount, setClickCount] = useState(0);

  const handleDoubleClick = () => {
    setClickCount((p) => p + 1);

    if (clickCount === 1) {
      onDoubleClick?.();
    }

    setTimeout(() => setClickCount(0), 300);
  };

  return (
    <div {...props} onClick={handleDoubleClick}>
      {children}
    </div>
  );
};
