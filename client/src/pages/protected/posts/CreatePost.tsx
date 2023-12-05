import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CstmTextarea, CustomBtn } from "components/forms";
import { formFn, routeActionHandler } from "helpers";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  redirect,
  useActionData,
  useFormAction,
  useSubmit,
} from "react-router-dom";

import { Container } from "components/reusable";
import { useId } from "react";
import { PostService } from "request/services";

import plus_img from "assets/images/plus.png";
import { AxiosResponse } from "axios";
import { IPost } from "types";
import path from "path";

const Component = () => {
  const submit = useSubmit();
  const action = useFormAction();
  const fileId = useId();
  const actionData = useActionData() as AxiosResponse<IPost>;

  const [submited, setSubmited] = useState(false);
  const [values, setValues] = useState({
    desc: "",
    img: null! as File,
  });
  const [errors, setErrors] = useState({
    desc: false,
    img: false,
  });

  const fileActionHandler = useCallback(
    (node: HTMLInputElement) => {
      if (!values?.img && !!node?.files?.length) {
        node.files = new DataTransfer().files;
      }
    },
    [values?.img]
  );

  const handlSubmit = (e: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setSubmited(true);
    if (!values.img) {
      setErrors((p) => ({ ...p, img: true }));
    } else {
      submit(formFn.toFormData({ ...values }), {
        action,
        method: "put",
        encType: "multipart/form-data",
      });
    }
  };

  useEffect(() => {
    if (actionData?.status === 200) {
      setSubmited(false);
      setErrors({ desc: false, img: false });
      setValues({ desc: "", img: null! });
    }
  }, [actionData]);

  useEffect(() => {
    if (submited) setErrors((p) => ({ ...p, img: !values.img }));
  }, [values.img, submited]);

  return (
    <Container className="md:!px-0">
      <form onSubmit={handlSubmit} className="flex flex-col gap-5 md:gap-2">
        <div className="relative w-fit">
          <img
            src={values?.img ? URL.createObjectURL(values?.img) : plus_img}
            alt=""
            className="w-[200px] h-[200px] object-fill rounded shrink-0"
          />
          <div className="flex flex-col">
            <label className="absolute top-3 right-3" htmlFor={fileId}>
              <input
                onChange={(e) =>
                  setValues((p) => ({ ...p, img: e.target.files?.[0]! }))
                }
                ref={fileActionHandler}
                type="file"
                id={fileId}
                accept="image/*"
                hidden
              />
              <FontAwesomeIcon
                icon={faEdit}
                className="cursor-pointer bg-white p-0.5"
              />
            </label>
          </div>
          {errors.img && (
            <span className="text-red-600 text-center">Image is Required!</span>
          )}
        </div>
        <CstmTextarea
          onChange={(e) => setValues((p) => ({ ...p, desc: e?.target?.value }))}
          value={values?.desc}
          placeholder="Description"
        />

        <CustomBtn type="submit" className="w-fit md:w-full">
          Create Post
        </CustomBtn>
      </form>
    </Container>
  );
};

const action = routeActionHandler(async ({ data }) => {
  const res = await PostService.create(data);
  return redirect(`/posts/${res.data._id!}`);
}, true);

export const CreatePost = Object.assign(Component, { action });
