import { Animated } from "components/reusable";
import { FC } from "react";
import { classes } from "./utils";
import { useDatePickerContext } from "./Provider";
import { Head } from "./Head";
import { Dates } from "./Dates";
import { Years } from "./Years";

export const Calendar: FC = () => {
  const { classNames, isReverse, showYears, show } = useDatePickerContext();

  return (
    <Animated
      removeOnEnd
      show={show}
      duration={200}
      from={{ opacity: "0", transform: "scaleY(0.95)" }}
      to={{ opacity: "1", transform: "scaleY(1)" }}
      className={classes(
        classNames?.calendar,
        "max-w-[300px] flex flex-col absolute bg-slate-200 shadow-md w-full overflow-hidden",
        isReverse
          ? "bottom-[calc(100%_+_6px)] origin-[50%_95%]"
          : "top-[calc(100%_+_6px)] origin-[50%_5%]"
      )}
    >
      <Head />
      {!showYears ? <Dates /> : <Years />}
    </Animated>
  );
};
