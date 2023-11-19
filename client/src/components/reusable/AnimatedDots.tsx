export const AnimatedDots = ({ size = "base" }: { size?: "sm" | "base" }) => {
  if (size === "sm") {
    return (
      <div className="shrink-0 w-fit h-fit px-[3px] py-[4px] rounded-[20px] bg-gray-200 grid grid-cols-3 justify-items-center items-center gap-[1.5px]">
        <div className="bg-gray-400 block rounded-full shrink-0 w-[5px] h-[5px] animate-loading-1-light" />
        <div className="bg-gray-400 block rounded-full shrink-0 w-[5px] h-[5px] animate-loading-2-light" />
        <div className="bg-gray-400 block rounded-full shrink-0 w-[5px] h-[5px] animate-loading-3-light" />
      </div>
    );
  }
  return (
    <div className="shrink-0 w-fit h-fit px-1.5 py-2 rounded-[20px] bg-gray-200 grid grid-cols-3 items-center gap-0.5">
      <div className="bg-gray-400 rounded-full shrink-0 w-2 h-2 animate-loading-1" />
      <div className="bg-gray-400 rounded-full shrink-0 w-2 h-2 animate-loading-2" />
      <div className="bg-gray-400 rounded-full shrink-0 w-2 h-2 animate-loading-3" />
    </div>
  );
};
