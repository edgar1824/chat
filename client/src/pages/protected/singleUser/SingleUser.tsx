import { CustomBtn } from "components/forms";
import { useAuthContext } from "contexts";
import { formFn, routeActionHandler } from "helpers";
import { useFormAction, useLoaderData, useSubmit } from "react-router-dom";
import { ConversationService } from "request/services";
import instance from "request/api";
import { IUser } from "types";

const Component = () => {
  const data = useLoaderData() as IUser;
  const { me } = useAuthContext();
  const submit = useSubmit();
  const action = useFormAction();

  const handleSubmit = () => {
    submit(formFn.toFormData({ id: data?._id, username: data?.username, me }), {
      action,
      method: "post",
    });
  };
  return (
    <div className="max-w-[1024px] mx-auto px-[32px] py-5">
      <div className="flex gap-8 md:flex-col">
        <img
          src={
            data?.img ||
            "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
          }
          alt=""
          className="w-[200px] h-[200px] rounded"
        />
        <div className="flex flex-col gap-4 mt-20 md:m-0">
          <p className="text-[44px] font-bold">{data?.username}</p>
          {me?._id !== data?._id && (
            <CustomBtn onClick={handleSubmit}>Message</CustomBtn>
          )}
          <span className="text-[36px]">{data?.country}</span>
          <div className="flex flex-col gap-4">
            {data?.city && (
              <span className="text-[24px] text-slate-400">{data?.city}</span>
            )}
            {data?.phone && (
              <span className="text-[24px] text-slate-400">{data?.phone}</span>
            )}
            {data?.email && (
              <span className="text-[24px] text-slate-400">{data?.email}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const loader = routeActionHandler(async ({ params }) => {
  const user = await instance.get(`users/find/not-private/${params.id}`);
  return user.data;
});

const action = routeActionHandler(async ({ request }) => {
  const data = formFn.toObject(await request.formData());
  return await ConversationService.createDialogue(data);
});

export const SingleUser = Object.assign(Component, { loader, action });
