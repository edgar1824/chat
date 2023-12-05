import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LikeButton, WatchedEye } from "components/main";
import { TextExpander } from "components/reusable";
import { PROFILE_IMG } from "constants/profile";
import { timeDifference } from "helpers";
import { useMedia } from "hooks";
import { FC } from "react";
import { Link } from "react-router-dom";
import { IPost, IUser } from "types";

export const Post: FC<IPost<IUser>> = ({
  _id,
  img,
  desc,
  createdAt,
  likes,
  watched,
  hasMyLike,
  haveWatched,
  user,
  commentCount,
  ...props
}) => {
  const media770 = useMedia(770);
  return (
    <>
      <div className="min-h-[425px] flex flex-col shadow-md gap-3 border px-2 py-3 h-fit md:py-1 md:px-1 md:gap-1 md:min-h-min">
        <Link className="flex-[1] flex" to={`/posts/${_id}`}>
          <img
            className="select-none flex-[1] h-[300px] object-contain cursor-pointer bg-slate-100"
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
              text={desc}
              mediaDeps={[media770]}
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
                  watched,
                  hasMyLike,
                  haveWatched,
                  user,
                  ...props,
                }}
              />

              <WatchedEye
                _id={_id!}
                haveWatched={haveWatched!}
                watched={watched!}
              />
              <Link
                to={`/posts/${_id}`}
                state={{ openComments: true }}
                className="flex items-center gap-1 text-xl md:text-base"
              >
                <FontAwesomeIcon
                  icon={faComment}
                  color="gray"
                  className="w-6 h-6 md:w-5 md:h-5"
                />
                {commentCount}
              </Link>
            </div>
            <span className="self-end text-xs">
              {timeDifference(createdAt!)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
