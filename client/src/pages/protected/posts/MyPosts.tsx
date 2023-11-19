import { faEye, faHand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { routeActionHandler } from "helpers";
import React from "react";
import { PostService } from "request/services";

const Component = () => {
  return <div>MyPosts</div>;
};

const Post = ({
  desc,
  title,
  watched,
  likes,
  img,
}: {
  desc?: string;
  title?: string;
  watched?: number;
  likes?: number;
  img?: string;
}) => {
  return (
    <div className="flex flex-col gap-5 px-3 py-4 rounded bg-white shadow-md max-w-[260px]">
      <img src={img} className="w-full h-[200px]" alt="" />
      <div>
        <p>{title}</p>
        <div>
          <span>
            {watched} <FontAwesomeIcon icon={faEye} />
          </span>
          <span>
            {likes} <FontAwesomeIcon icon={faHand} />
          </span>
        </div>
      </div>
      <p>{desc}</p>
    </div>
  );
};

const loader = routeActionHandler(async () => {
  const myPosts = await PostService.getMine();
  return myPosts;
});

export const MyPosts = Object.assign(Component, { loader });
