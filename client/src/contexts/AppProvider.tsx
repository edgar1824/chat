import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { IResponse } from "types/requests";

interface Props extends PropsWithChildren {}
interface IContext {
  error: IResponse;
  setError: React.Dispatch<React.SetStateAction<IResponse>>;
  allowedLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<IContext>(null!);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: FC<Props> = ({ children }) => {
  const [error, setError] = useState<IContext["error"]>(null!);
  const [allowedLoading, setIsLoading] = useState(true);

  return (
    <AppContext.Provider
      value={{ error, setError, allowedLoading, setIsLoading }}
    >
      {children}
    </AppContext.Provider>
  );
};
