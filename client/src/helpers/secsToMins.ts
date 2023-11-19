export const secsToMins = (secs: number) => {
  const d = new Date();
  d.setHours(0, 0, secs);

  return `${
    (d.getMinutes() + "")?.length < 2 ? `0${d.getMinutes()}` : d.getMinutes()
  }:${
    (d.getSeconds() + "")?.length < 2 ? `0${d.getSeconds()}` : d.getSeconds()
  }`;
};
