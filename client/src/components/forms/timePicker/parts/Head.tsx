import { useTimePickerContext } from "./Provider";

export const Head = () => {
  const { time, setTime, timeString, hidePeriods } = useTimePickerContext();
  return (
    <div className="flex flex-col px-2 py-3">
      <span className="text-gray-500/80">Select Time</span>
      <div className="flex items-center gap-3">
        <div className="text-[3rem] leading-[3.5rem]">{timeString}</div>
        {!hidePeriods && (
          <div className="flex flex-col">
            <span
              className={
                "font-bold leading-5 cursor-pointer duration-300 " +
                (time.format !== "am" ? "opacity-30" : "")
              }
              onClick={() => setTime((p) => ({ ...p, format: "am" }))}
            >
              AM
            </span>
            <span
              className={
                "font-bold leading-5 cursor-pointer duration-300 " +
                (time.format !== "pm" ? "opacity-30" : "")
              }
              onClick={() => setTime((p) => ({ ...p, format: "pm" }))}
            >
              PM
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
