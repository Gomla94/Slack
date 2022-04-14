import React, { useEffect, useRef } from "react";

const MessagesContainer = (props) => {
  const scrollEndRef = useRef(null);

  const scrollToBottom = () => {
    scrollEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [props.messages]);

  const renderMessages = () => {
    return props.messages;
  };
  return (
    <div className="messages-container">
      {renderMessages()}
      <div ref={scrollEndRef}></div>
    </div>
  );
};

export default MessagesContainer;
