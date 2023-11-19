import {
  faBell,
  faImage,
  faMessage,
  faNavicon,
  faSignOut,
  faUser,
  faUserFriends,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OutsideDetector } from "components/reusable";
import { useAuthContext } from "contexts";
import { formFn } from "helpers";
import { useMedia } from "hooks";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Link,
  NavLink,
  To,
  useLocation,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { Eye } from "../Eye";
import "./navbar.css";

export const Navbar = () => {
  const { notifs } = useAuthContext();
  const { me } = useAuthContext();

  const submit = useSubmit();
  const { state } = useNavigation();
  const { pathname } = useLocation();

  const max770 = useMedia(770);
  const [show, setShow] = useState(false);

  const burgerHandler = useCallback(() => {
    if (max770) setShow(false);
  }, [max770, state, show]);

  useEffect(() => {
    setShow(false);
  }, [pathname]);

  return (
    <div className="navbar">
      <div className="navContainer">
        <Burger {...{ setShow }} />
        <OutsideDetector
          className={`md:absolute md:top-[50px] md:max-w-[500px] md:min-w-[300px] md:w-[70%] md:h-[calc(100vh_-_50px)] md:bg-[#9b9be3] md:py-5 md:z-[999] duration-300 ${
            show ? "left-0" : "left-[-100%]"
          }`}
          onOutside={burgerHandler}
        >
          <div className="flex items-center gap-5 h-full md:flex-col md:w-full md:gap-1">
            <MyLink
              to="/posts"
              title="Posts"
              icon={<FontAwesomeIcon icon={faImage} />}
            />
            <MyLink
              to="/chat"
              title="Chat"
              icon={<FontAwesomeIcon icon={faMessage} />}
            />
            <MyLink
              to="/friends?page=1"
              title="Friends"
              icon={<FontAwesomeIcon icon={faUserFriends} />}
            />
            <MyLink
              to="/users?page=1"
              title="Users"
              icon={<FontAwesomeIcon icon={faUsers} />}
            />
            <MyLink
              to="/profile"
              title="Profile"
              icon={<FontAwesomeIcon icon={faUser} />}
            />
          </div>
        </OutsideDetector>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Eye size="sm" />
            <Eye size="sm" />
          </div>
          <p>{me?.username}</p>
          <Link to="/notifications/inbox" className="relative">
            {!!notifs?.length && (
              <span className="absolute top-[1px] left-[4.5px] rounded-full bg-[#ff0303] w-[12px] h-[12px] text-[10px] leading-[11px] font-bold text-center">
                {notifs?.length}
              </span>
            )}
            <FontAwesomeIcon icon={faBell} />
          </Link>
          <FontAwesomeIcon
            onClick={() => {
              submit(formFn.toFormData({ role: "logout" }), {
                action: "/",
                method: "post",
                encType: "multipart/form-data",
              });
            }}
            title="Sign Out"
            className="cursor-pointer"
            icon={faSignOut}
          />
        </div>
      </div>
    </div>
  );
};

const MyLink = ({
  to,
  icon,
  title,
}: {
  to: To;
  icon: ReactNode;
  title?: string;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${
          isActive &&
          "border-white border md:border-none md:bg-[#003580] md:rounded-none"
        } flex items-center gap-1.5 px-3 py-2 rounded-2xl relative md:w-full md:grid md:grid-cols-[30px_100px] md:justify-center md:py-4`
      }
    >
      {icon}
      <span>{title}</span>
    </NavLink>
  );
};

const Burger = ({
  setShow,
  onOutside,
  ...props
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
  onOutside?: () => void;
}) => {
  return (
    <OutsideDetector onOutside={onOutside} className="shrink-0">
      <FontAwesomeIcon
        onClick={(e) => {
          setShow((p) => !p);
        }}
        icon={faNavicon}
        className="md:block hidden px-2 py-2 w-[20px] h-[20px] shrink-0 hover:bg-slate-500 duration-300 rounded-full cursor-pointer"
      />
    </OutsideDetector>
  );
};
