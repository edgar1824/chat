import { inputNames_signup } from "constants/auth";
import {
  Form,
  Link,
  redirect,
  useFormAction,
  useNavigation,
} from "react-router-dom";
import { CstmInput, CustomBtn } from "components/forms";
import instance from "request/api";
import "./registeration.css";
import { routeActionHandler } from "helpers";
import { AuthService } from "request/services";

const Component = () => {
  const action = useFormAction();
  const { state } = useNavigation();

  return (
    <>
      <div className="registeration">
        <Form method="POST" target="" action={action} className="lContainer">
          {inputNames_signup.map((el, i) => (
            <CstmInput key={i} {...el} type={el?.type || "text"} />
          ))}
          <CustomBtn disabled={state !== "idle"} type="submit">
            Register
          </CustomBtn>

          <Link
            className="text-blue-600 underline"
            style={{ textAlign: "end" }}
            to={"/auth/login"}
          >
            Login?
          </Link>
        </Form>
      </div>
    </>
  );
};

const action = routeActionHandler(async ({ data }) => {
  try {
    await AuthService.register(data);
    return redirect("/");
  } catch (err) {
    return err;
  }
}, true);

export const Registeration = Object.assign(Component, { action });
