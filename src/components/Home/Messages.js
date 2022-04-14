import React, { useState, useEffect } from "react";
import MessagesContainer from "./MessagesContainer";
import MessagesForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";
import {
  ref,
  off,
  getDatabase,
  onChildAdded,
  onValue,
} from "firebase/database";
import { connect } from "react-redux";
import Message from "./Message";

const Messages = (props) => {
  const [messages, setMessages] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [uniqueUsersCount, setUniqueUsersCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadMessages();
  }, [props.channel.currentChannel]);

  useEffect(() => {
    countUniqueUsers(messages);
  }, [messages]);

  useEffect(() => {
    if (searchLoading) {
      handleSearchMessages();
      setTimeout(() => {
        setSearchLoading(false);
      }, 1000);
    }
  }, [searchTerm]);

  const displayChannelName = (channel) => {
    return currentChannel
      ? `${props.isPrivateChannel ? "@" : "#"} ${channel.name} `
      : "";
  };

  const countUniqueUsers = (loadedMessages) => {
    const countUsers = loadedMessages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);

    const plural = countUsers.length > 1 || countUsers.length === 0;
    setUniqueUsersCount(`${countUsers.length} user${plural ? "s" : ""}`);
  };

  const loadMessages = () => {
    let fetchedMessages = [];
    if (props.channel.currentChannel) {
      setCurrentChannel(props.currentChannel.currentChannel.name);
      const db = getDatabase();
      const messagesRef = ref(db, `${getMessagesRef()}`);
      onValue(messagesRef, (snapshot) => {
        if (snapshot.val() === null) {
          console.log("here");
          setMessages([]);
        }
      });
      onChildAdded(messagesRef, (snapshot) => {
        const data = snapshot.val();
        fetchedMessages.push(data);
        setMessages([...fetchedMessages]);
      });

      return () => {
        off(db);
      };
    }
  };

  const getMessagesRef = () => {
    if (props.channel.currentChannel) {
      const messagesRef = `messages/${props.channel.currentChannel.id}`;

      const privateMessagesRef = `privateMessages/${props.channel.currentChannel.id}`;
      return props.isPrivateChannel ? privateMessagesRef : messagesRef;
    }
  };

  const handleSearchMessages = () => {
    const loadedMessages = [...messages];
    const regex = new RegExp(searchTerm, "gi");
    const searchResults = loadedMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);

    setSearchResults([...searchResults]);
  };

  const handleSearchChange = (value) => {
    setSearchLoading(true);
    setSearchTerm(value);
  };

  const displayMessages = (data) => {
    if (data) {
      return data.map((item, index) => {
        return (
          <Message currentUser={props.currentUser} message={item} key={index} />
        );
      });
    }
  };

  return (
    <div className="messages-wrapper">
      <MessagesHeader
        currentChannel={displayChannelName(props.channel.currentChannel)}
        uniqueUsersCount={uniqueUsersCount}
        handleSearchChange={handleSearchChange}
        searchLoading={searchLoading}
      />
      <MessagesContainer
        messages={
          searchTerm
            ? displayMessages(searchResults)
            : displayMessages(messages)
        }
        currentUser={props.currentUser}
      />
      <MessagesForm
        currentUser={props.currentUser}
        currentChannel={props.channel}
        isPrivateChannel={props.isPrivateChannel}
        messagesRef={getMessagesRef()}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { channel: state.channel };
};

export default connect(mapStateToProps)(Messages);
