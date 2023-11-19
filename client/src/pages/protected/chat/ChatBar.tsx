import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CustomBtn } from "components/forms";
import { OutsideDetector } from "components/reusable";
import { useAuthContext, useChatContext } from "contexts";
import { useMemo } from "react";

const items = [
  { name: "Edit", method: "edit" },
  { name: "Add User", method: "add" },
  { allowed: true, name: "Members", method: "delete" },
  { name: "Delete Chat", method: "delete-chat" },
  { allowed: true, name: "Leave Group", method: "leave" },
];

export const ChatBar = () => {
  const { me } = useAuthContext();
  const { open, setOpen, currentConv } = useChatContext();

  const modalItems = useMemo(
    () =>
      currentConv &&
      items.filter(
        ({ allowed }) =>
          allowed || currentConv?.admins.includes(me?._id) || me?.isAdmin
      ),
    [currentConv, me?._id, me?.isAdmin]
  );

  return (
    <div className="bg-slate-300 px-8 py-5 flex justify-end md:justify-between items-center gap-5 relative h-[72px] shadow-[7px_7px_10px_5px_rgb(0_0_0_/_10%)] border-l md:px-5">
      <Burger />
      {modalItems && (
        <OutsideDetector
          className="relative"
          onOutside={() => setOpen?.((p) => ({ ...p, optionsState: false }))}
        >
          <div
            onClick={() =>
              setOpen?.((p) => ({ ...p, optionsState: !p.optionsState }))
            }
            className="bg-blue-500 text-white px-2 cursor-pointer py-1 rounded"
          >
            ...
          </div>
          {open?.optionsState && (
            <div className="z-[50] absolute top-[calc(100%_+_5px)] right-[30px] p-1.5 flex flex-col gap-2 bg-white shadow-cst">
              {modalItems.map(({ name, method }) => (
                <CustomBtn
                  className="whitespace-nowrap"
                  onClick={() => setOpen?.({ method, state: true })}
                  key={method}
                >
                  {name}
                </CustomBtn>
              ))}
            </div>
          )}
        </OutsideDetector>
      )}
    </div>
  );
};

const Burger = () => {
  const { setShow } = useChatContext();
  return (
    <div
      className="shrink-0 w-fit md:block hidden"
      onClick={(e) => {
        setShow?.((p) => !p);
      }}
    >
      <div className="bg-blue-500 text-white px-3 cursor-pointer py-2 rounded flex items-center gap-1">
        <FontAwesomeIcon
          icon={faMessage}
          className="w-[20px] h-[20px] shrink-0"
        />
        <span>Chats</span>
      </div>
    </div>
  );
};
