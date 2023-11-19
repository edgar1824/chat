import { faEnvelope, faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, Outlet } from "react-router-dom";

const Component = () => {
  return (
    <div className="h-[calc(100vh_-_50px)] flex">
      <div className="bg-[#0071c2] px-8 py-6 flex flex-col gap-7 flex-[1] sticky top-[50px] md:px-4">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "outline outline-2 outline-offset-4 outline-white rounded"
              : ""
          }
          to={"/notifications/inbox"}
        >
          <FontAwesomeIcon
            color="white"
            icon={faEnvelope}
            className="cursor-pointer"
            size="xl"
          />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "outline outline-2 outline-offset-4 outline-white rounded"
              : ""
          }
          to={"/notifications/sent"}
        >
          <FontAwesomeIcon
            color="white"
            icon={faEnvelopeOpen}
            className="cursor-pointer"
            size="xl"
          />
        </NavLink>
      </div>
      <div className="relative w-full py-2">
        <Outlet />
      </div>
    </div>
  );
};

export const Notifications = Object.assign(Component);
