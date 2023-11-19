import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CenterText } from "components/reusable";
import { useAuthContext, useMessagesContext } from "contexts";
import { formFn } from "helpers";
import {
  Link,
  useFormAction,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import { IMessagesLoaderData } from "../../../Messages";

export const OtherUsers = () => {
  const action = useFormAction();
  const { freeFriends, groupMembers } = useMessagesContext();
  const { me } = useAuthContext();
  const { currentConv } = useLoaderData() as IMessagesLoaderData;

  const submit = useSubmit();

  const addUser = (id?: string) => {
    const user = freeFriends?.find((u) => u?._id === id);
    submit(
      formFn.toFormData({
        id,
        user,
        currentConv,
        role: "add-user",
        members: groupMembers?.map((e) => e?._id),
        me,
      }),
      { action, encType: "multipart/form-data", method: "put" }
    );
  };

  return (
    <div className="flex flex-col gap-2 relative max-h-[300px] overflow-auto px-5 py-5">
      {!!freeFriends?.length ? (
        freeFriends
          ?.filter((e) => e?._id !== me?._id)
          ?.map(({ username, _id, isOnline }) => (
            <div key={_id} className="flex items-center gap-3">
              <div className="flex items-center justify-between gap-3 w-full cursor-pointer px-5 py-3 rounded shadow-cst bg-white">
                <Link to={`/users/${_id}`}>{username}</Link>
                {isOnline && (
                  <i className="rounded-full w-[15px] h-[15px] bg-green-600"></i>
                )}
              </div>
              <FontAwesomeIcon
                icon={faAdd}
                className="cursor-pointer px-1.5 py-1 rounded bg-white shadow-cst "
                onClick={() => addUser(_id)}
              />
            </div>
          ))
      ) : (
        <CenterText>No members</CenterText>
      )}
    </div>
  );
};
