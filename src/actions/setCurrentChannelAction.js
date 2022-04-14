import * as actionTypes from "./types";

export const setCurrentChannelAction = (channel) => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL_ACTION_TYPE,
    payload: {
      currentChannel: channel,
      activeChannelId: channel.id,
    },
  };
};
