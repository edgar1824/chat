import { OutsideDetector } from "components/reusable";
import { FC } from "react";
import { Input } from "./parts/Input";
import { Icon } from "./parts/Icon";
import { Provider } from "./parts/Provider";
import { classes } from "./parts/utils";
import { Calendar } from "./parts/Calendar";
import { Props } from "./parts/types";

const Component: FC<Props> = ({
  classNames,
  separator,
  format = "dd-mm-yyyy",
  ...props
}) => {
  return (
    <Provider
      {...{
        classNames,
        format,
        separator,
        ...props,
      }}
    >
      {({ setShow, calendarRef }) => (
        <OutsideDetector
          className={classes(classNames?.parent, "w-fit h-fit relative")}
          onRef={(r) => (calendarRef.current = r.current)}
          onOutside={() => {
            setShow(false);
          }}
        >
          <Input />
          <Icon />
          <Calendar />
        </OutsideDetector>
      )}
    </Provider>
  );
};

export type { IDate } from "./parts/types";

export const DatePicker = Object.assign(Component, {});
