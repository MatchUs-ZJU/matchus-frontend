import {USER_SAVE, USER_LOGOUT} from "../constants";

export interface IUserState {
  nickname: string;
  id: string;
  // anonymousAvatar?: string;
  avatar?: string;
  login: boolean;
  openid?: string;
  sessionKey?: string;

  school?: string;
  role: 'guest' | 'admin' | 'user' | 'root';
  identified?: boolean; // 是否完成认证
  binded: boolean;
}

const INITIAL_STATE: IUserState = {
  avatar: "",
  id: "",
  identified: false,
  login: false,
  nickname: "",
  role: "guest",
  school: "",
  binded: false
}

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_LOGOUT:
      return INITIAL_STATE
    case USER_SAVE:
      return {
        ...state, ...action.payload
      }
    default:
      return state
  }
}
