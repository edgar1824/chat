import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ViewInteraction } from "components/reusable";
import { FC, useCallback, useState } from "react";
import { PostService } from "request/services";
import { IPost, IUser } from "types";

interface Props
  extends Required<Pick<IPost<IUser>, "haveWatched" | "watched" | "_id">> {}

export const WatchedEye: FC<Props> = (props) => {
  const [post, setPost] = useState<Props>(props);
  const addViewhandler = useCallback(async () => {
    if (!post?.haveWatched) {
      const res = await PostService.addWatched(post._id);
      setPost({
        _id: res.data._id!,
        haveWatched: res.data.haveWatched!,
        watched: res.data.watched!,
      });
    }
  }, []);

  return (
    <ViewInteraction
      once
      onInteraction={addViewhandler}
      className="flex items-center gap-1 text-xl md:text-base"
    >
      <FontAwesomeIcon
        className="w-6 h-6 md:w-5 md:h-5"
        icon={faEye}
        color={post?.haveWatched ? "red" : "gray"}
      />
      {post.watched}
    </ViewInteraction>
  );
};
