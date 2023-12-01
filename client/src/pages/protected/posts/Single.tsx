import {
  faComment,
  faEye,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classes, formFn, routeActionHandler, timeDifference } from "helpers";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { IComment, IPost, IUser } from "types";
import {
  useActionData,
  useFormAction,
  useLoaderData,
  useNavigation,
  useParams,
  useSubmit,
} from "react-router-dom";
import { CommentService, PostService } from "request/services";
import { CstmInput, CustomBtn } from "components/forms";
import { PROFILE_IMG } from "constants/profile";
import { useAuthContext } from "contexts";
import { CenterText } from "components/reusable";
import { LikeButton } from "components/main";

interface ILoaderData {
  post: IPost<IUser>;
  comments: IComment<IUser>[];
}

const Component: FC = () => {
  const submit = useSubmit();
  const action = useFormAction();
  const actionData = useActionData();
  const navigation = useNavigation();
  const { post, comments } = useLoaderData() as ILoaderData;
  const [watched, setwatched] = useState(post?.watched);
  const [showComments, setShowComments] = useState(false);

  const likeClickHandler = () => {
    submit(
      formFn.toFormData({
        postId: post?._id,
        role: post?.hasMyLike ? "delete-like" : "add-like",
      }),
      {
        action,
        encType: "multipart/form-data",
        method: "PUT",
      }
    );
  };

  useEffect(() => {
    setwatched(post?.watched);
  }, [post?.watched]);

  return (
    <div className="flex gap-5 py-5 w-full h-screen md:h-auto md:flex-col md:mt-5 md:min-h-[90vh]">
      <img
        className="w-[40%] md:w-full md:self-center md:px-2 md:h-[60vh] md:border md:border-[rgb(186_186_186)] md:object-contain md:max-w-[500px]"
        src={post?.img}
        alt=""
      />
      <div className="flex-[6] flex flex-col gap-10 h-full md:px-2">
        <div className="flex flex-col gap-1 md:gap-5">
          <p>{post?.desc}</p>
          <div className="flex flex-col md:text-xl md:gap-2">
            <div className="flex gap-5">
              <LikeButton {...post} />
              {/* <div className="flex items-center gap-1 shrink-0 md:gap-0">
                <Load {...{ _id: post?._id }}>
                  <FontAwesomeIcon
                    onClick={likeClickHandler}
                    icon={faThumbsUp}
                    color={post?.hasMyLike ? "red" : "gray"}
                    className="cursor-pointer md:w-10 md:h-6"
                  />
                </Load>
                {!!post.peopleLiked?.length && (
                  <div className="flex items-center ml-[10px] shrink-0">
                    {post.peopleLiked?.map((s, i) => (
                      <div
                        key={i}
                        style={{ zIndex: 4 - i }}
                        className="ml-[-10px]"
                      >
                        <img
                          className="w-7 h-7 rounded-full shadow-lg object-fill shrink-0"
                          src={s || PROFILE_IMG}
                          alt=""
                        />
                      </div>
                    ))}
                  </div>
                )}
                {post?.likes! > 3 && <span> and {post?.likes! - 3} more</span>}
                {post?.likes! === 0 && <span>0</span>}
              </div> */}
              <div className="flex items-center gap-1 md:gap-0">
                <FontAwesomeIcon
                  className=" md:w-10 md:h-6"
                  icon={faEye}
                  color="gray"
                />
                {watched}
              </div>
              <div className="flex items-center gap-1 md:gap-0">
                <FontAwesomeIcon
                  onClick={() => setShowComments((p) => !p)}
                  icon={faComment}
                  color="gray"
                  className="cursor-pointer md:w-10 md:h-6"
                />
                {comments.length}
              </div>
            </div>
            <span className="self-end text-xs">
              {timeDifference(post?.createdAt!)}
            </span>
          </div>
        </div>
        {showComments && <CommentsBlock />}
      </div>
    </div>
  );
};

const CommentsBlock: FC = () => {
  const { comments } = useLoaderData() as ILoaderData;
  const { me } = useAuthContext();

  return (
    <div className="flex flex-col gap-5 flex-[1]">
      <div className="min-h-[200px] shadow-[0_5px_20px_5px_rgb(0_0_0_/_0.1)] relative flex flex-col gap-3 flex-[1] overflow-y-auto max-h-[calc(100vh_-_270px)] py-5 pr-2 md:py-2">
        {!!comments.length ? (
          comments?.map(({ desc, comentatorId, _id }) => (
            <div
              key={_id}
              className={classes(
                "flex flex-col gap-1 md:gap-0",
                comentatorId?._id === me?._id ? "items-end" : ""
              )}
            >
              <div
                className={classes(
                  "flex items-center gap-1 md:h-6",
                  comentatorId?._id === me?._id ? "flex-row-reverse" : ""
                )}
              >
                <img
                  src={comentatorId?.img || PROFILE_IMG}
                  className="w-8 h-8"
                  alt=""
                />
                <span>{comentatorId?.username}</span>
              </div>
              <p
                className={classes(
                  "bg-slate-200 w-fit rounded px-2 py-1",
                  comentatorId?._id === me?._id ? "mr-10" : "ml-10"
                )}
              >
                {desc}
              </p>
            </div>
          ))
        ) : (
          <CenterText>No comments yet</CenterText>
        )}
      </div>
      <AddComment />
    </div>
  );
};

const AddComment: FC = () => {
  const submit = useSubmit();
  const action = useFormAction();
  const inputRef = useRef<HTMLInputElement>(null!);
  const { id: postId } = useParams();
  const commentPostHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = new FormData(e.target as HTMLFormElement).get(
      "text"
    ) as string;

    submit(
      formFn.toFormData({
        desc: text,
        postId: postId!,
        role: "send-comment",
      }),
      {
        action,
        encType: "multipart/form-data",
        method: "PUT",
      }
    );

    inputRef.current.value = "";
  };
  return (
    <form onSubmit={commentPostHandler}>
      <div className="grid grid-cols-[auto_80px] items-center gap-3">
        <CstmInput myRef={inputRef} name="text" placeholder="Add Comment!" />
        <CustomBtn className="!min-h-full text-center">SEND</CustomBtn>
      </div>
    </form>
  );
};

const loader = routeActionHandler<ILoaderData>(async ({ params }) => {
  const post = await PostService.getById(params.id!);
  const comments = await CommentService.getOfPost<IComment<IUser>>(params.id!);
  return { post: post.data as ILoaderData["post"], comments: comments.data };
});

const action = routeActionHandler(async ({ data }) => {
  switch (data.role) {
    case "send-comment": {
      const res = await CommentService.create(
        data as Required<Pick<IComment<string>, "desc" | "postId">>
      );
      return res.data;
    }
    default:
      return null!;
  }
}, true);

export const Single = Object.assign(Component, { loader, action });
