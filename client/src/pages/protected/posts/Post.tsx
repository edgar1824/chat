import { faEye, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LikeButton } from "components/main";
import { TextExpander, ViewInteraction } from "components/reusable";
import { PROFILE_IMG } from "constants/profile";
import { formFn, timeDifference } from "helpers";
import { useMedia } from "hooks";
import { FC, useCallback, useEffect, useState } from "react";
import { Link, useSubmit } from "react-router-dom";
import { PostService } from "request/services";
import { IPost, IUser } from "types";

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
  const media770 = useMedia(770);
  const [watched, setwatched] = useState(w);

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
        className="flex flex-col shadow-md gap-3 border px-2 py-3 h-fit md:py-1 md:px-1 md:gap-1"
      >
        <Link className="flex-[1] flex" to={`/posts/${_id}`}>
          <img
            className="min-h-[200px] select-none flex-[1] max-h-[300px] object-fill cursor-pointer md:max-h-[200px]"
            src={img}
            alt=""
          />
        </Link>
        <div className="flex flex-col gap-2">
          <div>
            <Link to={`/users/${user?._id}`} className="float-left shrink-0">
              <img
                className="w-7 h-7 rounded-full shadow-md float-left mr-3 md:mr-2"
                src={user?.img || PROFILE_IMG}
                alt=""
              />
            </Link>
            <TextExpander
              parentClass="w-full"
              className="break-words break-all leading-6 text-base md:leading-4 md:text-sm"
              lines={1}
              leading={media770 ? 16 : 24}
              text={desc}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex gap-5 md:gap-3">
              <LikeButton
                {...{
                  _id,
                  img,
                  desc,
                  createdAt,
                  likes,
                  watched: w,
                  hasMyLike,
                  haveWatched,
                  user,
                  ...props,
                }}
              />

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
