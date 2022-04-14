import * as actionTypes from "./types";

export const setPrivateChannelAction = (isPrivateChannel) => {
  return {
    type: actionTypes.SET_PRIVATE_CHANNEL_ACTION_TYPE,
    payload: {
      isPrivateChannel,
    },
  };
};
