import * as actionTypes from "../actions/types";

const initialChannel = {
  currentChannel: null,
  isPrivateChannel: false,
  activeChannelId: null,
};

export const set_current_channel_reducer = (state = initialChannel, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL_ACTION_TYPE:
      return {
        ...state,
        currentChannel: action.payload.currentChannel,
        activeChannelId: action.payload.activeChannelId,
      };

    case actionTypes.SET_PRIVATE_CHANNEL_ACTION_TYPE:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel,
      };
    default:
      return state;
  }
};
