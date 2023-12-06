import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CstmInput, CustomBtn } from "components/forms";
import { LikeButton, WatchedEye } from "components/main";
import { CenterText } from "components/reusable";
import { PROFILE_IMG } from "constants/profile";
import { useAuthContext } from "contexts";
import { classes, formFn, routeActionHandler, timeDifference } from "helpers";
import { useMedia } from "hooks";
import {
  FC,
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  useFormAction,
  useLoaderData,
  useLocation,
  useParams,
  useSubmit,
} from "react-router-dom";
import { CommentService, PostService } from "request/services";
import { IComment, IPost, IUser } from "types";

interface ILoaderData {
  post: IPost<IUser>;
  comments: IComment<IUser>[];
}

const Component: FC = () => {
  const { post, comments } = useLoaderData() as ILoaderData;
  const location = useLocation();
  const [showComments, setShowComments] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null!);
  const media770 = useMedia(770);

  const scrollToComments = () =>
    new Promise((res) => {
      if (commentsRef?.current) {
        setTimeout(() => {
          commentsRef.current?.scrollIntoView?.({ behavior: "smooth" });
          res(true);
        }, 100);
      }
    });

  useEffect(() => {
    if (!!location.state?.openComments) {
      setShowComments(true);
    }
  }, [location, commentsRef.current]);

  useEffect(() => {
    if (!!location.state?.openComments || showComments) {
      scrollToComments();
    }
  }, [showComments, commentsRef.current]);

  return (
    <div className="flex gap-5 w-full h-screen md:h-auto md:flex-col md:min-h-[90vh]">
      <img
        className="bg-slate-100 object-contain w-[40%] md:w-full md:self-center md:px-2 md:h-[40vh] md:border md:border-[rgb(186_186_186)] md:max-w-[500px]"
        src={post?.img}
        alt=""
      />
      <div className="flex-[6] flex flex-col gap-10 h-full md:gap-4">
        <div className="flex flex-col gap-1 md:gap-2">
          <Link
            to={`/users/${post.user?._id}`}
            className="flex items-center gap-4 w-fit"
          >
            <img
              src={post.user?.img || PROFILE_IMG}
              className="w-16 h-16 rounded-full shadow-lg md:w-12 md:h-12"
              alt=""
            />
            <p className="text-2xl font-semibold md:text-xl">
              {post.user?.username}
            </p>
          </Link>
          <p>{post?.desc}</p>
          <div className="flex flex-col md:text-xl">
            <div className="flex gap-5">
              <LikeButton {...post} />
              <WatchedEye
                _id={post._id!}
                haveWatched={post.haveWatched!}
                watched={post.watched!}
              />
              <div className="flex items-center gap-1 text-xl md:text-base">
                <FontAwesomeIcon
                  onClick={() => {
                    setShowComments((p) => !p);
                  }}
                  icon={faComment}
                  color="gray"
                  className="w-6 h-6 cursor-pointer md:w-5 md:h-5"
                />
                {comments.length}
              </div>
            </div>
            <span className="self-end text-xs">
              {timeDifference(post?.createdAt!)}
            </span>
          </div>
        </div>
        {(showComments || !media770) && <CommentsBlock {...{ commentsRef }} />}
      </div>
    </div>
  );
};

const CommentsBlock: FC<{ commentsRef: MutableRefObject<HTMLDivElement> }> = ({
  commentsRef,
}) => {
  const { comments } = useLoaderData() as ILoaderData;
  const { me } = useAuthContext();

  return (
    <div ref={commentsRef} className="flex flex-col gap-5 flex-[1] md:gap-2">
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
                  className="w-8 h-8 rounded-full shadow-2xl"
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
      <div className="grid grid-cols-[auto_80px] items-center gap-3 md:gap-0">
        <CstmInput myRef={inputRef} name="text" placeholder="Add Comment!" />
        <CustomBtn
          type="submit"
          className="!min-h-full text-center md:!rounded-l-none"
        >
          SEND
        </CustomBtn>
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

export const Single = Object.assign(Component, {
  loader,
  action,
  loaderType: null! as ILoaderData,
});
