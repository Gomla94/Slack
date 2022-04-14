import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";

import { signoutUserAction } from "../../actions/signoutAction";
import { connect } from "react-redux";

const UserPanel = ({ authenticatedUser, signoutUserAction }) => {
  const [showList, setShowList] = useState(false);
  const handleSignout = () => {
    const authentication = getAuth();
    signOut(authentication).then(() => {
      signoutUserAction();
      window.location = "/login";
    });
  };
  return (
    <div id="userpanel-wrapper">
      <div className="userpanel-header">
        <p>React Slack Clone</p>
      </div>
      <div className="user-ddl">
        <div
          className="user-ddl-header"
          onClick={(e) => {
            setShowList(!showList);
          }}
        >
          <span>
            <img className="avatar" src={authenticatedUser.photoURL} />
            {authenticatedUser.displayName}
          </span>
          <i className="fa-solid fa-caret-down"></i>
        </div>
        {showList ? (
          <div className="user-ddl-list">
            <ul>
              <li>Signed in as {authenticatedUser.displayName}</li>
              <li>Change Avatar</li>
              <li
                onClick={() => {
                  handleSignout();
                }}
              >
                Sign out
              </li>
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { currentUser: state.user };
};

export default connect(mapStateToProps, { signoutUserAction })(UserPanel);
