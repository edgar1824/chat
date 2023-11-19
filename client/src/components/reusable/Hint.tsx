import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "contexts";
import { useContext, useEffect, useMemo, useState } from "react";
import { UNSAFE_DataRouterStateContext, useActionData } from "react-router-dom";

export const Hint = () => {
  const actData = useActionData();
  const [opacity, setOpacity] = useState(false);
  const [hidden, setHidden] = useState(false);
  const routesContext = useContext(UNSAFE_DataRouterStateContext);
  const { error } = useAppContext();

  const actionData = useMemo(
    () =>
      error
        ? error
        : routesContext!.actionData
        ? Object.values(routesContext!.actionData)[
            Object.values(routesContext!.actionData)?.length - 1
          ]
        : actData,
    [actData, routesContext!.actionData, error]
  );

  const response = useMemo(() => {
    if (actionData instanceof Error || actionData?.response?.status >= 300) {
      if (actionData?.response?.data?.message) {
        return { ...actionData?.response?.data, success: false };
      } else if (actionData?.message) {
        return { ...actionData, success: false };
      } else if (actionData?.response?.statusText) {
        return {
          ...actionData?.response,
          message: actionData?.response?.statusText,
          success: false,
        };
      }
      return { ...actionData, success: false };
    } else if (actionData?.statusText === "OK") {
      return {
        ...actionData,
        message: actionData?.data?.message || actionData?.message || "Success",
        success: true,
      };
    }
  }, [actionData]);

  const hide = () => {
    setOpacity(true);
  };
  useEffect(() => {
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;
    if (response) {
      setHidden(false);
      timeout1 = setTimeout(() => {
        setOpacity(false);
        timeout2 = setTimeout(() => setOpacity(true), 2500);
      }, 300);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [response]);

  useEffect(() => {
    if (!!opacity) {
      const tm = setTimeout(() => {
        setHidden(true);
      }, 300);

      return () => clearTimeout(tm);
    }
  }, [opacity]);

  if (hidden || !response) {
    return null;
  }

  return (
    <div
      style={{
        background: response?.success ? "green" : "red",
        opacity: opacity ? "0" : "1",
      }}
      className="duration-300 transition-all fixed top-[75px] text-white flex items-center gap-3 px-4 py-2 right-[25px] rounded shadow-cst z-[999] md:top-[55px] md:w-auto md:right-[10px]"
    >
      <span className="whitespace-nowrap overflow-hidden max-w-[500px] text-ellipsis">
        {response?.message}
      </span>
      <FontAwesomeIcon
        className="cursor-pointer"
        onClick={hide}
        size="lg"
        icon={faTimes}
      />
    </div>
  );
};
