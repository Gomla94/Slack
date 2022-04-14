import React from "react";
import SidePanel from "./Home/SidePanel";
import Messages from "./Home/Messages";
import { connect } from "react-redux";

const Home = (props) => {
  return (
    <div id="home-wrapper">
      <div className="color-side-panel-wrapper">
        <SidePanel authenticatedUser={props.currentUser.currentUser} />
      </div>
      <div className="messages-meta-panel-wrapper">
        <Messages
          currentUser={props.currentUser}
          currentChannel={props.currentChannel}
          isPrivateChannel={props.currentChannel.isPrivateChannel}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { currentUser: state.user, currentChannel: state.channel };
};

export default connect(mapStateToProps)(Home);
