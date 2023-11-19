import { faAdd, faRemove, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CstmInput, CustomBtn } from "components/forms";
import { useAuthContext, useChatContext } from "contexts";
import { formFn } from "helpers";
import { FormEvent, useState } from "react";
import { useFormAction, useSubmit } from "react-router-dom";

export const New = () => {
  const submit = useSubmit();
  const action = useFormAction();
  const { me } = useAuthContext();
  const { friends, handleClose } = useChatContext();
  const [values, setValues] = useState<{
    members: string[];
    title?: string;
    img?: string | File;
    admins?: string[];
  }>({
    members: [me?._id!],
    title: "",
    img: "",
    admins: [me?._id!],
  });

  const addUser = (id?: string) => {
    if (!values?.members?.includes(id!)) {
      setValues((p) => ({ ...p, members: [...p.members, id!] }));
    } else {
      setValues((p) => ({
        ...p,
        members: p?.members?.filter((i) => i !== id),
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (values.members.length > 1 && values.title) {
      const fd = formFn.toFormData({
        ...values,
        type: "group",
        role: "create-group",
      });

      submit(fd, { action, encType: "multipart/form-data", method: "post" });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[30px] font-bold">Create New Group</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label htmlFor="file">
          {values.img ? (
            <img
              src={
                typeof values?.img === "string"
                  ? values?.img
                  : URL.createObjectURL(values?.img)
              }
              className="w-[75px] h-[75px] rounded"
              alt=""
            />
          ) : (
            <FontAwesomeIcon
              className="w-[75px] h-[75px] rounded"
              icon={faUpload}
            />
          )}
          <input
            onChange={(e) => {
              setValues((p) => ({ ...p, img: e.target?.files?.[0]! }));
            }}
            type="file"
            accept="image/*"
            id="file"
            hidden
          />
        </label>
        <CstmInput
          value={values.title}
          onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))}
          placeholder="title"
        />
        <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto py-2 px-1.5">
          {!!friends?.items?.length &&
            friends?.items?.map(({ username, _id }) => (
              <div key={_id} className="flex items-center gap-3">
                <div
                  className={`w-full cursor-pointer px-5 py-3 rounded shadow-cst ${
                    values.members.includes(_id!) ? "bg-slate-300" : "bg-white"
                  }`}
                >
                  {username}
                </div>
                <FontAwesomeIcon
                  icon={values.members.includes(_id!) ? faRemove : faAdd}
                  className="cursor-pointer px-1.5 py-1 rounded bg-white shadow-cst"
                  onClick={() => addUser(_id)}
                />
              </div>
            ))}
        </div>
        <CustomBtn type="submit">Create</CustomBtn>
      </form>
    </div>
  );
};
