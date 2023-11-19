import { useEffect, useState } from "react";

export const useMedia = (ratio: number) => {
  const [bool, setBool] = useState(window.innerWidth < ratio);

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth < ratio) setBool(true);
      else setBool(false);
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [ratio]);

  return bool;
};
