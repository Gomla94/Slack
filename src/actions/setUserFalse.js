import * as actionTypes from "./types";

export const setUserFalseAction = () => {
  return {
    type: actionTypes.SET_USER_FALSE_ACTION_TYPE,
    payload: false,
  };
};
