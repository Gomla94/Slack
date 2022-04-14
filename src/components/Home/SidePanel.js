import React from "react";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import UserPanel from "./UserPanel";

const SidePanel = (props) => {
  return (
    <div className="user-channels-wrapper">
      <UserPanel authenticatedUser={props.authenticatedUser} />
      <Channels authenticatedUser={props.authenticatedUser} />
      <DirectMessages authenticatedUser={props.authenticatedUser} />
    </div>
  );
};

export default SidePanel;
