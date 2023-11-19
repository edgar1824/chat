import { FC, HTMLAttributes, PropsWithChildren } from "react";
import { IDate, IDateFormat } from "./types";
import { useDatePickerContext } from "./Provider";
import { classes } from "./utils";

function eq(date: Date, obj: IDateFormat) {
  const d = new Date(date);
  return (
    d.getDate() === obj.d && d.getMonth() === obj.m && d.getFullYear() === obj.y
  );
}

export const Day: FC<
  Partial<IDate> & HTMLAttributes<HTMLSpanElement> & PropsWithChildren
> = ({
  date,
  day,
  isToday,
  monthState,
  lastRow,
  col,
  row,
  className,
  children,
  ...props
}) => {
  const { hideOtherMonthDays, classNames, currentDate } =
    useDatePickerContext();
  return (
    <span
      {...props}
      className={classes(
        "p-1 select-none w-full grid place-content-center cursor-pointer hover:bg-slate-500/50 transition-[background] duration-200 rounded",
        !!monthState && "bg-slate-400/40 !border-black/40 rounded-none",
        isToday && (classNames?.today || "bg-[rgb(2_207_0)] border-black"),
        eq(new Date(date!), currentDate) &&
          (classNames?.active || "!bg-blue-300 !border-blue-500"),
        hideOtherMonthDays &&
          !!monthState &&
          "!bg-transparent !text-transparent !border-transparent !duration-0",
        className
      )}
    >
      {children}
    </span>
  );
};
