import { CustomBtn } from "components/forms";
import { useAuthContext, useChatContext, useMessagesContext } from "contexts";
import { formFn } from "helpers";
import { useFormAction, useSubmit } from "react-router-dom";

export const Leave = () => {
  const { groupMembers } = useMessagesContext();
  const { handleClose } = useChatContext();

  const { me } = useAuthContext();
  const submit = useSubmit();
  const action = useFormAction();

  const leave = () => {
    console.log(groupMembers);

    submit(
      formFn.toFormData({
        role: "leave-group",
        members: groupMembers?.map((e) => e?._id),
        me,
      }),
      { action, encType: "multipart/form-data", method: "put" }
    );
  };
  return (
    <div className="flex flex-col items-center gap-7">
      <p className="text-[28px] font-bold">Leave The Group?</p>
      <div className="w-full flex items-center justify-end gap-4">
        <CustomBtn className="w-full" onClick={handleClose}>
          Cancel
        </CustomBtn>
        <CustomBtn onClick={leave} className="w-full">
          Yes
        </CustomBtn>
      </div>
    </div>
  );
};
