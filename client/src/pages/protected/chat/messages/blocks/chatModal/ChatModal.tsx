import { Modal } from "components/reusable";
import { useChatContext } from "contexts";
import {
  DeleteChat,
  EditConversation,
  GroupMembers,
  Leave,
  OtherUsers,
} from "./blocks";
import { ReactNode } from "react";

const Comp: {
  [key: string]: ReactNode;
} = {
  add: <OtherUsers />,
  delete: <GroupMembers />,
  leave: <Leave />,
  "delete-chat": <DeleteChat />,
  edit: <EditConversation />,
};

export const ChatModal = () => {
  const { handleClose, open } = useChatContext();
  return (
    <Modal className="py-5 px-3" open={open?.state!} handleClose={handleClose!}>
      {Comp[open?.method!]}
    </Modal>
  );
};
