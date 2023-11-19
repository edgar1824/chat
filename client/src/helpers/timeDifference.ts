const minute = 60 * 1000;
const hour = minute * 60;
const day = hour * 24;

export function timeDifference(timestamp: string | number | Date) {
  const time = new Date(timestamp).getTime();
  const current = Date.now();
  const elapsed = current - time;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (elapsed < minute) {
    return rtf.format(-Math.floor(elapsed / 1000), "seconds");
  } else if (elapsed < hour) {
    return rtf.format(-Math.floor(elapsed / minute), "minutes");
  } else if (elapsed < day) {
    return rtf.format(-Math.floor(elapsed / hour), "hours");
  } else {
    return new Date(time).toLocaleDateString("en");
  }
}
