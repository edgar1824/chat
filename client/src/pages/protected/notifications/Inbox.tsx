import { CenterText } from "components/reusable";
import { useAuthContext } from "contexts";
import { formFn, routeActionHandler } from "helpers";
import { NotificationService } from "request/services";
import { Notification } from "./Notification";

const Component = () => {
  const { notifs } = useAuthContext();
  return (
    <div className="px-8 py-6 flex flex-col gap-4 h-full w-full overflow-y-auto md:px-3 md:py-2">
      {!!notifs?.length ? (
        notifs?.map((notif) => <Notification key={notif._id} {...notif} />)
      ) : (
        <CenterText>No notifications</CenterText>
      )}
    </div>
  );
};

const action = routeActionHandler(async ({ request }) => {
  const fd = await request.formData();
  const data = formFn.toObject(fd);

  switch (data?.role) {
    case "delete-notif":
      return await NotificationService.delete(data.id);
    default:
      return null;
  }
});

export const Inbox = Object.assign(Component, { action });
