import { faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MessageUser } from "components/main/MessageUser";
import { formFn } from "helpers";
import { FC } from "react";
import { Link, useFormAction, useSubmit } from "react-router-dom";
import { IUser } from "types";

export const Friend: FC<IUser> = ({ city, country, img, username, _id }) => {
  return (
    <div className="flex justify-between gap-5 px-5 py-3 rounded shadow-cst">
      <Link
        to={`/users/${_id}`}
        className="flex-[1] flex gap-10 items-center lg:gap-5 lg:items-start"
      >
        <img
          src={
            img ||
            "https://austinpeopleworks.com/wp-content/uploads/2020/12/blank-profile-picture-973460_1280.png"
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
        <MessageUser {...{ id: _id!, username: username! }} />
        <DeleteFriend {...{ id: _id! }} />
      </div>
    </div>
  );
};

const DeleteFriend = ({ id }: { id: string }) => {
  const submit = useSubmit();
  const action = useFormAction();

  const clickHandler = () => {
    submit(formFn.toFormData({ friendId: id, role: "delete-friend" }), {
      action,
      encType: "multipart/form-data",
      method: "put",
    });
  };
  return (
    <FontAwesomeIcon
      onClick={clickHandler}
      icon={faUserMinus}
      title="Delete friend"
      className="cursor-pointer"
    />
  );
};
