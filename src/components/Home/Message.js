import React, { Fragment } from "react";
import moment from "moment";

const Message = (props) => {
  const { message } = props;
  const checkMessageOwner = (item) => {
    return item.user.id !== props.currentUser.currentUser.uid
      ? "others-message"
      : "";
  };

  const messageContent = (item) => {
    return item.hasOwnProperty("imageURL") ? (
      <img className="message-image" src={item.imageURL} />
    ) : (
      <p>{item.content}</p>
    );
  };

  const renderMessages = () => {
    if (message) {
      return (
        <div className="message-wrapper">
          <div className="message-image-wrapper">
            <img src={message.user.avatar} alt="image" />
          </div>
          <div
            className={`message-content-wrapper ${checkMessageOwner(message)}`}
          >
            <div className="message-info-wrapper">
              <span className="message-user-name">{message.user.name}</span>
              <span className="message-time">
                {moment(message.timestamp).fromNow()}
              </span>
            </div>
            <div className="">{messageContent(message)}</div>
          </div>
        </div>
      );
    }
  };
  return <Fragment>{renderMessages()}</Fragment>;
};

export default Message;
