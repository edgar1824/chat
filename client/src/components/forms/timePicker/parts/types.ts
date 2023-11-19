import {
  CSSProperties,
  Dispatch,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";

export type IFormats = "hh:mm" | "mm:ss" | "hh:mm:ss";

export interface Props {
  classNames?: {
    parent?: string;
    clock?: string;
    head?: string;
    input?: string;
    icon?: string;
    timeNumber?: ((num: ITime) => string) | string;
    placeholder?: string;
  };
  clock?: {
    width?: number;
    height?: number;
    pointerLine?: number;
    round?: number;
  };
  format?: "hh:mm" | "mm:ss" | "hh:mm:ss";
  value?: ITimeFormat;
  hidePeriods?: boolean;
  onChange?: (value: ITimeFormat & { time: string }) => void;
  onValidChange?: (value: ITimeFormat & { time: string }) => void;
  onValidation?: ({ isValid }: { isValid: boolean }) => void;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "local"
  >;
}

export interface ITime {
  num: number;
  deg: number;
  show: boolean;
}

export interface ITimeFormat {
  hours: number;
  minutes: number;
  seconds: number;
  format: "am" | "pm";
}
interface ICurrent {
  step: number;
  state: keyof ITimeFormat;
  numbers: ITime[];
  rotate: string | number;
}

export interface IContext extends Props {
  time: ITimeFormat;
  setTime: Dispatch<SetStateAction<IContext["time"]>>;
  mouse: { down: boolean; _down: boolean };
  setMouse: Dispatch<SetStateAction<IContext["mouse"]>>;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  invalid: boolean;
  setInvalid: Dispatch<SetStateAction<boolean>>;
  isReverse: boolean;
  current: ICurrent;
  setCurrent: Dispatch<SetStateAction<ICurrent>>;
  focus: boolean;
  setFocus: Dispatch<SetStateAction<boolean>>;

  inputRef: RefObject<HTMLInputElement>;
  contentRef: MutableRefObject<HTMLDivElement | null>;
  pointerLineRef: RefObject<HTMLInputElement>;
  timeString: string;
  mouseMoveHandler: (event: MouseEvent<HTMLDivElement>) => void;
  keyDownHandler: (e: KeyboardEvent<HTMLInputElement>) => void;
  changeTimeState: (f: keyof ITimeFormat) => void;
  reset: (resetTimeFormat: boolean) => void;
}

export interface IProvider extends Props {
  children: ((context: IContext) => ReactNode) | ReactNode;
}
