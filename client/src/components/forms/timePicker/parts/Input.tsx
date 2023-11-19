import { useState } from "react";
import { useTimePickerContext } from "./Provider";
import { classes, fmtDoubleNum } from "./utils";

export const Input = () => {
  const {
    inputRef,
    invalid,
    inputProps,
    time,
    classNames,
    format,
    changeTimeState,
    keyDownHandler,
    timeString,
    focus,
    setFocus,
    hidePeriods,
  } = useTimePickerContext();

  return (
    <div
      className={classes(
        "border-2 border-black relative bg-white",
        invalid && "border-red-700"
      )}
    >
      {!!inputProps?.placeholder &&
        Object.values(time).every((e) => e === null) &&
        !focus && (
          <span
            onClick={() => setFocus(true)}
            className={classes(
              "z-[2] absolute top-1/2 -translate-y-1/2 left-2 cursor-text bg-inherit min-w-[120px]"
            )}
          >
            {inputProps?.placeholder}
          </span>
        )}
      <input
        {...inputProps}
        spellCheck={false}
        ref={inputRef}
        value={[
          timeString,
          !hidePeriods &&
            (time.format !== null ? time.format.toLocaleUpperCase() : "aa"),
        ]
          .filter(Boolean)
          .join(" ")}
        className={classes(
          "outline-none caret-transparent h-[1.8rem] px-2 py-1",
          invalid && "border-red-700 text-red-700",
          classNames?.input
        )}
        onFocus={(e) => {
          setFocus(true);
          inputProps?.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          inputProps?.onBlur?.(e);
        }}
        onChange={(e) => {}}
        onClick={(e) => {
          changeTimeState(format === "mm:ss" ? "minutes" : "hours");
          inputProps?.onClick?.(e);
        }}
        onKeyDown={keyDownHandler}
      />
    </div>
  );
};
