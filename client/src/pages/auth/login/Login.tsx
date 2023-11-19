import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CstmInput, CustomBtn } from "components/forms";
import { formFn, routeActionHandler } from "helpers";
import { FormEventHandler, useState } from "react";
import {
  Link,
  redirect,
  useFormAction,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import instance from "request/api";
import "./login.css";
import { AuthService } from "request/services";

const Component = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const action = useFormAction();
  const { state } = useNavigation();
  const submit = useSubmit();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    submit(formFn.toFormData({ ...values, role: "sign-in" }), {
      action,
      encType: "multipart/form-data",
      method: "post",
    });
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="lContainer">
        <CstmInput
          name="username"
          autoFocus
          value={values.username}
          placeholder="username"
          onChange={(e) =>
            setValues((p) => ({ ...p, username: e.target.value }))
          }
          autoComplete="username"
        />
        <CstmInput
          name="password"
          value={values.password}
          type="password"
          placeholder="password"
          onChange={(e) =>
            setValues((p) => ({ ...p, password: e.target.value }))
          }
          autoComplete="current-password"
        />
        <CustomBtn disabled={state !== "idle"} type="submit">
          Login
        </CustomBtn>
        <Link
          className="text-blue-600 underline"
          style={{ textAlign: "end" }}
          to={"/auth/register"}
        >
          Register?
        </Link>
        <CustomBtn
          type="button"
          className="border border-black/30 !bg-white text-black flex items-center gap-3 justify-center"
          onClick={() => {
            submit(formFn.toFormData({ role: "passport" }), {
              action,
              encType: "multipart/form-data",
              method: "post",
            });
          }}
        >
          <FontAwesomeIcon icon={faGoogle} color="#0071C2" />
          <span>Sign In by Google</span>
        </CustomBtn>
      </form>
    </div>
  );
};

const loader = routeActionHandler(async () => {
  const res = await instance.get("auth/google/success");
  // return redirect("/");
  return res;
});

const action = routeActionHandler(async ({ request }) => {
  const formData = await request.formData();
  const formValues = formFn.toObject(formData);

  switch (formValues?.role) {
    case "sign-in": {
      return await AuthService.login(formValues);
    }
    case "passport": {
      window.open(`${process.env.REACT_APP_API_URL}auth/google`, "_self");
      return redirect(`${process.env.REACT_APP_API_URL}auth/google`);
    }
    default:
      return null;
  }
});

export const Login = Object.assign(Component, { action, loader });
