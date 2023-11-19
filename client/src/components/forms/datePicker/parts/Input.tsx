import { useDatePickerContext } from "./Provider";
import { DateKey } from "./types";
import { classes, fmtObjToString } from "./utils";

export const Input = () => {
  const {
    inputProps,
    invalid,
    classNames,
    setFocus,
    keydownHanlder,
    currentDate,
    separator,
    format,
    setState,
    inputRef,
    focus,
  } = useDatePickerContext();
  return (
    <div
      className={classes(
        "border-2 border-black relative bg-white",
        invalid && "border-red-700"
      )}
    >
      {!!inputProps?.placeholder &&
        Object.values(currentDate).every((e) => e === null) &&
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
        ref={inputRef}
        value={fmtObjToString(currentDate, format, separator)}
        spellCheck={false}
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
        onChange={() => {}}
        onKeyDown={keydownHanlder}
        onClick={() => {
          setState(
            (format?.split(separator || /[- /.]/)?.[0][0] as DateKey) || "d"
          );
        }}
      />
    </div>
  );
};
