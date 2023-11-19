import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CustomBtn } from "components/forms";
import { useAuthContext } from "contexts";
import { formFn, routeActionHandler, timeDifference } from "helpers";
import { ReactNode } from "react";
import {
  Link,
  redirect,
  useFormAction,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import { NotificationService, UserService } from "request/services";
import instance from "request/api";
import { INotif, IUser } from "types";

const Component = () => {
  const data = useLoaderData() as INotif<IUser>;
  const action = useFormAction();
  const { me } = useAuthContext();
  const submit = useSubmit();
  const handleClick = (role: string) => () => {
    submit(formFn.toFormData({ role, sender: data?.sender?._id, me }), {
      action,
      method: "PUT",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="px-10 py-8 flex gap-10 overflow-y-auto h-full relative lg:flex-col md:px-5 md:py-4">
      <FontAwesomeIcon
        className="w-[200px] h-[200px] rounded md:w-[100px] md:h-[100px]"
        icon={faUserFriends}
      />
      <div className="flex justify-between gap-2 w-full h-full">
        <div className="flex flex-col gap-5 md:gap-3">
          {data?.type === "be-friend" && (
            <p className="text-[34px] my-3">
              User{" "}
              <b>
                <u>{data?.sender?.username}</u>
              </b>{" "}
              wants to be frineds
            </p>
          )}
          <Box
            label="From:"
            text={
              <Link to={`/users/${data?.sender?._id}`}>
                {data?.sender?.username}
              </Link>
            }
          />
          <Box label="Email:" text={data?.sender?.email} />
          <div className="flex flex-col gap-2 my-5 border shadow-cst border-gray-600 px-4 py-3 rounded-[15px]">
            <span className="text-[32px] font-semibold md:text-2xl">
              {data?.title}
            </span>
            <p className="text-[28px] text-gray-600 md:text-xl">{data?.text}</p>
          </div>

          <div className="flex items-center gap-3">
            {data?.type === "be-friend" ? (
              <>
                <CustomBtn onClick={handleClick("accept-friend")}>
                  Accept
                </CustomBtn>
                <CustomBtn onClick={handleClick("delete-notif")}>
                  Deny
                </CustomBtn>
              </>
            ) : (
              <CustomBtn onClick={handleClick("delete-notif")}>OK</CustomBtn>
            )}
          </div>
        </div>
        <span className="absolute top-[20px] right-[20px]">
          {timeDifference(data?.createdAt!)}
        </span>
      </div>
    </div>
  );
};

const Box = ({ label, text }: { label: string; text: ReactNode }) => {
  return (
    <div className="flex gap-3 flex-wrap">
      <label className="text-gray-500 text-[24px] md:text-xl">{label}</label>
      <span className="text-black text-[24px] font-semibold break-all md:text-xl">
        {text}
      </span>
    </div>
  );
};

const loader = routeActionHandler(async ({ params }) => {
  const notif = await instance.get(`notifications/find/${params.id}`);
  return notif.data;
});

const action = routeActionHandler(async ({ request, params }) => {
  const fd = await request.formData();
  const data = formFn.toObject(fd);

  switch (data?.role) {
    case "accept-friend":
      return await UserService.addFriend({
        notifId: params.id!,
        friendId: data.sender,
      });
    case "delete-notif": {
      await NotificationService.delete(params.id!);
      return redirect("/notifications/inbox");
    }
    default:
      return null;
  }
});

export const SingleNotification = Object.assign(Component, { loader, action });
