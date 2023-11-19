import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OutsideDetector } from "components/reusable";
import { useAuthContext } from "contexts";
import { formFn } from "helpers";
import { useClickOutside } from "hooks";
import { FC, useEffect, useRef, useState } from "react";
import { useFormAction, useSubmit } from "react-router-dom";

interface Props {
  id: string;
  username: string;
}

export const MessageUser: FC<Props> = ({ id, username }) => {
  const [s, setS] = useState(false);
  const { me } = useAuthContext();
  const submit = useSubmit();
  const action = useFormAction();
  // const ref = useRef(null);
  // const clickedOutside = useClickOutside(ref);

  const handleSubmit = () => {
    submit(formFn.toFormData({ id, username, me, role: "go-chat" }), {
      action,
      encType: "multipart/form-data",
      method: "post",
    });
  };

  // useEffect(() => {
  //   if (clickedOutside) setS(false);
  // }, [clickedOutside]);

  return (
    <OutsideDetector onOutside={() => setS(false)} className="relative">
      <FontAwesomeIcon
        onClick={() => setS((p) => !p)}
        className="cursor-pointer"
        icon={faMessage}
      />
      {s && (
        <div
          onClick={handleSubmit}
          className="cursor-pointer shrink-0 absolute top-0 shadow-cst right-full px-3 py-2 rounded"
        >
          Message
        </div>
      )}
    </OutsideDetector>
  );
};
