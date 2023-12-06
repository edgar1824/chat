import { Shine } from "components/reusable";

export const LoadingUser = () => {
  return (
    <div className="flex justify-between gap-5 px-5 py-3 rounded shadow-cst md:px-2 md:py-1.5 md:gap-3">
      <div className="flex gap-5 w-full lg:gap-5 lg:items-start">
        <Shine className="rounded w-[100px] h-[100px] lg:w-[100px] lg:h-[100px] md:!w-[70px] md:!h-[70px]">
          <img
            src="https://austinpeopleworks.com/wp-content/uploads/2020/12/blank-profile-picture-973460_1280.png"
            alt=""
            className="w-full h-full object-fill"
          />
        </Shine>
        <div className="flex flex-col gap-3 w-full md:h-full md:gap-1.5 md:pt-1">
          <Shine className="!w-[35%] min-w-[80px] h-[20px] lg:!h-[1rem]"></Shine>
          <Shine className="w-full h-[24px] lg:h-[1rem]"></Shine>
          <Shine className="w-full h-[24px] lg:h-[1rem]"></Shine>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2 items-center md:!py-1">
        <Shine className="!w-6 !h-6 md:!h-4 md:!w-5"></Shine>
        <Shine className="!w-6 !h-6 md:!h-4 md:!w-5"></Shine>
      </div>
    </div>
  );
};
