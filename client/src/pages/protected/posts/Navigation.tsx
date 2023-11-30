import { faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "components/Box";
import { Animated } from "components/reusable";
import { useEffect, useState } from "react";
import { Link, useNavigation } from "react-router-dom";

const routes = [
  {
    to: "/posts/new",
    title: "Add New Post",
  },
  {
    to: "/posts",
    title: "Posts",
  },
];

export const Navigation = () => {
  const { state } = useNavigation();

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) setShow(state !== "idle");
  }, [state]);

  return (
    <Box
      as="abbr"
      className="absolute top-5 right-5 md:right-1 md:top-1"
      onOutside={() => setShow(false)}
    >
      <FontAwesomeIcon
        className="bg-slate-200 rounded cursor-pointer shadow-lg"
        size="lg"
        icon={faList}
        border
        onClick={() => setShow((p) => !p)}
      />
      <Animated
        show={show}
        removeOnEnd
        duration={200}
        initial={{ transformOrigin: "100% 14px" }}
        from={{ opacity: "0", transform: "scale(0)" }}
        to={{ opacity: "1", transform: "scale(1)" }}
        className="absolute right-[calc(100%_+_6px)] top-0 shadow-lg"
      >
        <div className="bg-slate-50 shadow-md w-full flex flex-col gap-1 p-0.5 select-none">
          {routes.map(({ title, to }) => (
            <Link
              onClick={() => {
                setShow(false);
              }}
              key={to}
              className="whitespace-nowrap bg-slate-200 px-3 py-2 hover:bg-slate-50 duration-300"
              to={to}
            >
              {title}
            </Link>
          ))}
        </div>
      </Animated>
    </Box>
  );
};
