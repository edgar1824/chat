import { CustomBtn } from "components/forms";
import { useChatContext, useMessagesContext } from "contexts";
import { formFn } from "helpers";
import { useFormAction, useSubmit } from "react-router-dom";

export const DeleteChat = () => {
  const { groupMembers } = useMessagesContext();
  const { handleClose } = useChatContext();
  const submit = useSubmit();
  const action = useFormAction();

  const deleteChat = () => {
    submit(formFn.toFormData({ role: "delete-chat", members: groupMembers }), {
      action,
      method: "DELETE",
    });
  };

  return (
    <div className="flex flex-col items-center gap-7">
      <p className="text-[28px] font-bold">Delete The Group?</p>
      <div className="w-full flex items-center justify-end gap-4">
        <CustomBtn className="w-full" onClick={handleClose}>
          Cancel
        </CustomBtn>
        <CustomBtn className="w-full" onClick={deleteChat}>
          Yes
        </CustomBtn>
      </div>
    </div>
  );
};
