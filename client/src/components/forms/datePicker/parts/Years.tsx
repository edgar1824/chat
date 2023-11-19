import { FC } from "react";
import { useDatePickerContext } from "./Provider";
import { classes, genYears } from "./utils";

export const Years: FC = () => {
  const { classNames, currentDate, maxHeight, setYearElem, yearClickHandler } =
    useDatePickerContext();

  return (
    <div
      style={{ maxHeight: `${maxHeight}px` }}
      className={classes("grid grid-cols-4 overflow-auto relative")}
    >
      {genYears().map((y) => (
        <div
          onClick={() => yearClickHandler(y)}
          ref={(node) => {
            if (y === currentDate.y) {
              setYearElem(node);
            }
          }}
          className={classes(
            currentDate.y === y &&
              (classNames?.active || "!bg-blue-300 !border-blue-500"),
            "hover:bg-slate-500/50 duration-200 cursor-pointer rounded place-content-center grid"
          )}
          key={y}
        >
          {y}
        </div>
      ))}
    </div>
  );
};
