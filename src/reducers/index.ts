import { combineReducers } from 'redux'
import user from "./user";
import global from "./global"
import home from "./home";
import activity from "./activity";

export default combineReducers({
  user, global, home, activity
})
