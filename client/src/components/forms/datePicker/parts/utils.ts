import { DateFormats, DateKey, IDate, IDateFormat, Props } from "./types";

// /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
export const DateRegExp = {
  d: /(0[1-9]|[12][0-9]|3[01])/,
  m: /(0[1-9]|1[012])/,
  y: /(19|20)[0-9][0-9]/,
};
export const DateModelRegExp = {
  d: /(0[1-9]|[12][0-9]|3[01])/,
  m: /(0[0-9]|1[01])/,
  y: /(19|20)[0-9][0-9]/,
};

function isToday(d: Date) {
  const currentDate = new Date(Date.now());
  const date = new Date(d);
  return (
    currentDate.getFullYear() === date.getFullYear() &&
    currentDate.getMonth() === date.getMonth() &&
    currentDate.getDate() === date.getDate()
  );
}
function formats<T extends string | RegExp>(sep: T) {
  return {
    "dd-mm-yyyy": {
      regexp: [DateRegExp.d, sep, DateRegExp.m, sep, DateRegExp.y],
      get: (str: string) => {
        const [d, m, y] = str.split(sep);
        return { d, m, y };
      },
    },
    "mm-dd-yyyy": {
      regexp: [DateRegExp.m, sep, DateRegExp.d, sep, DateRegExp.y],
      get: (str: string) => {
        const [m, d, y] = str.split(sep);
        return { d, m, y };
      },
    },
    "yyyy-mm-dd": {
      regexp: [DateRegExp.y, sep, DateRegExp.m, sep, DateRegExp.d],
      get: (str: string) => {
        const [y, m, d] = str.split(sep);
        return { d, m, y };
      },
    },
  };
}

function getDay(d: Date, type: "us" | "normal" = "normal") {
  if (type === "normal") {
    if (d.getDay() === 0) return 6;
    else return d.getDay() - 1;
  } else return d.getDay();
}

export const selectPositions = {
  "dd-mm-yyyy": {
    d: [0, 2],
    m: [3, 5],
    y: [6, 10],
  },
  "mm-dd-yyyy": {
    d: [3, 5],
    m: [0, 2],
    y: [6, 10],
  },
  "yyyy-mm-dd": {
    d: [8, 10],
    m: [5, 7],
    y: [0, 4],
  },
} as const;

export function concatRegexp(...regs: RegExp[]) {
  let flags: string = "",
    sources = "";
  regs.forEach((regexp) => {
    flags += regexp.flags;
    sources += regexp.source;
  });
  flags = Array.from(new Set(flags.split(""))).join();
  return new RegExp(sources, flags);
}

export function fmtDoubleNum(n: number) {
  return +n < 10 && +n >= 0 ? `0${n}` : n + "" || "00";
}

export function classes<T>(...arr: T[]) {
  return arr
    .filter(Boolean)
    .filter((s) => s !== " " && s !== "0")
    .join(" ");
}

export function genDates(d: Date, type: "us" | "normal" = "normal") {
  const date = new Date(d);

  const month = date.getMonth();
  const endDate = new Date(date);

  endDate.setDate(1);
  endDate.setMonth(d.getMonth() + 1);
  endDate.setDate(0);
  date.setDate(1);

  while (getDay(endDate, type) < 6) {
    endDate.setDate(endDate.getDate() + 1);
  }
  while (getDay(date, type) > 0) {
    date.setDate(date.getDate() - 1);
  }

  let dateArr = [];
  const finalDateArrLength =
    (endDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) + 1;

  for (let i = 0; date.getTime() <= endDate.getTime(); i++) {
    let current: IDate = {
      day: date.getDate(),
      monthState:
        month > date.getMonth() ? -1 : month === date.getMonth() ? 0 : 1,
      date: new Date(date),
      col: (i % 7) as IDate["col"],
      row: Math.floor((i / 7) % finalDateArrLength) as IDate["row"],
    };

    if (
      finalDateArrLength / 7 ===
      Math.floor((i / 7) % finalDateArrLength) + 1
    ) {
      current.lastRow = true;
    }
    if (isToday(date)) {
      current = { ...current, isToday: true };
    }

    dateArr.push(current);
    date.setDate(date.getDate() + 1);
  }

  return dateArr;
}

