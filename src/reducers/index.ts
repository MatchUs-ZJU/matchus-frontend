import { combineReducers } from 'redux'
import user from "./user";
import global from "./global"
import home from "./home";
import activity from "./activity";
import resource from "./resource";

export default combineReducers({
  user, global, home, activity, resource
})
