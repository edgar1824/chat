import { FC, useCallback, useState } from "react";

interface Props {
  lines?: number;
  text?: string;
  className?: string;
  parentClass?: string;
  mediaDeps?: any[];
}

export const TextExpander: FC<Props> = ({
  text = "",
  className = "",
  parentClass = "",
  lines = 1,
  mediaDeps = [],
}) => {
  const [elem, setElem] = useState({
    offsetHeight: 0,
    scrollHeight: 0,
    lineHeight: 0,
  });
  const [show, setShow] = useState(false);

  const handleRef = useCallback(
    (node: HTMLParagraphElement) => {
      if (!!node) {
        setElem((p) => ({
          ...p,
          offsetHeight: node.offsetHeight,
          scrollHeight: node.scrollHeight,
          lineHeight: parseFloat(getComputedStyle(node).lineHeight),
        }));
      }
    },
    [...mediaDeps]
  );

  return (
    <div className={parentClass}>
      <p
        ref={handleRef}
        className={className}
        style={{
          height: show ? "100%" : elem.lineHeight * lines + "px",
          overflow: show ? "unset" : "hidden",
        }}
      >
        {text}
      </p>
      {elem.scrollHeight / elem.lineHeight > lines && (
        <span
          onClick={() => setShow((p) => !p)}
          style={{ float: "inline-end" }}
          className="cursor-pointer text-xs h-3 mr-2 text-slate-500 underline"
        >
          {show ? "less" : "more..."}
        </span>
      )}
    </div>
  );
};