export function formatToString(
  date: Date,
  format: "dd-mm-yyyy" | "mm-dd-yyyy" | "yyyy-mm-dd" = "dd-mm-yyyy",
  separator: string = "/"
) {
  if (!date) return "";
  let d: string | number = date.getDate();
  let m: string | number = date.getMonth() + 1;
  let y: string | number = date.getFullYear();
  d = d < 10 ? `0${d}` : d;
  m = m < 10 ? `0${m}` : m;
  return {
    "dd-mm-yyyy": [d, m, y],
    "mm-dd-yyyy": [m, d, y],
    "yyyy-mm-dd": [y, m, d],
  }[format].join(separator);
}

export function constructByFormat(
  { d, m, y }: IDateFormat,
  format: DateFormats = "dd-mm-yyyy",
  separator: string = "[- /.]"
) {
  return {
    "dd-mm-yyyy": [d, m, y],
    "mm-dd-yyyy": [m, d, y],
    "yyyy-mm-dd": [y, m, d],
  }[format]
    .map((e) => fmtDoubleNum(e))
    .join(separator);
}

export function fmtObjToString(
  obj: IDateFormat,
  format: "dd-mm-yyyy" | "mm-dd-yyyy" | "yyyy-mm-dd" = "dd-mm-yyyy",
  separator: string = "/"
) {
  let d: string | number | null = obj.d;
  let m: string | number | null = obj.m;
  let y: string | number | null = obj.y;

  d = d === null ? "dd" : fmtDoubleNum(d);
  m = m === null ? "mm" : fmtDoubleNum(m + 1);
  y = y === null ? "yyyy" : typeof y !== "number" ? y : y;

  return {
    "dd-mm-yyyy": [d, m, y],
    "mm-dd-yyyy": [m, d, y],
    "yyyy-mm-dd": [y, m, d],
  }[format].join(separator);
}

export function setDatePeriod(d: Date, value: string | number, state: DateKey) {
  const date = new Date(d);

  switch (state) {
    case "d":
      date.setDate(parseInt(value as string));
      break;
    case "m":
      date.setMonth(parseInt(value as string));
      break;
    case "y":
      date.setFullYear(parseInt(value as string));
      break;
  }
  return date;
}

export function formatToDate(
  str: string,
  format: DateFormats = "dd-mm-yyyy",
  separator: string = "[- /.]"
) {
  if (!str) return null;
  const frmts = formats(new RegExp(separator))[format].get(str);
  return new Date(`${frmts.m}-${frmts.d}-${frmts.y}`);
}

export function areEqualDates(d1: Date, d2: Date) {
  if (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  ) {
    return true;
  }
  return false;
}

export function genYears() {
  const years = [];
  for (let i = 1900; i < 2100; i++) {
    years.push(i);
  }
  return years;
}

export function testDateString(
  value: string,
  format: DateFormats = "dd-mm-yyyy",
  separator: string = "[- /.]"
) {
  const sep = new RegExp(separator);
  if (concatRegexp(...formats(sep)[format].regexp).test(value)) {
    const date = new Date(formatToDate(value, format, separator)!);
    return date.getDate() === parseInt(formats(sep)[format].get(value).d);
  }
  return false;
}

export const weekdays = (
  type: "long" | "short" | "narrow" = "narrow",
  local: Props["local"] = "normal"
) => {
  const d = new Date();
  const arr = [];
  while (d.getDay() !== 0) {
    d.setDate(d.getDate() - 1);
  }
  while (d.getDay() < 7) {
    arr.push(d.toLocaleDateString("us", { weekday: type }));
    if (d.getDay() === 6) break;
    d.setDate(d.getDate() + 1);
  }
  if (local === "normal") {
    const el = arr.shift();
    arr.push(el!);
  }

  return arr;
};
