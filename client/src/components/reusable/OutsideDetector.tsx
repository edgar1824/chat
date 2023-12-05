import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
} from "react";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  onOutside?: (event: MouseEvent) => void;
  onInside?: (event: MouseEvent) => void;
  onRef?: (ref: RefObject<HTMLDivElement>) => void;
}

export const OutsideDetector: FC<Props> = ({
  children,
  onOutside,
  onInside,
  onRef,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      onRef?.(ref);
    }

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current?.contains(event.target as Node | null)) {
        onOutside?.(event);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
};
