import {USER_SAVE} from "../constants";

export interface IUserState {
  nickName: string;
  realName: string;
  id: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  language:string;
  identified: number;
  school?: string;
  faculty?: string;
  createTime?: Date;

  openid?: string;
  sessionKey?: string;
  binded?: boolean;

  login: boolean;
}

const INITIAL_STATE: IUserState = {
  avatarUrl: "",
  country: "",
  gender: 0,
  language: "",
  province: "",
  realName: "",
  id: "",
  identified: 0,
  login: false,
  nickName: "",
  school: ""
}

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_SAVE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
