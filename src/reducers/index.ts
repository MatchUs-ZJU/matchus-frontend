import { combineReducers } from 'redux'
import counter from './counter'
import user from "./user";
import global from "./global"
import home from "./home";

export default combineReducers({
  counter, user, global, home
})
