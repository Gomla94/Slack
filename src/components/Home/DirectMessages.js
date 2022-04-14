import React, { Fragment, useEffect, useState, useRef } from "react";
import { ref, getDatabase, onChildAdded } from "firebase/database";

import { connect } from "react-redux";
import { setCurrentChannelAction } from "../../actions/setCurrentChannelAction";
import { setPrivateChannelAction } from "../../actions/setPrivateChannelAction";

const DirectMessages = (props) => {
  const { authenticatedUser } = props;
  const [users, setUsers] = useState([]);
  const prevUsers = useRef([]);
  const [activeChannel, setActiveChannel] = useState(null);

  useEffect(() => {
    if (authenticatedUser !== null) {
      addListeners(authenticatedUser.uid);
    }
    return () => {
      return false;
    };
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      prevUsers.current = users;
    }
    return () => {
      return false;
    };
  }, [users]);

  const addListeners = (userId) => {
    let loadedUsers = [];
    const db = getDatabase();
    const usersCountRef = ref(db, `users`);
    // const connectedStatusRef = ref(db, `.info/connected`);
    // const randomPresenceRef = ref(db, `presence`);
    // const PresenceRef = ref(db, `presence/${userId}`);
    onChildAdded(usersCountRef, (snapshot) => {
      const uid = snapshot.key;
      if (uid !== userId) {
        const user = snapshot.val();
        user["status"] = "offline";
        user["uid"] = uid;
        loadedUsers.push(user);
        setUsers([...loadedUsers]);
      }
    });

    // onValue(connectedStatusRef, (snapshot) => {
    //   if (snapshot.val() === true) {
    //     set(ref(db, `presence/${userId}`), true);
    //     onDisconnect(PresenceRef).remove();
    //   }
    // });

    // onChildAdded(randomPresenceRef, (snapshot) => {
    //   if (userId !== snapshot.key) {
    //     addStatusToUser(snapshot.key);
    //   }
    // });

    // onChildRemoved(randomPresenceRef, (snapshot) => {
    //   if (userId !== snapshot.key) {
    //     addStatusToUser(snapshot.key, false);
    //   }
    // });
  };

  // const addStatusToUser = (uid, status = true) => {
  //   const updatedUsers = prevUsers.current.reduce((acc, user) => {
  //     if (user.uid === uid) {
  //       user["status"] = `${status ? "online" : "offline"}`;
  //     }

  //     return acc.concat(user);
  //   }, []);

  //   setUsers([...updatedUsers]);
  // };

  // const isOnlineStatus = (user) => {
  //   return user.status === "online";
  // };

  const renderUsers = (users) => {
    return users.map((user, index) => {
      return (
        <div
          key={index}
          className={`direct-user-wrapper ${
            user.uid === activeChannel ? "active-channel" : ""
          }`}
          onClick={(e) => {
            changeCurrentChannel(user);
          }}
        >
          <span>{user.displayName}</span>
          {/* <span>
            {isOnlineStatus(user) ? (
              <div className="online-status"></div>
            ) : (
              <div className="offline-status"></div>
            )}
          </span> */}
        </div>
      );
    });
  };

  const changeCurrentChannel = (user) => {
    const channelId = getChannelId(user.uid);
    setActiveChannel(user.uid);

    const channelInfo = {
      id: channelId,
      name: user.displayName,
    };
    props.setCurrentChannelAction(channelInfo);
    props.setPrivateChannelAction(true);
  };

  const getChannelId = (userId) => {
    const currentUserId = authenticatedUser.uid;
    return userId < currentUserId
      ? `${authenticatedUser.uid}/${userId}`
      : `${userId}/${currentUserId}`;
  };

  return (
    <Fragment>
      <div className="users-wrapper">
        <div className="users-container">
          <div className="users-count-container">
            <div className="users-container">
              <i className="fa-solid fa-envelope"></i>
              <span> Direct Messages ({users.length})</span>
            </div>
          </div>
        </div>

        <div className="users-list">{renderUsers(users)}</div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return { channel: state.channel };
};

export default connect(mapStateToProps, {
  setCurrentChannelAction,
  setPrivateChannelAction,
})(DirectMessages);
