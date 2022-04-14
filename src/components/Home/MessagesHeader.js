import React from "react";
import { Input } from "semantic-ui-react";

const MessagesHeader = (props) => {
  const { currentChannel } = props;
  const { uniqueUsersCount } = props;
  const { handleSearchChange } = props;
  const { searchLoading } = props;

  return (
    <div className="messages-header">
      <div className="channel-name-users-count">
        <div className="channel-name">
          <p>{currentChannel}</p>
        </div>
        <div className="channel-users-count-wrapper">
          <p>{uniqueUsersCount}</p>
        </div>
      </div>

      <Input
        onChange={(event) => {
          handleSearchChange(event.target.value);
        }}
        name="message"
        type="text"
        placeholder="Search message"
        icon="search"
        loading={searchLoading}
      />
    </div>
  );
};

export default MessagesHeader;
