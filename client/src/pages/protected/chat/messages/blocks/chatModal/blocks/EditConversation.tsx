import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CstmInput, CustomBtn } from "components/forms";
import { useAuthContext, useChatContext } from "contexts";
import { formFn } from "helpers";
import { useState } from "react";
import { useFormAction, useLoaderData, useSubmit } from "react-router-dom";
import { IMessagesLoaderData } from "../../../Messages";

export const EditConversation = () => {
  const { me } = useAuthContext();
  const { handleClose } = useChatContext();
  const submit = useSubmit();
  const action = useFormAction();
  const { currentConv } = useLoaderData() as IMessagesLoaderData;
  const [values, setValues] = useState<{
    img: File | string;
    title: string | string[];
  }>({
    img: (currentConv?.img as string) || "",
    title: currentConv?.title || "",
  });

  const save = () => {
    submit(formFn.toFormData({ ...values, role: "edit" }), {
      action,
      encType: "multipart/form-data",
      method: "put",
    });
    handleClose?.();
  };
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[24px] font-bold text-center">Edit</p>

      <div className="flex gap-4 items-center">
        <img
          src={
            values.img
              ? typeof values.img === "string"
                ? values.img
                : URL.createObjectURL(values.img)
              : ""
          }
          className="w-[75px] h-[75px] rounded outline-1 outline-slate-500 outline outline-offset-2"
          alt=""
        />
        <label htmlFor="edit-file">
          <FontAwesomeIcon
            className="w-[25px] h-[25px] rounded"
            icon={faUpload}
          />
          <input
            onChange={(e) => {
              setValues((p) => ({ ...p, img: e?.target?.files?.[0]! }));
            }}
            type="file"
            id="edit-file"
            hidden
          />
        </label>
      </div>
      <CstmInput
        placeholder="title"
        value={
          Array.isArray(values?.title)
            ? values?.title.find((e) => e !== me?.username)
            : values?.title
        }
        onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))}
      />
      <CustomBtn onClick={save}>Save</CustomBtn>
    </div>
  );
};
