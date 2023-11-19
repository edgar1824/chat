import { useDatePickerContext } from "./Provider";
import { classes } from "./utils";

export const Icon = () => {
  const { classNames, setShow } = useDatePickerContext();
  return (
    <div
      className={classes(
        "absolute top-1/2 right-1 select-none -translate-y-1/2 border border-black w-5 h-5 grid place-content-center",
        classNames?.icon
      )}
      onClick={() => setShow((p) => !p)}
    >
      &times;
    </div>
  );
};
