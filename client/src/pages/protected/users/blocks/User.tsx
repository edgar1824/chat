import { Link } from "react-router-dom";
import { MessageUser } from "components/main/MessageUser";
import { AddFrined } from "./AddFrined";
import { IUser } from "types";
import { FC } from "react";

interface Props extends IUser {}

export const User: FC<Props> = ({
  city,
  country,
  img,
  username,
  _id,
  friends,
}) => {
  return (
    <div className="flex justify-between gap-5 px-5 py-3 rounded shadow-cst md:px-2 md:py-1.5 md:gap-3">
      <Link
        to={`/users/${_id}`}
        className="flex gap-5 w-full lg:gap-5 lg:items-start"
      >
        <img
          src={
            img ||
            "https://austinpeopleworks.com/wp-content/uploads/2020/12/blank-profile-picture-973460_1280.png"
          }
          alt=""
          className="rounded object-fill w-[100px] h-[100px] lg:w-[100px] lg:h-[100px] md:!w-[70px] md:!h-[70px]"
        />
        <div className="flex flex-col gap-3 flex-[1] md:gap-1 md:pt-1">
          <p className="text-[20px] font-bold md:text-base">{username}</p>
          <span className="text-base md:text-sm">{country}</span>
          <span className="text-base md:text-sm">{city}</span>
        </div>
      </Link>

      <div className="p-3 flex flex-col gap-2 items-center">
        <AddFrined {...{ id: _id!, username }} />
        <MessageUser {...{ id: _id!, username: username! }} />
      </div>
    </div>
  );
};
