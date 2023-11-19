import { Hint } from "components/reusable";
import { Outlet, useNavigation } from "react-router-dom";
import { Loading } from "../main";
import { useAppContext } from "contexts";

export const Root = () => {
  const { state } = useNavigation();
  const { allowedLoading } = useAppContext();

  return (
    <>
      <Outlet />
      {allowedLoading && state !== "idle" && <Loading />}
      <Hint />
    </>
  );
};
