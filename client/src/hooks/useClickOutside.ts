import { RefObject, useEffect, useRef, useState } from "react";

export const useClickOutside = (ref: RefObject<HTMLElement>) => {
  const [bool, setBool] = useState(0);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current?.contains(event.target as Node | null)) {
        setBool((p) => p + 1);
      } else {
        setBool(0);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return bool;
};
