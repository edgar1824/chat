import { Shine } from "components/reusable";

export const LoadingUser = () => {
  return (
    <div className="flex justify-between gap-5 px-5 py-3 rounded shadow-cst">
      <div className="flex gap-10 items-center w-full lg:gap-5">
        <Shine className="!w-[150px] !h-[150px] rounded lg:!w-[100px] lg:!h-[100px]">
          <img
            src="https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </Shine>
        <div className="flex flex-col gap-3 w-full">
          <Shine className="!w-[35%] min-w-[80px] h-[30px] lg:h-[20px]"></Shine>
          <Shine className="!w-[85%] h-[24px] lg:h-[18px]"></Shine>
          <Shine className="!w-[85%] h-[48px] lg:h-[32px]"></Shine>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2 items-center">
        <Shine className="w-6 h-6"></Shine>
        <Shine className="w-6 h-6"></Shine>
      </div>
    </div>
  );
};
