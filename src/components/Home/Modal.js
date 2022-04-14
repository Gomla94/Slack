import React, { Fragment, useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "../../firebase";

const Modal = (props) => {
  const changeModalHandler = () => {
    props.setOpenModal(false);
  };

  const [channelDetails, setChannelDetails] = useState({
    channels: [],
    channelName: "",
    channelDescription: "",
  });

  const inputChangeHandler = (e) => {
    setChannelDetails({ ...channelDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { channelName, channelDescription } = channelDetails;
    if (isFormValid(channelName, channelDescription)) {
      const channel = {
        createdBy: {
          name: props.authenticatedUser.displayName,
          avatar: props.authenticatedUser.photoURL,
        },
        id: Date.now(),
        name: channelName,
        description: channelDescription,
        isPrivate: false,
      };
      try {
        await set(ref(database, `/channels/${channel.id}`), channel);
        setChannelDetails({
          ...channelDetails,
          channelName: "",
          channelDescription: "",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const isFormValid = (channelName, channelDescription) => {
    return channelName && channelDescription;
  };

  return props.openModal ? (
    <Fragment>
      <div className="modal-container"></div>
      <div className="modal-wrapper">
        <div className="close-modal-wrapper" onClick={changeModalHandler}>
          <i className="fa-solid fa-xmark fa-2x"></i>
        </div>
        <div className="add-channel-header">Add New Channel</div>
        <div className="modal-form-wrapper">
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className="form-group">
              <label htmlFor="channel-name">Channel Name</label>
              <input
                className="form-control"
                name="channelName"
                placeholder="Channel Name"
                onChange={(e) => {
                  inputChangeHandler(e);
                }}
                value={channelDetails.channelName}
              />
            </div>
            <div className="form-group">
              <label htmlFor="channel-description">Channel Description</label>
              <input
                className="form-control"
                name="channelDescription"
                placeholder="Channel Description"
                onChange={(e) => {
                  inputChangeHandler(e);
                }}
                value={channelDetails.channelDescription}
              />
            </div>
            <div className="modal-buttons-wrapper">
              <button
                type="button"
                onClick={(e) => {
                  handleSubmit(e);
                }}
                className="submit-btn"
              >
                Submit
              </button>
              <button
                type="button"
                className="close-btn"
                onClick={(e) => {
                  changeModalHandler(e);
                }}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  ) : (
    ""
  );
};

export default Modal;
