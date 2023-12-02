import { routeActionHandler } from "helpers";
import { useLoaderData } from "react-router-dom";
import { PostService } from "request/services";
import { IPost, IUser } from "types";
import { Post } from "./Post";
import { CenterText } from "components/reusable";

interface ILoaderData {
  newPosts: IPost<IUser>[];
}

const Component = () => {
  const data = useLoaderData() as ILoaderData;

  return (
    <div className="flex-[1] grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] px-[32px] py-5 gap-5 md:px-3 md:pt-10 md:grid-cols-2 md:gap-2 sm:!grid-cols-1">
      {!!data?.newPosts?.length ? (
        data?.newPosts?.map((p) => <Post key={p._id} {...p} />)
      ) : (
        <CenterText>There is no posts</CenterText>
      )}
    </div>
  );
};

const loader = routeActionHandler<ILoaderData>(async () => {
  const newPosts = await PostService.getNewPosts();
  return { newPosts: newPosts.data };
});

export const NewPosts = Object.assign(Component, { loader });
