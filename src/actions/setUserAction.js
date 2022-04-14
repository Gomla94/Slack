import * as actionTypes from "./types";

export const setUserAction = (user) => {
  return {
    type: actionTypes.SET_USER_ACTION_TYPE,
    payload: {
      currentUser: user,
    },
  };
};
