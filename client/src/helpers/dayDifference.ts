import { MILLISECONDS_PER_DAY } from "constants/math";

export function dayDifference(
  date1: string | number | Date,
  date2: string | number | Date
) {
  const myDate1 = date1 instanceof Date ? date1 : new Date(date1);
  const myDate2 = date2 instanceof Date ? date2 : new Date(date2);

  const timeDiff = Math.abs(myDate1.getTime() - myDate2.getTime());
  const dayDiff = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);

  return dayDiff;
}
