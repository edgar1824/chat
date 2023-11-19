import { CenterText } from "components/reusable";
import { useAuthContext } from "contexts";
import { formFn, routeActionHandler } from "helpers";
import { useLoadOnScroll, useMedia } from "hooks";
import { LoadingUser, User } from "./blocks";
import { useEffect, useState } from "react";
import { ConversationService, NotificationService } from "request/services";

const paginationLimit = 3;

const Component = () => {
  const { me } = useAuthContext();
  const {
    data: users,
    lastElementRef,
    loading,
    hasMore,
  } = useLoadOnScroll({
    url: "users/not-private",
    query: {
      exclude: [me?._id],
      select: ["-password", "-isAdmin"],
      limit: paginationLimit,
    },
  });

  return (
    <div className="flex flex-col gap-10 py-5 justify-between min-h-[calc(100vh_-_50px)] md:py-0">
      <div className="mx-auto px-[32px] py-5 max-w-[1024px] grid w-full gap-7 relative md:gap-3 md:px-4 grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] md:grid-cols-1">
        {!!users?.length ? (
          users.map((el) => <User {...el} key={el?._id} />)
        ) : (
          <>{!users?.length && !loading && <CenterText>No Users</CenterText>}</>
        )}
        {((!users?.length && loading) || hasMore) && (
          <div ref={lastElementRef}>
            <LoadingUser />
          </div>
        )}
      </div>
    </div>
  );
};

const action = routeActionHandler(async ({ request }) => {
  const data = formFn.toObject(await request.formData());
  switch (data?.role) {
    case "go-chat":
      return await ConversationService.createDialogue(data);
    case "send-notification":
      return await NotificationService.create(data?.notif);
    default:
      return null;
  }
});

export const Users = Object.assign(Component, { action });
