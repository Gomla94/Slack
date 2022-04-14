import React, { Fragment, useEffect, useState } from "react";
import Modal from "./Modal";
import { getDatabase, onChildAdded, ref } from "firebase/database";
import { connect } from "react-redux";
import { setCurrentChannelAction } from "../../actions/setCurrentChannelAction";
import { setPrivateChannelAction } from "../../actions/setPrivateChannelAction";
import Channel from "./Channel";

const Channels = (props) => {
  const [channels, setChannels] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const changeModalStatus = () => {
    setOpenModal((prevValue) => !prevValue);
  };

  useEffect(() => {
    if (firstLoad && channels.length > 0) {
      const firstChannel = channels[0];
      props.setCurrentChannelAction(firstChannel);
      setFirstLoad(false);
    }
  }, [channels]);

  useEffect(() => {
    const channels = [];
    const db = getDatabase();
    const starCountRef = ref(db, "channels/");
    onChildAdded(starCountRef, (snapshot) => {
      const data = snapshot.val();
      channels.push(data);
      setChannels([...channels]);
    });
  }, []);

  const changeCurrentChannel = (channel) => {
    props.setCurrentChannelAction(channel);
    props.setPrivateChannelAction(false);
  };

  const showChannels = (channels) => {
    return channels.map((item, index) => {
      return (
        <Channel
          item={item}
          key={index}
          changeCurrentChannel={() => {
            changeCurrentChannel(item);
          }}
          activeChannelId={props.channel.activeChannelId}
        />
      );
    });
  };

  return (
    <Fragment>
      <div className="channels-wrapper">
        <div className="channels-container">
          <div className="channels-count-container">
            <div className="count-container">
              <i className="fa-solid fa-arrow-right-arrow-left exchange-icon"></i>
              <span> Channels ({channels.length})</span>
            </div>
            <i className="fa-solid fa-plus" onClick={changeModalStatus}></i>
          </div>
        </div>

        <div className="channels-list">
          {channels.length > 0 && showChannels(channels)}
        </div>
      </div>
      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        authenticatedUser={props.authenticatedUser}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return { channel: state.channel };
};

export default connect(mapStateToProps, {
  setCurrentChannelAction,
  setPrivateChannelAction,
})(Channels);
