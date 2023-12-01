import { FC, useCallback, useState } from "react";

interface Props {
  lines?: number;
  leading?: number;
  text?: string;
  className?: string;
  parentClass?: string;
}

export const TextExpander: FC<Props> = ({
  text = "",
  className = "",
  parentClass = "",
  leading = 16,
  lines = 1,
}) => {
  const [elem, setElem] = useState({
    scrollHeight: 0,
    offsetHeight: 0,
    offsetWidth: 0,
  });
  const [show, setShow] = useState(false);

  const handleRef = useCallback((node: HTMLParagraphElement) => {
    if (!!node) {
      setElem({
        offsetHeight: node.offsetHeight,
        scrollHeight: node.scrollHeight,
        offsetWidth: node.offsetWidth,
      });
    }
  }, []);

  return (
    <div className={parentClass}>
      <p
        ref={handleRef}
        className={className}
        style={{
          height: show ? "100%" : leading * lines + "px",
          overflow: show ? "unset" : "hidden",
        }}
      >
        {text}
      </p>
      {elem?.scrollHeight - elem?.scrollHeight / 2 >= elem?.offsetHeight && (
        <span
          onClick={() => setShow((p) => !p)}
          style={{ float: "inline-end" }}
          className="cursor-pointer text-xs h-3 mr-2 text-slate-500"
        >
          {show ? "less" : "more..."}
        </span>
      )}
    </div>
  );
};
