import { faTimes, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formFn, timeDifference } from "helpers";
import React, { FC } from "react";
import { Link, useFormAction, useSubmit } from "react-router-dom";
import { DBDocument } from "types/requests";

interface Props extends DBDocument {
  text?: string;
  title?: string;
}

export const Notification: FC<Props> = ({ _id, createdAt, text, title }) => {
  const submit = useSubmit();
  const action = useFormAction();

  const deleteNotif = () => {
    submit(formFn.toFormData({ id: _id, role: "delete-notif" }), {
      action,
      encType: "multipart/form-data",
      method: "DELETE",
    });
  };
  return (
    <div className="relative px-4 py-2.5 rounded shadow-cst bg-white flex justify-between gap-1 md:px-2 md:py-2 md:flex-col md:gap-2">
      <Link
        to={`/notifications/${_id}`}
        className="flex gap-4 md:gap-2 md:flex-[1]"
      >
        <FontAwesomeIcon
          className="w-[100px] h-[100px] rounded-full md:w-[40px] md:h-[40px]"
          icon={faUserFriends}
        />
        <div className="flex flex-col gap-2 md:gap-0">
          <span className="text-black text-[32px] font-semibold md:text-lg">
            {title}
          </span>
          <p className="text-slate-500 text-[26px] md:text-base md:leading-[1.2rem]">
            {text}
          </p>
        </div>
      </Link>
      <div className="h-full flex flex-col justify-between items-end">
        <FontAwesomeIcon
          onClick={deleteNotif}
          size="lg"
          cursor="pointer"
          icon={faTimes}
          className="md:absolute md:top-2 md:right-2"
        />
        <span className="md:text-xs">{timeDifference(createdAt!)}</span>
      </div>
    </div>
  );
};
