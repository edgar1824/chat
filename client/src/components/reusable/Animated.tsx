import {
  CSSProperties,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  forwardRef,
  memo,
  useEffect,
  useState,
} from "react";

interface IProperties extends CSSProperties {}

interface Props {
  show?: boolean;
  duration?: number;
  children?: ReactNode;
  className?: string;
  to?: IProperties;
  from?: IProperties;
  removeOnEnd?: boolean;
  initial?: IProperties;
}

export const Animated: ForwardRefExoticComponent<
  Props & RefAttributes<HTMLDivElement>
> = memo(
  forwardRef(
    (
      {
        show,
        duration = 300,
        children,
        className = "",
        from,
        to,
        removeOnEnd = false,
        initial,
      }: Props,
      ref
    ) => {
      const [hidden, setHidden] = useState(false);
      const [styles, setStyles] = useState<IProperties>(null!);

      useEffect(() => {
        if (show === false) {
          removeOnEnd && hidden && setHidden(false);
          setStyles(from!);
          if (removeOnEnd) {
            const timeout = setTimeout(() => {
              setHidden(true);
            }, duration + 1);
            return () => {
              clearTimeout(timeout);
            };
          }
        } else {
          removeOnEnd && hidden && setHidden(false);
          setStyles(from!);
          const timeout = setTimeout(() => {
            setStyles(to!);
          }, 1);
          return () => {
            clearTimeout(timeout);
          };
        }
      }, [show]);

      if (hidden && removeOnEnd) {
        return null;
      }

      return (
        <Check {...{ show, removeOnEnd }}>
          <div
            ref={ref}
            style={{
              ...initial,
              ...styles,
              transitionDuration: `${duration}ms`,
            }}
            className={"transition-all " + className}
          >
            {children}
          </div>
        </Check>
      );
    }
  ),
  (a, b) => {
    return !!(
      (a.removeOnEnd || b.removeOnEnd) &&
      ![a, b].some((e) => e.show === true)
    );
  }
);

const Check = ({ children, show, removeOnEnd = false }: Props) => {
  const [del] = useState(removeOnEnd && !show);
  if (del) return null;
  return <>{children}</>;
};
