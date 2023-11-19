import { FC } from "react";
import { useDatePickerContext } from "./Provider";
import { classes, weekdays } from "./utils";
import { Day } from "./Day";

export const Dates: FC = () => {
  const { classNames, dates, setCurrentDate, setMaxHeight } =
    useDatePickerContext();

  return (
    <div
      className="flex flex-col"
      ref={(node) => {
        if (node?.offsetHeight) setMaxHeight(node.offsetHeight);
      }}
    >
      <WeekDays />
      <div
        className={classes(
          classNames?.dates,
          "grid grid-cols-7 justify-items-center"
        )}
      >
        {dates.map(({ date, day, monthState, isToday, ...rest }) => (
          <Day
            key={date.toISOString()}
            onClick={() => {
              setCurrentDate({
                d: date.getDate(),
                m: date.getMonth(),
                y: date.getFullYear(),
              });
            }}
            className={classes(
              classNames?.day?.({ date, day, monthState, ...rest })
            )}
            {...{ date, day, monthState, isToday, ...rest }}
          >
            {day}
          </Day>
        ))}
      </div>
    </div>
  );
};

const WeekDays: FC = () => {
  const { local, classNames } = useDatePickerContext();
  return (
    <div
      className={classes(
        classNames?.dates,
        "grid grid-cols-7 justify-items-center"
      )}
    >
      {weekdays("narrow", local!).map((weekday, i) => (
        <Day className="text-black/40 pointer-events-none" key={i}>
          {weekday}
        </Day>
      ))}
    </div>
  );
};
