import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { formFn } from "./formFns";

export const routeActionHandler =
  <T, P extends Record<string, any> = Record<string, any>>(
    fn: (
      args: (LoaderFunctionArgs | ActionFunctionArgs) & {
        data: P;
      }
    ) => Promise<T> | T,
    useStream: boolean = false
  ) =>
  async (args: LoaderFunctionArgs | ActionFunctionArgs) => {
    try {
      if (useStream) {
        const fd = await args.request.formData();
        const data = formFn.toObject(fd) as P;
        return (await fn({ ...args, data })) || null;
      }
      return (await fn({ ...args, data: null! })) || null;
    } catch (err) {
      return err;
    }
  };
