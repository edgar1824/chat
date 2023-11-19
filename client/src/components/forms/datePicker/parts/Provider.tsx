import {
  FC,
  KeyboardEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { DateKey, IContext, IDateFormat, ProviderProps } from "./types";
import {
  DateModelRegExp,
  DateRegExp,
  concatRegexp,
  fmtDoubleNum,
  fmtObjToString,
  formatToString,
  genDates,
  selectPositions,
  setDatePeriod,
  testDateString,
} from "./utils";

const Context = createContext<IContext>(null!);
export const useDatePickerContext = () => useContext(Context);

export const Provider: FC<ProviderProps> = ({
  classNames,
  hideOtherMonthDays = false,
  local,
  value: v,
  onValidation,
  children,
  format = "dd-mm-yyyy",
  separator,
  ...props
}) => {
  const [focus, setFocus] = useState(false);
  const [state, setState] = useState<DateKey>(
    (format?.split(separator || /[- /.]/)?.[0][0] as DateKey) || "d"
  );
  const [currentDate, setCurrentDate] = useState<IDateFormat>({
    d: v?.getDate() || null!,
    m: v?.getMonth() || null!,
    y: v?.getFullYear() || null!,
  });
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(new Date());
  const [isReverse, setIsReverse] = useState(false);
  const [yearElem, setYearElem] = useState<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState(192);
  const [showYears, setShowYears] = useState(false);
  const dates = useMemo(
    () => genDates(calendarDate, local),
    [calendarDate, local]
  );
  const [invalid, setInvalid] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // ##### Handlers #####
  function prevMonth() {
    setCalendarDate((p) => {
      const d = new Date(p);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  }
  function nextMonth() {
    setCalendarDate((p) => {
      const d = new Date(p);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  }
  const scrollYears = useCallback(
    function () {
      if (yearElem) {
        yearElem.parentElement?.scroll({
          top: yearElem.offsetTop - 100 + yearElem.offsetHeight,
        });
      }
    },
    [yearElem]
  );
  const keydownHanlder = (e: KeyboardEvent<HTMLInputElement>) => {
    const rxp = concatRegexp(/^/, DateModelRegExp[state], /$/);
    switch (e.key) {
      case "Backspace":
        e.preventDefault();
        setCurrentDate((p) => ({ ...p, [state]: null }));
        break;
      case "ArrowRight":
        e.preventDefault();
        if (format === "dd-mm-yyyy") {
          if (state === "d") setState("m");
          else if (state === "m") setState("y");
        } else if (format === "mm-dd-yyyy") {
          if (state === "m") setState("d");
          else if (state === "d") setState("y");
        } else if (format === "yyyy-mm-dd") {
          if (state === "y") setState("m");
          else if (state === "m") setState("d");
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (format === "dd-mm-yyyy") {
          if (state === "y") setState("m");
          else if (state === "m") setState("d");
        } else if (format === "mm-dd-yyyy") {
          if (state === "y") setState("d");
          else if (state === "d") setState("m");
        } else if (format === "yyyy-mm-dd") {
          if (state === "d") setState("m");
          else if (state === "m") setState("y");
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (Object.values(currentDate).some((e) => e === null)) {
          setCurrentDate((p) => ({
            ...p,
            [state]: rxp.test(fmtDoubleNum(p[state] + 1))
              ? state === "m" && p.m === null
                ? 0
                : p[state] + 1
              : state === "d"
              ? new Date(p.y, p.m, 0).getDate()
              : state === "m"
              ? 0
              : 1900,
          }));
        } else {
          const d = setDatePeriod(
            new Date(currentDate.y, currentDate.m, currentDate.d),
            currentDate[state] + 1,
            state
          );

          if (
            testDateString(
              formatToString(d, format, separator),
              format,
              separator
            )
          ) {
            setCurrentDate((p) => ({
              ...p,
              d: d.getDate(),
              m: d.getMonth(),
              y: d.getFullYear(),
            }));
          } else {
            setCurrentDate((p) => ({
              ...p,
              [state]:
                state === "d"
                  ? new Date(p.y, p.m + 1, 0).getDate()
                  : state === "m"
                  ? 0
                  : 1900,
            }));
          }
        }

        break;
      case "ArrowDown":
        e.preventDefault();

        if (Object.values(currentDate).some((e) => e === null)) {
          setCurrentDate((p) => ({
            ...p,
            [state]: rxp.test(fmtDoubleNum(p[state] - 1))
              ? p[state] - 1
              : state === "d"
              ? 31
              : state === "m"
              ? 11
              : 2099,
          }));
        } else {
          const d = setDatePeriod(
            new Date(currentDate.y, currentDate.m, currentDate.d),
            currentDate[state] - 1,
            state
          );

          if (
            testDateString(
              formatToString(d, format, separator),
              format,
              separator
            )
          ) {
            setCurrentDate((p) => ({
              ...p,
              d: d.getDate(),
              m: d.getMonth(),
              y: d.getFullYear(),
            }));
          } else {
            setCurrentDate((p) => ({
              ...p,
              [state]: state === "d" ? 31 : state === "m" ? 11 : 2099,
            }));
          }
        }

        break;
      default:
        if (e.key.length === 1) {
          if (!isNaN(+e.key)) {
            e.preventDefault();

            let allowed =
              rxp.test(currentDate[state] + "" + e.key) &&
              currentDate[state] !== null;
            let val = allowed
              ? parseInt(currentDate[state] + "" + e.key)
              : +e.key;
            if (state === "y") {
              allowed =
                currentDate[state] !== null &&
                (parseInt(currentDate.y + "" + e.key) < 999
                  ? true
                  : rxp.test(currentDate[state] + "" + e.key));

              if (allowed) val = parseInt(currentDate[state] + "" + e.key);
              else val = +e.key;
            } else if (state === "m") {
              allowed =
                rxp.test(
                  fmtDoubleNum(parseInt(currentDate[state] + "" + e.key) - 1)
                ) && currentDate[state] !== null;

              if (e.key === "0") val = currentDate.m;
              else if (currentDate[state] === 1) val = +e.key - 1;
              else if (currentDate[state] === 0 && e.key === "1") val = 10;
              else if (currentDate[state] === 0 && e.key === "2") val = 11;
              else val = val - 1;
            }

            setCurrentDate((p) => ({ ...p, [state]: val }));
          }
        }
        break;
    }
  };
  const yearClickHandler = (y: number) => {
    setCurrentDate((p) => ({ ...p, y }));
    setShowYears(false);
  };

  //   ##### useEffects #####

  useEffect(() => {
    function reverseCalendar() {
      if (calendarRef.current) {
        const { top, height } = calendarRef.current.getBoundingClientRect();
        setIsReverse(
          window.innerHeight - top - height / 2 < window.innerHeight / 2
        );
      }
    }
    reverseCalendar();
    document.addEventListener("scroll", reverseCalendar);
    return () => {
      document.removeEventListener("scroll", reverseCalendar);
    };
  }, [calendarRef]);
  useEffect(() => {
    scrollYears();
  }, [yearElem]);
  useEffect(() => {
    if (inputRef.current) {
      const fn = (n: number) => (!n ? 0 : n + (separator?.length || 0));
      const fmt = selectPositions[format][state];
      inputRef.current!.setSelectionRange(fn(fmt[0]), fn(fmt[1]));
    }
  }, [inputRef, state, currentDate, focus, format]);
  useEffect(() => {
    const notValid =
      Object.values(currentDate).some((e) => e === null) &&
      !Object.values(currentDate).every((e) => e === null);
    setInvalid(notValid);
    if (!notValid) {
      setCalendarDate(new Date(currentDate.y, currentDate.m, currentDate.d));
      setValue(new Date(currentDate.y, currentDate.m, currentDate.d));
      props?.onValidChange?.({
        ...currentDate,
        date: new Date(fmtObjToString(currentDate, format, separator)),
      });
    }
    props?.onChange?.({
      ...currentDate,
      date: notValid
        ? fmtObjToString(currentDate, format, separator)
        : new Date(fmtObjToString(currentDate, "mm-dd-yyyy", "-")),
    });
  }, [currentDate]);
  useEffect(() => {
    onValidation?.({ isValid: !invalid });
  }, [invalid]);
  useEffect(() => {
    setCurrentDate({
      d: v?.getDate() || null!,
      m: v?.getMonth() || null!,
      y: v?.getFullYear() || null!,
    });
  }, [v]);

  const values: IContext = {
    invalid,
    setInvalid,
    show,
    setShow,
    showYears,
    setShowYears,
    yearElem,
    setYearElem,
    maxHeight,
    setMaxHeight,
    calendarDate,
    setCalendarDate,
    isReverse,
    currentDate,
    setCurrentDate,
    focus,
    setFocus,
    value,
    setValue,
    setState,

    inputRef,
    calendarRef,
    dates,

    nextMonth,
    prevMonth,
    scrollYears,
    keydownHanlder,
    yearClickHandler,

    classNames,
    hideOtherMonthDays,
    local,
    format,
    separator,
    ...props,
  };

  return <Context.Provider value={values}>{children(values)}</Context.Provider>;
};
