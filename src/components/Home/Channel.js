import React from "react";
import { connect } from "react-redux";

const Channel = (props) => {
  const { changeCurrentChannel, item, activeChannelId } = props;

  return (
    <span
      key={item.id}
      onClick={() => {
        changeCurrentChannel(item);
      }}
      className={item.id === activeChannelId ? "active-channel" : ""}
    >
      # {item.name}
    </span>
  );
};

const mapStateToProps = (state) => {
  return { channel: state.channel };
};

export default connect(mapStateToProps, null)(Channel);
