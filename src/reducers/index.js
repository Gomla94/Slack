import { combineReducers } from "redux";
import { set_user_reducer } from "./set_user_reducer";
import { set_current_channel_reducer } from "./set_curent_channel_reducer";

export default combineReducers({
  user: set_user_reducer,
  channel: set_current_channel_reducer,
});
