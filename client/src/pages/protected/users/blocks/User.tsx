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
    <div className="flex justify-between gap-5 px-5 py-3 rounded shadow-cst">
      <Link
        to={`/users/${_id}`}
        className="flex-[1] flex gap-10 items-center lg:gap-5 lg:items-start"
      >
        <img
          src={
            img ||
            "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
          }
          alt=""
          className="rounded w-[150px] h-[150px] lg:w-[100px] lg:h-[100px] md:!w-[50px] md:!h-[50px]"
        />
        <div className="flex flex-col gap-3 flex-[1]">
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
