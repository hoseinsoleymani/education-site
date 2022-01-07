import React, { useState, useRef } from "react";
import SimpleReactValidator from "simple-react-validator";
import { Sugar } from "react-preloaders";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../services/userService";
import { toast } from "react-toastify";
import Helmet from "react-helmet";
import { useDispatch } from "react-redux";
import { addUser } from "./../../actions/user";
import { decodeToken } from "./../../utils/decodeToken";

const Login = ({ history }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [, forceUpdate] = useState();

  const validator = useRef(
    new SimpleReactValidator({
      messages: {
        required: "پر کردن این فیلد الزامی میباشد",
        min: "کمتر از 5 کاراکتر نباید باشد",
        email: "ایمیل نوشته شده صحیح نمی باشد",
      },
      element: (message) => <div style={{ color: "red" }}>{message}</div>,
    })
  );

  const reset = () => {
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = { email, password };

    try {
      if (validator.current.allValid()) {
        setLoading(true);
        const { status, data } = await loginUser(user);
        if (status === 200) {
          toast.success("ورود موفقیت آمیز بود.", {
            position: "top-right",
            closeOnClick: true,
          });
          localStorage.setItem("token", data.token);
          dispatch(addUser(decodeToken(data.token).payload.user));
          setLoading(false);
          history.replace("/");
          reset();
        }
      } else {
        validator.current.showMessages();

        forceUpdate(1);
      }
    } catch (ex) {
      console.log(ex);
      setLoading(false);
      toast.error("مشکلی پیش آمده.", {
        position: "top-right",
        closeOnClick: true,
      });
    }
  };

  return (
    <main className="client-page">
      <div className="container-content">
        <header>
          <h2> ورود به سایت </h2>
        </header>
        <Helmet>
          <title>تاپلرن | ورود به سایت</title>
        </Helmet>

        <div className="form-layer">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-group-addon" id="email-address">
                <i className="zmdi zmdi-email"></i>
              </span>
              <input
                type="text"
                name="email"
                className="form-control"
                placeholder="ایمیل"
                aria-describedby="email-address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validator.current.showMessageFor("email");
                }}
              />
              {validator.current.message("email", email, "required|email")}
            </div>

            <div className="input-group">
              <span className="input-group-addon" id="password">
                <i className="zmdi zmdi-lock"></i>
              </span>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="رمز عبور "
                aria-describedby="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validator.current.showMessageFor("password");
                }}
              />
              {validator.current.message(
                "password",
                password,
                "required|min:5"
              )}
            </div>

            <div className="remember-me">
              <label>
                <input type="checkbox" name="" /> مرا بخاطر بسپار{" "}
              </label>
            </div>

            <div className="link">
              <a href="">
                {" "}
                <i className="zmdi zmdi-lock"></i> رمز عبور خود را فراموش کرده
                ام !
              </a>
              <a href="">
                {" "}
                <i className="zmdi zmdi-account"></i> عضویت در سایت{" "}
              </a>
            </div>

            <button className="btn btn-success"> ورود به سایت </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default withRouter(Login);
