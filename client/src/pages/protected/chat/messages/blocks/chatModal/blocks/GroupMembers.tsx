import {
  faEllipsisVertical,
  faTimes,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CenterText, OutsideDetector } from "components/reusable";
import { useAuthContext, useChatContext, useMessagesContext } from "contexts";
import { formFn } from "helpers";
import { useClickOutside } from "hooks";
import { useEffect, useRef, useState } from "react";
import {
  Link,
  useFormAction,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import { IMessagesLoaderData } from "../../../Messages";
import { iSocketUser, IUser } from "types";
import { PROFILE_IMG } from "constants/profile";

export const GroupMembers = () => {
  const { me } = useAuthContext();
  const { groupMembers } = useMessagesContext();

  return (
    <div className="flex flex-col gap-2 relative max-h-[300px] overflow-auto px-5 py-5">
      {!!groupMembers?.length ? (
        groupMembers
          .filter((e) => e._id !== me?._id)
          .map((member) => <User {...member} key={member._id} />)
      ) : (
        <CenterText>No members</CenterText>
      )}
    </div>
  );
};
const User = ({
  username,
  _id,
  isOnline,
  img,
}: { isOnline?: boolean } & IUser) => {
  const { currentConv } = useLoaderData() as IMessagesLoaderData;
  const { me } = useAuthContext();

  return (
    <div key={_id} className="flex items-center gap-3">
      <div className="flex items-center justify-between gap-3 w-full cursor-pointer px-5 py-3 rounded shadow-cst bg-white">
        <div className="flex items-center gap-3">
          <Link to={`/users/${_id}`} className="flex items-center gap-3 ">
            <img
              src={img || PROFILE_IMG}
              alt=""
              className="w-[30px] h-[30px] rounded-full"
            />
            <span>{username}</span>
          </Link>
          {currentConv?.admins?.includes(_id!) && (
            <span className="text-[12px] shadow-lg font-bold px-2 py-1 rounded text-teal-600 bg-[#e3db4d]">
              Admin
            </span>
          )}
        </div>
        {isOnline && (
          <i className="rounded-full w-[15px] h-[15px] bg-green-600"></i>
        )}
      </div>
      {me?.isAdmin ||
        (currentConv?.admins?.includes(me?._id!) && (
          <DropDown {...{ _id: _id! }} />
        ))}
    </div>
  );
};

const DropDown = ({ _id }: { _id: string }) => {
  const { currentConv } = useLoaderData() as IMessagesLoaderData;
  const { groupMembers } = useMessagesContext();
  const { me } = useAuthContext();
  const submit = useSubmit();
  const action = useFormAction();
  const [show, setShow] = useState(false);

  const clickHandler = (data: {
    id?: string;
    user?: iSocketUser;
    role?: string;
    members?: (string | undefined)[] | undefined;
    me?: IUser<string[]> | undefined;
    userId?: string;
  }) => {
    submit(formFn.toFormData(data), {
      action,
      method: "put",
      encType: "multipart/form-data",
    });
  };

  return (
    <OutsideDetector onOutside={() => setShow(false)} className="relative">
      <FontAwesomeIcon
        icon={faEllipsisVertical}
        className="cursor-pointer px-1.5 py-1 rounded bg-white shadow-cst "
        onClick={() => setShow((p) => !p)}
      />
      <div
        style={{ scale: show ? "1" : "0" }}
        className="absolute top-[27px] right-0 z-[10] duration-150 origin-[calc(100%_-_5px)_0]"
      >
        <div className="px-2 py-1.5 rounded shadow-cst flex flex-col gap-2 items-center bg-white">
          <FontAwesomeIcon
            icon={faTimes}
            className="cursor-pointer px-1.5 py-1 rounded bg-white shadow-cst"
            onClick={() => {
              clickHandler({
                id: _id,
                user: groupMembers?.find((u) => u?._id === _id)!,
                role: "delete-user",
                members: groupMembers?.map((e) => e?._id),
                me,
              });
            }}
            title="remove from group"
          />
          {currentConv?.admins?.includes(_id) ? (
            <FontAwesomeIcon
              icon={faUserMinus}
              className="cursor-pointer px-1.5 py-1 rounded bg-white shadow-cst"
              onClick={() =>
                clickHandler({ userId: _id, role: "unmake-admin" })
              }
              title="unmake admin"
            />
          ) : (
            <FontAwesomeIcon
              icon={faUserPlus}
              className="cursor-pointer px-1.5 py-1 rounded bg-white shadow-cst"
              onClick={() => clickHandler({ userId: _id, role: "make-admin" })}
              title="make admin"
            />
          )}
        </div>
      </div>
    </OutsideDetector>
  );
};
