import { routeActionHandler } from "helpers";
import { useLoaderData } from "react-router-dom";
import { PostService } from "request/services";
import { IPost, IUser } from "types";
import { Post } from "./Post";

interface ILoaderData {
  newPosts: IPost<IUser>[];
}

const Component = () => {
  const data = useLoaderData() as ILoaderData;

  return (
    <div className="flex-[1] grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] px-[32px] py-5 gap-5 md:gap-3">
      {data.newPosts.map((p) => (
        <Post key={p._id} {...p} />
      ))}
    </div>
  );
};

const loader = routeActionHandler<ILoaderData>(async () => {
  const newPosts = await PostService.getNewPosts();
  return { newPosts: newPosts.data };
});

export const NewPosts = Object.assign(Component, { loader });
