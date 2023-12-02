import {
  FC,
  HTMLAttributes,
  LegacyRef,
  PropsWithChildren,
  useCallback,
  useRef,
} from "react";

interface Props extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  onInteraction?: (entry: IntersectionObserverEntry) => void;
  once?: boolean;
}

export const ViewInteraction: FC<Props> = ({
  onInteraction,
  children,
  once = false,
  ...props
}) => {
  const observer = useRef<IntersectionObserver>();
  const ref: LegacyRef<HTMLElement> = useCallback(
    (node: HTMLElement) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          onInteraction?.(entry);
          if (once) observer.current?.disconnect();
        }
      });
      if (node) observer.current.observe(node);
    },
    [once]
  );

  return (
    <div {...props} ref={ref}>
      {children}
    </div>
  );
};
