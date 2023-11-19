import { faEye, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ViewInteraction } from "components/reusable";
import { PROFILE_IMG } from "constants/profile";
import { formFn, timeDifference } from "helpers";
import { FC, useEffect, useState } from "react";
import {
  Link,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { PostService } from "request/services";
import { IPost, IUser } from "types";
import { Load } from "./Load";
import { useAppContext } from "contexts";

export const Post: FC<IPost<IUser>> = ({
  _id,
  img,
  desc,
  createdAt,
  likes,
  watched: w,
  hasMyLike,
  haveWatched,
  user,
  ...props
}) => {
  const submit = useSubmit();

  const [watched, setwatched] = useState(w);

  const likeClickHandler = () => {
    submit(
      formFn.toFormData({
        postId: _id,
        role: hasMyLike ? "delete-like" : "add-like",
      }),
      {
        action: "/posts",
        encType: "multipart/form-data",
        method: "PUT",
      }
    );
  };

  const addWatched = async () => {
    if (!haveWatched) {
      try {
        const res = await PostService.addWatched(_id!);
        setwatched(res.data.watched);
      } catch (err) {
        console.error(err);
      }
    } else {
    }
  };

  useEffect(() => {
    setwatched(w);
  }, [w]);

  return (
    <>
      <ViewInteraction
        onInteraction={addWatched}
        className="flex flex-col shadow-md gap-3 border px-2 py-3"
      >
        <Link className="flex-[1] flex" to={`/posts/${_id}`}>
          <img
            className="min-h-[200px] select-none flex-[1] max-h-[300px] object-fill cursor-pointer"
            src={img}
            alt=""
          />
        </Link>
        <div className="flex flex-col gap-2">
          <div className="inline">
            <Link to={`/users/${user?._id}`}>
              <img
                className="w-7 h-7 rounded-full shadow-md inline mr-2 mb-2"
                src={img || PROFILE_IMG}
                alt=""
              />
            </Link>
            <p className="inline">{desc}</p>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-5">
              <div className="flex items-center gap-1">
                <Load {...{ _id, ...props }}>
                  <FontAwesomeIcon
                    onClick={likeClickHandler}
                    icon={faThumbsUp}
                    color={hasMyLike ? "red" : "gray"}
                    className="cursor-pointer"
                  />
                  {likes}
                </Load>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faEye} color="gray" />
                {watched}
              </div>
            </div>
            <span className="self-end text-xs">
              {timeDifference(createdAt!)}
            </span>
          </div>
        </div>
      </ViewInteraction>
    </>
  );
};
