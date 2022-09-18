import {USER_SAVE, USER_IMAGE_SAVE, USER_PERSONINFO_SAVE, USER_IMAGE_DELETE} from "@/constants";
import {IPersonInfo, IPhotoUrls, ISurveyInfo} from "@/typings/types";

export interface IUserState {
  nickName: string;
  realName: string;
  id: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  language: string;
  identified: '未认证' | '认证成功' | '认证失败' | '认证中';
  userType: number;
  school: string;
  studentNumber: string;

  purePhoneNumber: string;
  phoneNumber: string;
  countryCode: string;

  faculty: string;
  createTime: number;
  material: {url:string};
  openid: string;
  sessionKey: string;
  binded: boolean;

  lucky: number;
  luckyPercent: number;
  matchTimes: number;
  matchSuccessTimes: number;

  login: boolean;
  receivedData: boolean;
  needUpdate:boolean;
  needRead: boolean;

  images: IPhotoUrls[];
  personInfo?: IPersonInfo;
  isComplete: boolean;
  isChangeable: boolean;
  isOldUser: boolean;
  surveyInfo?: ISurveyInfo;
}

const INITIAL_STATE: IUserState = {
  luckyPercent: 0,
  lucky: 0,
  matchSuccessTimes: 0,
  matchTimes: 0,
  binded: false,
  createTime: 0,
  openid: "",
  sessionKey: "",
  countryCode: "",
  purePhoneNumber: "",
  phoneNumber: "",
  faculty: "",
  studentNumber: "",
  avatarUrl: "",
  country: "",
  gender: 0,
  language: "",
  province: "",
  realName: "",
  material: {
      url: '',
    },
  id: "",
  identified: '未认证',
  login: false,
  receivedData: false,
  needUpdate:false,
  needRead:false,
  nickName: "",
  school: "",
  userType: 0,
  images: [],
  isComplete: true,
  isChangeable: true,
  isOldUser: false
}

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_SAVE:
      return {
        ...state,
        ...action.payload
      }
    case USER_IMAGE_DELETE:
      return {
        ...state,
        images: [...state.images.filter(item => action.payload.delete && item.imageUrl !== action.payload.imageUrl)]
      }
    case USER_IMAGE_SAVE:
      return {
        ...state,
        ...action.payload
      }
    case USER_PERSONINFO_SAVE:
      return {
        ...state,
        personInfo: {...state.personInfo, ...action.payload}
      }
    default:
      return state
  }
}
