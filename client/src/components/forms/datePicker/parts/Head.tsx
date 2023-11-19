import { FC } from "react";
import { useDatePickerContext } from "./Provider";
import { classes } from "./utils";
import { Stymbol } from "./Symbol";

export const Head: FC = () => {
  const { classNames, showYears } = useDatePickerContext();
  return (
    <div
      className={classes(
        classNames?.head,
        "flex justify-between py-1 px-2 gap-1 w-full text-xl border-b border-black"
      )}
    >
      <Year />
      {!showYears && <Month />}
    </div>
  );
};

const Year: FC = () => {
  const { currentDate, setShowYears, showYears } = useDatePickerContext();
  return (
    <div
      onClick={() => {
        setShowYears((p) => !p);
      }}
      className="flex gap-1 items-center"
    >
      <span className="cursor-pointer">
        {currentDate.y === null ? "YYYY" : currentDate.y}
      </span>
      <Stymbol
        className={classes(
          showYears && "rotate-180",
          "hover:bg-slate-400/50 duration-200 text-base rounded w-5 h-5 leading-none"
        )}
      >
        &#9660;
      </Stymbol>
    </div>
  );
};

const Month: FC = () => {
  const { prevMonth, currentDate, nextMonth, calendarDate } =
    useDatePickerContext();
  return (
    <div className="flex gap-1 items-center justify-between">
      <Stymbol handler={prevMonth}>{"<"}</Stymbol>
      <span className="w-9 text-center">
        {/* {new Date(new Date().setMonth(currentDate.m)).toLocaleDateString("us", { */}
        {calendarDate.toLocaleDateString("us", {
          month: "short",
        }) || "MM"}
      </span>
      <Stymbol handler={nextMonth}>{">"}</Stymbol>
    </div>
  );
};
