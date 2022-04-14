import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ref, set } from "firebase/database";
import { database } from "../../firebase";
import { connect } from "react-redux";
import { setUserAction } from "../../actions/setUserAction";
import { useNavigate } from "react-router";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const Register = (props) => {
  const navigator = useNavigate();

  const [formInputs, setFormInputs] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loader: false,
    successMessage: "",
  });

  const isEmptyForm = () => {
    return (
      !formInputs.username.length ||
      !formInputs.email.length ||
      !formInputs.password.length ||
      !formInputs.passwordConfirmation.length
    );
  };

  const isInValidPassword = () => {
    if (formInputs.password.length < 6) {
      return true;
    } else if (formInputs.password !== formInputs.passwordConfirmation) {
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
      const username = event.target.username.value;
      const email = event.target.email.value;
      const password = event.target.password.value;
      const passwordConfirmation = event.target.passwordConfirmation.value;
      setFormInputs({
        ...formInputs,
        username,
        email,
        password,
        passwordConfirmation,
        errors: [],
        loader: true,
      });

      const authentication = getAuth();
      try {
        const createdUser = await createUserWithEmailAndPassword(
          authentication,
          email,
          password
        );
        console.log(createdUser);
        if (createdUser) {
          await updateProfile(createdUser.user, {
            displayName: formInputs.username,
            photoURL: `https://ui-avatars.com/api/?name=${username}`,
          });
          saveUser(createdUser);
          props.setUserAction(createdUser.user);
          navigator("/");
        }
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

  const saveUser = (createdUser) => {
    set(ref(database, `/users/${createdUser.user.uid}`), {
      displayName: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };

  return (
    <div className="register-wrapper">
      <header id="register-header-section">
        <i className="fa-solid fa-puzzle-piece fa-4x"></i>
        <p>Register Into Slack</p>
      </header>
      <div className="register-container">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="register-form"
        >
          <div className="form-group">
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              onChange={(e) => {
                setFormInputs({ ...formInputs, username: e.target.value });
              }}
              value={formInputs.username}
              name="username"
              placeholder="Username"
              className={displayInputError(formInputs.errors, "username")}
            />
          </div>
          <div className="form-group">
            <i className="fa-solid fa-envelope"></i>
            <input
              type="text"
              onChange={(e) => {
                setFormInputs({ ...formInputs, email: e.target.value });
              }}
              value={formInputs.email}
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
              value={formInputs.password}
              name="password"
              className={displayInputError(formInputs.errors, "password")}
            />
          </div>
          <div className="form-group">
            <i className="fa-solid fa-arrow-rotate-right"></i>
            <input
              type="password"
              onChange={(e) => {
                setFormInputs({
                  ...formInputs,
                  passwordConfirmation: e.target.value,
                });
              }}
              value={formInputs.passwordConfirmation}
              placeholder="Password Confirmation"
              name="passwordConfirmation"
              className={displayInputError(formInputs.errors, "password")}
            />
          </div>
          <button
            disabled={formInputs.loader}
            className={`register-button ${formInputs.loader ? "disabled" : ""}`}
          >
            {formInputs.loader ? <i className="fa fa-spinner fa-spin"></i> : ""}
            Register
          </button>
        </form>
        <div className="already-user">
          <span>Already a user?</span>
          <Link to="/login">Login</Link>
        </div>
        {formInputs.errors.length > 0 && (
          <div className="errors">{displayErrors(formInputs.errors)}</div>
        )}
      </div>
    </div>
  );
};

// export default Register;
const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, {
  setUserAction,
})(Register);
