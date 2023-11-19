import {
  FC,
  KeyboardEvent,
  MouseEvent,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IContext, IProvider, ITimeFormat } from "./types";
import {
  TimeRegExp,
  clockSteps_default,
  concatRegexp,
  fmtDoubleNum,
  steps,
  testTime,
} from "./utils";

const Context = createContext<IContext>(null!);
export const useTimePickerContext = () => useContext(Context);

export const Provider: FC<IProvider> = ({
  children,
  format = "hh:mm",
  value: v,
  hidePeriods = false,
  clock = { height: 200, pointerLine: 2, width: 200, round: 16 },
  ...props
}) => {
  const [time, setTime] = useState<ITimeFormat>({
    hours: v?.hours || null!,
    minutes: v?.minutes || null!,
    seconds: v?.seconds || null!,
    format: v?.format || null!,
  });
  const [current, setCurrent] = useState<IContext["current"]>({
    step: format !== "mm:ss" ? steps.hours : steps.minutes,
    state: format !== "mm:ss" ? "hours" : "minutes",
    numbers:
      format !== "mm:ss"
        ? clockSteps_default.hours
        : clockSteps_default.minutes,
    rotate: 360,
  });
  const [mouse, setMouse] = useState({
    down: false,
    _down: false,
  });
  const [show, setShow] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [isReverse, setIsReverse] = useState(false);
  const [focus, setFocus] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pointerLineRef = useRef<HTMLInputElement>(null);
  const timeString = useMemo(
    () =>
      [
        format !== "mm:ss" &&
          (time.hours !== null ? fmtDoubleNum(time.hours) : "hh"),
        time.minutes !== null ? fmtDoubleNum(time.minutes) : "mm",
        format !== "hh:mm" &&
          (time.seconds !== null ? fmtDoubleNum(time.seconds) : "ss"),
      ]
        .filter(Boolean)
        .join(":"),
    [time, format]
  );

  const mouseMoveHandler = (event: MouseEvent<HTMLDivElement>) => {
    if (mouse.down && mouse._down) {
      const rott = parseInt(current.rotate as string);
      const x = event.nativeEvent.offsetX - (clock?.width || 200) / 2;
      const y =
        (event.nativeEvent.offsetY - (clock?.height || 200)) * -1 -
        (clock?.height || 200) / 2;
      const z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      let deg = rott;

      if (x > 0 && y > 0) {
        deg = ((Math.asin(y / z) * 180) / Math.PI) * -1 + 90;
      } else if (x < 0 && y > 0) {
        deg = ((Math.acos(x / z) * 180) / Math.PI) * -1 + 90;
      } else if (x < 0 && y < 0) {
        deg = (Math.acos(x / z) * 180) / Math.PI + 90;
      } else if (x > 0 && y < 0) {
        deg = (Math.acos(x / z) * 180) / Math.PI + 90;
      }

      if (deg < 0) {
        deg = 360 + deg;
      }

      let num = parseInt((deg / current.step).toFixed()) * current.step;
      if (num === 0 || num === 360) {
        num = 360;
      }

      if (current.rotate != num) {
        setTime((p) => ({
          ...p,
          [current.state]: current.numbers.find(({ deg }) => deg === num)?.num!,
        }));
      }
    }
  };
  const keyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Backspace":
        e.preventDefault();
        setTime((p) => ({
          ...p,
          [current.state]: null,
        }));
        break;
      case "ArrowRight":
        e.preventDefault();
        if (format === "hh:mm") {
          if (current.state === "hours") changeTimeState("minutes");
          else if (current.state === "minutes" && !hidePeriods)
            changeTimeState("format");
        } else if (format === "mm:ss") {
          if (current.state === "minutes") changeTimeState("seconds");
          else if (current.state === "seconds" && !hidePeriods)
            changeTimeState("format");
        } else if (format === "hh:mm:ss") {
          if (current.state === "hours") changeTimeState("minutes");
          else if (current.state === "minutes") changeTimeState("seconds");
          else if (current.state === "seconds" && !hidePeriods)
            changeTimeState("seconds");
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (format === "hh:mm") {
          if (current.state === "minutes") changeTimeState("hours");
          else if (current.state === "format") changeTimeState("minutes");
        } else if (format === "mm:ss") {
          if (current.state === "seconds") changeTimeState("minutes");
          else if (current.state === "format") changeTimeState("seconds");
        } else if (format === "hh:mm:ss") {
          if (current.state === "seconds") changeTimeState("minutes");
          else if (current.state === "format") changeTimeState("seconds");
          else changeTimeState("hours");
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (current.state === "format") {
          if (time.format !== "am") setTime((p) => ({ ...p, format: "am" }));
        } else {
          setTime((p) => ({
            ...p,
            [current.state]: TimeRegExp[
              current.state === "hours"
                ? "hh"
                : current.state === "minutes"
                ? "mm"
                : "ss"
            ].test(fmtDoubleNum((p[current.state] as number) + 1))
              ? (p[current.state] as number) + 1
              : current.state === "hours"
              ? 1
              : 0,
          }));
        }

        break;
      case "ArrowDown":
        e.preventDefault();
        if (current.state === "format") {
          if (time.format !== "pm") setTime((p) => ({ ...p, format: "pm" }));
        } else {
          setTime((p) => ({
            ...p,
            [current.state]: TimeRegExp[
              current.state === "hours"
                ? "hh"
                : current.state === "minutes"
                ? "mm"
                : "ss"
            ].test(fmtDoubleNum((p[current.state] as number) - 1))
              ? (p[current.state] as number) - 1
              : current.state === "hours"
              ? 12
              : 59,
          }));
        }
        break;
      default:
        if (e.key.length === 1) {
          if (!isNaN(+e.key)) {
            e.preventDefault();
            switch (current.state) {
              case "hours": {
                if (
                  concatRegexp(/^/, TimeRegExp.hh, /$/).test(
                    time.hours + "" + e.key
                  )
                ) {
                  setTime((p) => ({
                    ...p,
                    hours: parseInt(p.hours + "" + e.key),
                  }));
                } else {
                  setTime((p) => ({ ...p, hours: +e.key }));
                }
                break;
              }
              case "minutes": {
                if (
                  concatRegexp(/^/, TimeRegExp.mm, /$/).test(
                    time.minutes + "" + e.key
                  )
                ) {
                  setTime((p) => ({
                    ...p,
                    minutes: parseInt(p.minutes + "" + e.key),
                  }));
                } else {
                  setTime((p) => ({ ...p, minutes: +e.key }));
                }
                break;
              }
              case "seconds": {
                if (
                  concatRegexp(/^/, TimeRegExp.ss, /$/).test(
                    time.seconds + "" + e.key
                  )
                ) {
                  setTime((p) => ({
                    ...p,
                    seconds: parseInt(p.seconds + "" + e.key),
                  }));
                } else {
                  setTime((p) => ({ ...p, seconds: +e.key }));
                }

                break;
              }
            }
          } else {
            if (current.state === "format") {
              if (e.key.toLocaleLowerCase() === "a") {
                setTime((p) => ({ ...p, format: "am" }));
              } else if (e.key.toLocaleLowerCase() === "p") {
                setTime((p) => ({ ...p, format: "pm" }));
              }
            }
          }
        }
        break;
    }
  };
  const changeTimeState = (f: keyof ITimeFormat) => {
    let deg = current.rotate,
      numbers = current.numbers,
      step = current.step;
    if (f !== "format") {
      deg = clockSteps_default[f].find((e) => e.num == time[f])?.deg || 360;
      numbers = clockSteps_default[f];
      step = steps[f];
    }
    setCurrent((p) => ({ ...p, step, state: f, rotate: deg, numbers }));
  };
  const reset = (resetTimeFormat: boolean = true) => {
    setCurrent((p) => ({
      ...p,
      numbers:
        clockSteps_default[format.split(":")[0] === "hh" ? "hours" : "minutes"],
      state: format.split(":")[0] === "hh" ? "hours" : "minutes",
      step: format.split(":")[0] === "hh" ? steps.hours : steps.minutes,
    }));
    setTime((p) => ({
      hours: 0,
      minutes: 0,
      seconds: 0,
      format: resetTimeFormat ? "pm" : p.format,
    }));
  };

  useEffect(() => {
    function mouseDownHandler() {
      setMouse((p) => ({ ...p, down: true }));
    }
    function mouseUpHandler() {
      setMouse((p) => ({ ...p, down: false }));
    }
    document.addEventListener("mousedown", mouseDownHandler);
    document.addEventListener("mouseup", mouseUpHandler);
    return () => {
      document.removeEventListener("mousedown", mouseDownHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };
  }, []);

  useEffect(() => {
    function reversePicker() {
      if (contentRef.current) {
        const { top, height } = contentRef.current.getBoundingClientRect();
        setIsReverse(
          window.innerHeight - top - height / 2 < window.innerHeight / 2
        );
      }
    }
    reversePicker();
    document.addEventListener("scroll", reversePicker);
    return () => {
      document.removeEventListener("scroll", reversePicker);
    };
  }, [contentRef]);

  useEffect(() => {
    setCurrent((p) => ({
      ...p,
      rotate: p.numbers.find((el) => el.num === time[p.state])?.deg || 360,
    }));
    props?.onChange?.({
      ...time,
      time:
        timeString +
        ` ${time.format !== null ? time.format.toLocaleUpperCase() : "aa"}`,
    });
  }, [time]);

  useEffect(() => {
    const bool =
      !(
        Object.values(time).every((e) => e === null) &&
        Object.values(time).some((e) => e === null)
      ) &&
      (!testTime(timeString, format) || (!hidePeriods && time.format === null));
    if (!bool) {
      props.onValidChange?.({
        ...time,
        time: [
          timeString,
          !hidePeriods &&
            (time.format !== null ? time.format.toLocaleUpperCase() : "aa"),
        ]
          .filter(Boolean)
          .join(" "),
      });
    }
    if (bool !== invalid) setInvalid(bool);
  }, [timeString, time, hidePeriods]);

  useEffect(() => {
    props?.onValidation?.({ isValid: !invalid });
  }, [invalid]);

  useEffect(() => {
    if (inputRef.current) {
      switch (current.state) {
        case "hours":
          inputRef.current.setSelectionRange(0, 2);
          break;
        case "minutes":
          if (format === "mm:ss") inputRef.current.setSelectionRange(0, 2);
          else inputRef.current.setSelectionRange(3, 5);
          break;
        case "seconds":
          if (format === "mm:ss") inputRef.current.setSelectionRange(3, 5);
          else inputRef.current.setSelectionRange(6, 8);
          break;
        case "format":
          if (format === "hh:mm:ss") inputRef.current.setSelectionRange(9, 11);
          else inputRef.current.setSelectionRange(6, 8);
          break;
      }
    }
  }, [current, inputRef, time, focus, format]);

  useEffect(() => {
    if (v) setTime(v);
  }, [v]);

  const values: IContext = {
    mouse,
    setMouse,
    time,
    setTime,
    show,
    setShow,
    invalid,
    setInvalid,
    focus,
    setFocus,
    current,
    setCurrent,
    isReverse,

    inputRef,
    contentRef,
    pointerLineRef,
    timeString,
    mouseMoveHandler,
    keyDownHandler,
    changeTimeState,
    reset,

    format,
    hidePeriods,
    clock,
    ...props,
  };

  return (
    <Context.Provider value={values}>
      {typeof children === "function" ? children(values) : children}
    </Context.Provider>
  );
};
