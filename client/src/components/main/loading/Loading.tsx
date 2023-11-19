import { FC } from "react";
import styles from "./loading.module.css";

export const Loading: FC = () => {
  return (
    <div className={styles["loader-container"]}>
      <div className={styles["spinner"]}></div>
    </div>
  );
};
