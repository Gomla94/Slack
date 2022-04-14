import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { connect } from "react-redux";
import { setUserAction } from "../../actions/setUserAction";
import { signoutUserAction } from "../../actions/signoutAction";
import { setUserFalseAction } from "../../actions/setUserFalse";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

import LoadingSpinner from "../LoadingSpinner";

const Login = (props) => {
  const navigator = useNavigate();
  useEffect(() => {
    const authentication = getAuth();
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        props.setUserAction(user);
        navigator("/");
      } else {
        setTimeout(() => {
          props.setUserFalseAction();
        }, 500);
      }
    });
    return () => {
      return false;
    };
  }, []);
  const [formInputs, setFormInputs] = useState({
    email: "",
    password: "",
    errors: [],
    loader: false,
  });

  const isEmptyForm = () => {
    return !formInputs.email.length || !formInputs.password.length;
  };

  const isInValidPassword = () => {
    if (formInputs.password.length < 6) {
      return true;
    } else {
      setFormInputs({ ...formInputs, errors: [] });
      return false;
    }
  };

  const displayErrors = (errors) => {
    return errors.map((item, i) => {
      return (
        <p key={i} className="error-message">
          {item.message}
        </p>
      );
    });
  };

  const isValidForm = () => {
    let errors = [];
    let error = "";
    if (isEmptyForm(formInputs)) {
      error = { message: "please fill in all inputs" };
      setFormInputs({ ...formInputs, errors: errors.concat(error) });
      return false;
    } else if (isInValidPassword()) {
      error = { message: "invalid password" };
      setFormInputs({ ...formInputs, errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  const displayInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? "error-input"
      : "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isValidForm()) {
      const email = event.target.email.value;
      const password = event.target.password.value;

      const authentication = getAuth();
      try {
        const authUser = await signInWithEmailAndPassword(
          authentication,
          email,
          password
        );
      } catch (err) {
        console.log(err);
        let errors = [];
        let error = { message: err.code };
        setFormInputs({
          ...formInputs,
          errors: errors.concat(error),
          loader: false,
        });
      }
    }
  };

  if (props.user.currentUser == null) {
    return <LoadingSpinner />;
  } else {
    return (
      <div className="register-wrapper">
        <header id="register-header-section">
          <i className="fa-solid fa-puzzle-piece fa-4x"></i>
          <p>Login Into Slack</p>
        </header>
        <div className="register-container">
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className="register-form"
          >
            <div className="form-group">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="text"
                onChange={(e) => {
                  setFormInputs({ ...formInputs, email: e.target.value });
                }}
                name="email"
                placeholder="Email"
                className={displayInputError(formInputs.errors, "email")}
              />
            </div>
            <div className="form-group">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setFormInputs({ ...formInputs, password: e.target.value });
                }}
                name="password"
                className={displayInputError(formInputs.errors, "password")}
              />
            </div>

            <button
              disabled={formInputs.loader}
              className={`register-button ${
                formInputs.loader ? "disabled" : ""
              }`}
            >
              {formInputs.loader ? (
                <i className="fa fa-spinner fa-spin"></i>
              ) : (
                ""
              )}
              Login
            </button>
          </form>
          <div className="already-user">
            <span>Don't have an account?</span>
            <Link to="/register">Register</Link>
          </div>
          {formInputs.errors.length > 0 && (
            <div className="errors">{displayErrors(formInputs.errors)}</div>
          )}
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, {
  setUserAction,
  signoutUserAction,
  setUserFalseAction,
})(Login);
