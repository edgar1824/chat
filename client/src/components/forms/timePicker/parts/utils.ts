import { IFormats, ITimeFormat, Props } from "./types";

export const TimeRegExp = {
  hh: /(0[1-9]|1[012])/,
  mm: /(0[1-9]|[0-5][0-9]|00)/,
  ss: /(0[1-9]|[0-5][0-9]|00)/,
};

const formats = {
  "hh:mm": {
    regexp: [TimeRegExp.hh, /:/, TimeRegExp.mm],
    get: (str: string) => {
      const [hh, mm] = str.split(":");
      return { hh, mm };
    },
  },
  "mm:ss": {
    regexp: [TimeRegExp.mm, /:/, TimeRegExp.ss],
    get: (str: string) => {
      const [mm, ss] = str.split(":");
      return { mm, ss };
    },
  },
  "hh:mm:ss": {
    regexp: [TimeRegExp.hh, /:/, TimeRegExp.mm, /:/, TimeRegExp.ss],
    get: (str: string) => {
      const [hh, mm, ss] = str.split(":");
      return { hh, mm, ss };
    },
  },
};
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

export const steps: Omit<ITimeFormat, "format"> = {
  hours: 360 / 12,
  minutes: 360 / 60,
  seconds: 360 / 60,
};
export function fmtDoubleNum(n: number) {
  return n < 10 ? `0${n}` : n + "" || "00";
}

export function classes<T>(...arr: T[]) {
  return arr
    .filter(Boolean)
    .filter((s) => s !== " " && s !== "0")
    .join(" ");
}

export const clockSteps_default = {
  hours: Array.from({ length: 12 }).map((_, i) => ({
    num: i + 1,
    deg: (steps.hours as number) * (i + 1),
    show: true,
  })),
  minutes: Array.from({ length: 60 }).map((_, i) => ({
    num: i + 1 === 60 ? 0 : i + 1,
    deg: (steps.minutes as number) * (i + 1),
    show: (i + 1) % 5 === 0,
  })),
  seconds: Array.from({ length: 60 }).map((_, i) => ({
    num: i + 1 === 60 ? 0 : i + 1,
    deg: (steps.minutes as number) * (i + 1),
    show: (i + 1) % 5 === 0,
  })),
} as const;

export function testTime(str?: string, format: Props["format"] = "hh:mm") {
  if (!str) return false;
  return concatRegexp(/^/, ...formats[format].regexp, /$/).test(str);
}

// export function getFormats(format: IFormats) {
//   if (!format) return false;
//   const fmts = {
//     "hh:mm": {}
//   };
// }
