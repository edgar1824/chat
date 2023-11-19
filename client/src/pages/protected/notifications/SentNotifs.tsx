import { CenterText } from "components/reusable";
import { routeActionHandler, timeDifference } from "helpers";
import { Link, useLoaderData } from "react-router-dom";
import { NotificationService } from "request/services";
import { INotif, IUser } from "types";

const Component = () => {
  const data = useLoaderData() as INotif<string, IUser[]>[];
  return (
    <div className="px-8 py-6 flex flex-col gap-4 relative h-full overflow-y-auto md:px-3 md:py-2">
      {!!data?.length ? (
        data.map((notif) => <SentNotification key={notif?._id} {...notif} />)
      ) : (
        <CenterText>No sent notifications</CenterText>
      )}
    </div>
  );
};

const SentNotification = ({
  createdAt,
  recievers,
  text,
  title,
  type,
}: INotif<string, IUser[]>) => {
  return (
    <div className="border border-black/50 px-5 py-4 rounded shadow-cst bg-slate-50 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">
          title:{" "}
          <span className="text-[16px] underline text-black">{title}</span>
        </p>
        <p className="text-sm text-gray-500">
          text: <span className="text-[16px] underline text-black">{text}</span>
        </p>
        <p className="text-sm text-gray-500">
          type: <span className="text-[16px] underline text-black">{type}</span>
        </p>
        <p className="text-sm text-gray-500">
          createdAt:{" "}
          <span className="text-[16px] underline text-black">
            {timeDifference(createdAt!)}
          </span>
        </p>
      </div>
      <div className="flex gap-5">
        <span>To: </span>
        <div className="flex flex-col gap-3">
          {recievers?.map((reciever) => (
            <Reciever key={reciever._id} {...reciever} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Reciever = ({ _id, img, username }: IUser) => {
  return (
    <Link
      to={`/users/${_id}`}
      className="px-2 py-1 flex items-center gap-2 shadow-md rounded-xl"
    >
      <img className="w-[30px] h-[30px] rounded-full" src={img} alt="" />
      <span>{username}</span>
    </Link>
  );
};

const loader = routeActionHandler(async () => {
  const data = await NotificationService.getSentNotifs();
  return data;
});

export const SentNotifs = Object.assign(Component, { loader });
