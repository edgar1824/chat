import { useTimePickerContext } from "./Provider";
import { classes, fmtDoubleNum } from "./utils";

export const Clock = () => {
  const {
    mouse,
    mouseMoveHandler,
    current,
    format,
    changeTimeState,
    classNames,
    setMouse,
    time,
    pointerLineRef,
    clock,
  } = useTimePickerContext();

  return (
    <div className="relative px-2 py-3">
      <ToggleButtons />
      <div
        draggable="false"
        className="bg-slate-300 rounded-full relative select-none box-content border-[4px] border-slate-300"
        style={{
          cursor: mouse.down && mouse._down ? "move" : "default",
          width: `${clock?.width || 200}px`,
          height: `${clock?.height || 200}px`,
        }}
      >
        <div
          draggable="false"
          className="absolute inset-0 rounded-full z-[999]"
          style={{ cursor: mouse.down && mouse._down ? "move" : "default" }}
          onMouseDown={() => {
            if (current.state === "format") {
              changeTimeState(format === "hh:mm" ? "minutes" : "seconds");
            }
            setMouse((p) => ({ ...p, _down: true }));
          }}
          onMouseMove={mouseMoveHandler}
          onMouseUp={() => {
            setMouse((p) => ({ ...p, _down: false }));
            if (current.state === "hours") changeTimeState("minutes");
            else if (current.state === "minutes" && format !== "hh:mm")
              changeTimeState("seconds");
          }}
        ></div>
        <div
          ref={pointerLineRef}
          draggable="false"
          style={{
            transform: `rotate(${current.rotate}deg) translateX(-50%)`,
            width: `${clock?.pointerLine || 2}px`,
            cursor: mouse.down && mouse._down ? "move" : "default",
          }}
          className="h-1/2 bg-black rounded-lg origin-[0%_100%] absolute left-1/2 top-0"
        >
          <div
            style={{
              background:
                current.state !== "hours" && +current.rotate % 5
                  ? "black"
                  : "rgb(96 165 250 / 1)",
              borderWidth: `${clock?.round || 16}px`,
            }}
            className="box-content absolute w-1 h-1 rounded-full border-blue-400 -translate-x-1/2 left-1/2"
          ></div>
        </div>
        <div
          style={{
            width: `${(clock?.pointerLine || 2) * 3}px`,
            height: `${(clock?.pointerLine || 2) * 3}px`,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-black"
        ></div>

        {current.numbers.map(({ deg, num, show }) => (
          <div
            key={deg}
            style={{
              transform: `rotate(${deg}deg) translateX(-50%)`,
              width: `${clock?.pointerLine || 2}px`,
            }}
            className="h-1/2 rounded-lg origin-[0%_100%] absolute left-1/2"
          >
            <div
              style={{
                transform: `translate(calc(-50% + ${
                  (clock?.pointerLine || 2) / 2
                }px), ${((clock?.round || 16) + 4) / 2}px)`,
              }}
              className="text-base leading-none grid place-content-center"
            >
              <span
                style={{ transform: `rotate(-${deg}deg)` }}
                className={classes(
                  "grid place-content-center rounded-full text-center",
                  time[current.state] === num && "!text-white",
                  typeof classNames?.timeNumber === "function"
                    ? classNames?.timeNumber?.({ deg, num, show })
                    : classNames?.timeNumber
                )}
              >
                {show && (current.state !== "hours" ? fmtDoubleNum(num) : num)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ToggleButtons = () => {
  const { changeTimeState, current, format } = useTimePickerContext();
  return (
    <div className="select-none flex items-center gap-1 absolute top-0 right-0">
      <span
        className="font-mono cursor-pointer w-6 align-middle h-6 leading-3 p-[5px] duration-300 box-border rounded-full text-center hover:bg-slate-400/50"
        onClick={() => {
          const state =
            current.state === "minutes" && format !== "mm:ss"
              ? "hours"
              : current.state === "seconds"
              ? "minutes"
              : "hours";
          if (current.state !== state) changeTimeState(state);
        }}
      >
        {"<"}
      </span>
      <span
        className="font-mono cursor-pointer w-6 align-middle h-6 leading-3 p-[5px] duration-300 box-border rounded-full text-center hover:bg-slate-400/50"
        onClick={() => {
          const state =
            current.state === "hours"
              ? "minutes"
              : current.state === "minutes" && format !== "hh:mm"
              ? "seconds"
              : "minutes";
          if (current.state !== state) changeTimeState(state);
        }}
      >
        {">"}
      </span>
    </div>
  );
};
