import { faEye, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ViewInteraction } from "components/reusable";
import { PROFILE_IMG } from "constants/profile";
import { formFn, timeDifference } from "helpers";
import { FC, useEffect, useRef, useState } from "react";
import { Link, useSubmit } from "react-router-dom";
import { PostService } from "request/services";
import { IPost, IUser } from "types";
import { Load } from "./Load";
import { useMedia } from "hooks";

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
        className="flex flex-col shadow-md gap-3 border px-2 py-3 h-fit md:py-1 md:px-1 md:gap-1"
      >
        <Link className="flex-[1] flex" to={`/posts/${_id}`}>
          <img
            className="min-h-[200px] select-none flex-[1] max-h-[300px] object-fill cursor-pointer"
            src={img}
            alt=""
          />
        </Link>
        <div className="flex flex-col gap-2">
          <div className="flex gap-3 md:gap-1">
            <Link to={`/users/${user?._id}`} className="shrink-0">
              <img
                className="w-7 h-7 rounded-full shadow-md"
                src={img || PROFILE_IMG}
                alt=""
              />
            </Link>
            <MoreText
              parentClass="w-full"
              className="break-words break-all md:leading-4 md:text-sm"
              lines={1}
              leading={16}
              text={desc! + desc! + desc! + desc! + desc!}
            />
            {/* <p className="break-words break-all md:leading-4 md:text-sm">
              {desc}
            </p> */}
          </div>
          <div className="flex flex-col">
            <div className="flex gap-5 md:gap-3">
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

const MoreText = ({
  text = "",
  className = "",
  parentClass = "",
  leading = 16,
  lines = 1,
}: {
  lines?: number;
  leading?: number;
  text?: string;
  className?: string;
  parentClass?: string;
}) => {
  const ref = useRef<HTMLParagraphElement>(null!);
  const [show, setShow] = useState(false);
  const [showButton, setShowButton] = useState(useMedia(770));

  useEffect(() => {
    setShowButton(
      !(
        ref.current?.scrollHeight - ref.current?.scrollHeight / 2 <=
        ref.current?.offsetHeight
      )
    );
  }, [ref]);

  return (
    <div className={"flex flex-col " + parentClass}>
      <p
        ref={ref}
        className={className}
        style={{
          height: show ? "100%" : leading * lines + "px",
          overflow: "hidden",
        }}
      >
        {text}
      </p>
      {showButton && (
        <span
          onClick={() => {
            setShow((p) => !p);
          }}
          className="cursor-pointer text-xs h-3 flex items-center justify-center self-end"
        >
          {show ? "less" : "more..."}
        </span>
      )}
    </div>
  );
};
