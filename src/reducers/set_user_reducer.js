import * as actionTypes from "../actions/types";

const initialUser = {
  currentUser: null,
  isLoading: true,
};

export const set_user_reducer = (state = initialUser, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_ACTION_TYPE:
      return {
        currentUser: action.payload.currentUser,
        isLoading: true,
      };
    case actionTypes.SIGN_OUT_ACTION_TYPE:
      return {
        ...state,
        isLoading: false,
      };

    case actionTypes.SET_USER_FALSE_ACTION_TYPE:
      return {
        currentUser: action.payload,
      };

    default:
      return state;
  }
};
