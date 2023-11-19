import { OutsideDetector } from "components/reusable";
import { FC } from "react";
import { Icon } from "./parts/Icon";
import { Input } from "./parts/Input";
import { Picker } from "./parts/Picker";
import { Provider } from "./parts/Provider";
import { Props } from "./parts/types";
import { classes } from "./parts/utils";

export const TimePicker: FC<Props> = ({
  classNames,
  format = "hh:mm",
  ...props
}) => {
  return (
    <Provider {...{ ...props, classNames, format }}>
      {({ contentRef, setShow }) => (
        <OutsideDetector
          className={classes(classNames?.parent, "w-fit h-fit relative")}
          onRef={(r) => (contentRef.current = r.current)}
          onOutside={() => {
            setShow(false);
          }}
        >
          <Input />
          <Icon />
          <Picker />
        </OutsideDetector>
      )}
    </Provider>
  );
};

export type { ITimeFormat } from "./parts/types";
