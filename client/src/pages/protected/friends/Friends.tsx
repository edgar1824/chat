import { CenterText, Pagination } from "components/reusable";
import { useAppContext, useAuthContext } from "contexts";
import { formFn, routeActionHandler } from "helpers";
import { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { ConversationService, UserService } from "request/services";
import { IPagination, IUser } from "types";
import { IResponse } from "types/requests";
import { Friend } from "./Friend";

const limit = 1;

const Component = () => {
  const data = useLoaderData() as IPagination<IUser>;
  const { setError } = useAppContext();
  const { me } = useAuthContext();
  const [friends, setFriends] = useState(data?.items || []);
  const { page } = useParams();

  console.log(friends);

  useEffect(() => {
    let controller = new AbortController();

    const getPaginatedFriends = async () => {
      try {
        const res = await UserService.getFriends(
          { page: +page!, limit },
          { signal: controller.signal }
        );

        setFriends(res?.items);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err as IResponse);
          console.error(err);
        }
      }
    };

    getPaginatedFriends();

    return () => {
      controller.abort();
    };
  }, [me?.friends]);

  return (
    <div className="flex flex-col gap-10 py-5 justify-between min-h-[calc(100vh_-_50px)] md:py-0">
      <div className="mx-auto px-[32px] py-5 max-w-[1024px] grid w-full gap-7 relative md:gap-3 md:px-4 grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] md:grid-cols-1">
        {!!friends?.length ? (
          friends.map((fr) => <Friend key={fr._id} {...fr} />)
        ) : (
          <CenterText>No Friends</CenterText>
        )}
      </div>
      <Pagination
        mainPath={"/friends"}
        paginationCount={data?.count!}
        maxItems={2}
      />
    </div>
  );
};

const loader = routeActionHandler(async ({ request }) => {
  const s = Object.fromEntries(new URL(request.url).searchParams);
  const friends = await UserService.getFriends({ page: +s?.page, limit });
  return friends;
});

const action = routeActionHandler(async ({ request }) => {
  const data = formFn.toObject(await request.formData());
  switch (data.role) {
    case "go-chat":
      return await ConversationService.createDialogue({
        ...data,
      });
    case "delete-friend":
      return await UserService.deleteFriend({ friendId: data?.friendId });
    default:
      return null;
  }
});

export const Friends = Object.assign(Component, { loader, action });
