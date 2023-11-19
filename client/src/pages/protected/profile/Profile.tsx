import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosResponse } from "axios";
import { CstmInput, CustomBtn } from "components/forms";
import { PROFILE_IMG, profile_inputs } from "constants/profile";
import { useAuthContext } from "contexts";
import { formFn, routeActionHandler } from "helpers";
import { useMedia } from "hooks";
import {
  FormEvent,
  LegacyRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useActionData, useFormAction, useSubmit } from "react-router-dom";
import instance from "request/api";

function convertArrToObj(arr: readonly string[]): Record<string, any> {
  let obj = {};
  arr.forEach((el) => {
    Object.assign(obj, { [el]: "" });
  });
  return obj;
}

const Component = () => {
  const { me: data, setMe } = useAuthContext();
  const submit = useSubmit();
  const action = useFormAction();
  const actionData = useActionData() as AxiosResponse;

  const [file, setFile] = useState<File>(null!);
  const [isEdit, setEdit] = useState(false);
  const [values, setValues] = useState({
    ...convertArrToObj(profile_inputs),
    ...data,
  });

  useEffect(() => {
    setValues((p) => ({ ...p, ...data }));
  }, [data]);

  useEffect(() => {
    if (actionData && actionData?.statusText === "OK" && actionData.data) {
      setMe?.(actionData?.data);
      setValues({
        ...convertArrToObj(profile_inputs),
        ...actionData?.data,
      });
      setFile(null!);
      setEdit(false);
    }
  }, [actionData]);

  const canSubmitData = useMemo(
    () =>
      (isEdit &&
        !Object.entries(values).every(
          ([key, value]) =>
            key in values && data?.[key as keyof typeof data] === value
        )) ||
      file,
    [isEdit, file, values, data]
  );
  const fileActionHandler = useCallback(
    (node: HTMLInputElement) => {
      if (!file && !!node?.files?.length) {
        node.files = new DataTransfer().files;
      }
    },
    [file]
  );

  const handlSubmit = (e: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (canSubmitData) {
      const fd = formFn.toFormData({ ...values, img: file || data?.img });
      submit(fd, { action, method: "put", encType: "multipart/form-data" });
      setValues((p) => ({ ...p, img: "" }));
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto px-[32px] py-5">
      <div className="flex flex-col gap-10">
        <p className="w-full text-center text-[32px] font-bold">My Profile</p>
        <form onSubmit={handlSubmit} className="flex gap-8 md:flex-col">
          <div className="relative w-fit">
            <img
              src={file ? URL.createObjectURL(file) : data?.img || PROFILE_IMG}
              alt=""
              className="min-w-[200px] h-[200px] rounded shrink-0"
            />
            <label className="absolute top-3 right-3" htmlFor="file">
              <input
                onChange={(e) => setFile(e.target.files?.[0]!)}
                ref={fileActionHandler}
                type="file"
                id="file"
                accept="image/*"
                hidden
              />
              <FontAwesomeIcon
                icon={faEdit}
                className="cursor-pointer bg-white p-0.5"
              />
            </label>
          </div>
          <div className="flex flex-col gap-4 mt-3 flex-[1] max-w-[400px]">
            {!isEdit && (
              <FontAwesomeIcon
                icon={faEdit}
                className="cursor-pointer bg-white p-0.5 self-end"
                onClick={() => setEdit(true)}
              />
            )}
            {isEdit ? (
              <>
                {profile_inputs.map((name) => (
                  <CstmInput
                    key={name}
                    value={values[name] || ""}
                    onChange={(e) =>
                      setValues((p) => ({ ...p, [name]: e.target.value }))
                    }
                    placeholder={name}
                    disabled={name === "email"}
                  />
                ))}
              </>
            ) : (
              <>
                <p className="text-[44px] font-bold">{data?.username}</p>
                <span className="text-[36px]">{data?.country}</span>
                <div className="flex flex-col gap-4">
                  {data?.city && (
                    <span className="text-[24px] text-slate-400">
                      {data?.city}
                    </span>
                  )}
                  {data?.phone && (
                    <span className="text-[24px] text-slate-400">
                      {data?.phone}
                    </span>
                  )}
                  {data?.email && (
                    <span className="text-[24px] text-slate-400">
                      {data?.email}
                    </span>
                  )}
                </div>
              </>
            )}
            {canSubmitData && (
              <div className="flex items-center gap-5 justify-end">
                <CustomBtn
                  onClick={() => {
                    setEdit(false);
                    setFile(null!);
                  }}
                  className="w-fit min-w-[150px] self-end flex-[1]"
                >
                  Cancel
                </CustomBtn>
                <CustomBtn
                  type="submit"
                  className="w-fit min-w-[150px] self-end flex-[1]"
                >
                  Save
                </CustomBtn>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const action = routeActionHandler(async ({ request }) => {
  const fd = await request.formData();
  const res = await instance.put(`users/update/${fd.get("_id")}`, fd);
  return { ...res, message: "Edited successfully" };
});

export const Profile = Object.assign(Component, { action });
