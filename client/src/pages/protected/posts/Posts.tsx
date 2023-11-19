import { Footer } from "components/main";
import { routeActionHandler } from "helpers";
import { Outlet } from "react-router-dom";
import { PostService } from "request/services";
import { IPost } from "types";
import { Navigation } from "./Navigation";

interface IActionData extends IPost {}
interface Input {
  role: "add-like" | "delete-like";
  postId: string;
}

const Component = () => {
  return (
    <>
      <div className="flex-[1] mx-auto max-w-[1024px] w-full relative">
        <Outlet />
        <Navigation />
      </div>
      <Footer />
    </>
  );
};
const action = routeActionHandler<IActionData, Input>(async ({ data }) => {
  switch (data.role) {
    case "add-like": {
      const res = await PostService.addLike(data.postId);
      return res.data;
    }
    case "delete-like": {
      const res = await PostService.deleteLike(data.postId);
      return res.data;
    }
    default:
      return null!;
  }
}, true);

export const Posts = Object.assign(Component, { action });
