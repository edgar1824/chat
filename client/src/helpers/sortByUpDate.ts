import { DBDocument } from "types/requests";

type FnArgs<T> = DBDocument & T;

export const sortByUpDate = <T>(arr: FnArgs<T>[]) =>
  arr.sort(
    (a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
  );
