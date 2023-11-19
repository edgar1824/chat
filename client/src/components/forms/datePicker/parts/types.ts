import {
  Dispatch,
  InputHTMLAttributes,
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";

export type DateFormats = "dd-mm-yyyy" | "mm-dd-yyyy" | "yyyy-mm-dd";
export type DateKey = "d" | "m" | "y";

export interface IDateFormat {
  d: number;
  m: number;
  y: number;
}

export interface Props {
  classNames?: {
    parent?: string;
    dates?: string;
    head?: string;
    calendar?: string;
    input?: string;
    day?: (d?: IDate) => string | string;
    today?: string;
    active?: string;
    icon?: string;
  };
  local?: "us" | "normal";
  value?: Date;
  onChange?: (values: { date: Date | string } & IDateFormat) => void;
  onValidChange?: (values: { date: Date } & IDateFormat) => void;
  hideOtherMonthDays?: boolean;
  onValidation?: ({ isValid }: { isValid: boolean }) => void;
  format?: DateFormats;
  separator?: string;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "local"
  >;
}

export interface IContext extends Omit<Props, "value"> {
  calendarDate: Date;
  setCalendarDate: Dispatch<SetStateAction<Date>>;
  isReverse: boolean;
  showYears: boolean;
  setShowYears: Dispatch<SetStateAction<boolean>>;
  maxHeight: number | string;
  setMaxHeight: Dispatch<SetStateAction<number>>;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  invalid: boolean;
  setInvalid: Dispatch<SetStateAction<boolean>>;
  yearElem: HTMLDivElement | null;
  setYearElem: Dispatch<SetStateAction<HTMLDivElement | null>>;
  currentDate: IDateFormat;
  setCurrentDate: Dispatch<SetStateAction<IDateFormat>>;
  focus: boolean;
  setFocus: Dispatch<SetStateAction<boolean>>;
  value: Date;
  setValue: Dispatch<SetStateAction<Date>>;
  setState: Dispatch<SetStateAction<DateKey>>;

  inputRef: RefObject<HTMLInputElement>;
  calendarRef: MutableRefObject<HTMLDivElement | null>;
  dates: IDate[];

  prevMonth: () => void;
  nextMonth: () => void;
  scrollYears: () => void;
  keydownHanlder: (e: KeyboardEvent<HTMLInputElement>) => void;
  yearClickHandler: (y: number) => void;
}

export interface IDate {
  day: number;
  monthState: -1 | 0 | 1;
  date: Date;
  isToday?: boolean;
  col?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  row?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  lastRow?: boolean;
}

export interface ProviderProps extends Omit<Props, "inputProps"> {
  children: (values: IContext) => ReactNode | ReactNode;
}
