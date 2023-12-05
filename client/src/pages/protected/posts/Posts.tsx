import { Footer } from "components/main";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";

const Component = () => {
  return (
    <>
      <div className="flex-[1] mx-auto max-w-[1024px] w-full px-[32px] py-5 md:px-3">
        <Outlet />
        <Navigation />
      </div>
      <Footer />
    </>
  );
};

export const Posts = Object.assign(Component);
