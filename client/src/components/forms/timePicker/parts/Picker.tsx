import { Animated } from "components/reusable";
import { FC } from "react";
import { Head } from "./Head";
import { useTimePickerContext } from "./Provider";
import { classes } from "./utils";
import { Clock } from "./Clock";

export const Picker: FC = () => {
  const { show, isReverse } = useTimePickerContext();
  return (
    <Animated
      removeOnEnd
      show={show}
      duration={200}
      from={{ opacity: "0", transform: "scaleY(0.95)" }}
      to={{ opacity: "1", transform: "scaleY(1)" }}
      className={classes(
        "absolute flex flex-col items-center bg-slate-200 p-1 rounded shadow-md",
        isReverse
          ? "origin-[50%_100%] bottom-[calc(100%_+_6px)]"
          : "origin-[50%_0%] top-[calc(100%_+_6px)]"
      )}
    >
      <Head />
      <Clock />
    </Animated>
  );
};
