import {USER_LOGOUT, USER_SAVE} from "../constants";

export const logout = () => {
  return {
    type: USER_LOGOUT
  }
}

export const saveUserInfo = (payload) => {
  return {
    type: USER_SAVE,
    payload
  }
}
