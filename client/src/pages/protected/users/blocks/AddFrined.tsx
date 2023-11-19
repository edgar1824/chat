import { faUserFriends, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "contexts";
import { formFn } from "helpers";
import { FC, useCallback } from "react";
import { useFormAction, useSubmit } from "react-router-dom";

interface Props {
  id: string;
}

export const AddFrined: FC<Props> = ({ id }) => {
  const { me } = useAuthContext();
  const action = useFormAction();
  const submit = useSubmit();

  const addFriend = useCallback(() => {
    if (!me?.friends?.includes(id)) {
      const notif = {
        type: "be-friend",
        recievers: [id],
        title: "Friends?",
        sender: me?._id,
        text: `${me?.username} wants to be friends with you`,
      };
      submit(formFn.toFormData({ notif, role: "send-notification" }), {
        action,
        method: "post",
      });
    }
  }, [me]);
  return (
    <>
      <FontAwesomeIcon
        onClick={addFriend}
        color={me?.friends?.includes(id) ? "green" : "none"}
        title="add friend"
        className="cursor-pointer"
        icon={me?.friends?.includes(id) ? faUserFriends : faUserPlus}
      />
    </>
  );
};
