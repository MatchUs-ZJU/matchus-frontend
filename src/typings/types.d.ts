import { QUESTION_TYPE } from "@/utils/constant";

export interface IFaculty {
  id: string,
  name: string
}

export interface IQuestion {
  id: string
  question: string,
  answer: string,
}

export interface IResourceImage {
  contactUsUrl: string
  followUsUrl: string
}

export interface IArticle {
  id: number
  title: string,
  description: string,
  tag: string,
  date: number,
  image: string,

  url: string
}

export interface IBanner {
  id: number,
  image: string,
  shows: boolean,
  createTime: number
}

export interface IHomeData {
  startTime: number,
  endTime: number,
  signUpStartTime: number,
  signUpEndTime: number,

  currentParticipant: string, // 返回一个已经描述好的字符串
  currentTerm: number,

  totalTerm: number,
  matched: number,
  unavailable: number,
}

export interface IQuestionState {
  question: string,
  value: string,
  index: number,
  approval: boolean,
  id: number
}

export interface IApproval {
  index: number,
  approval: boolean
}

export interface IParticipateState {
  state: 'NOT_ACTIVE' | 'ACTIVE' | 'SUCCESS' | 'FAIL'

  signUp: {
    state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
    paid: boolean,
    participated: boolean
  };

  fillForm: {
    state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
    filled: boolean,
    percent: { total: number, answer: number },
    // isComplete: boolean
  };

  match: {
    state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
    matchResult: boolean,
    favor: number,
    lastChoose: number,
    left: number,
    refund: boolean,
    message: number,
    subscribe: boolean
  }

  dailyQuestion: {
    approval: IApproval[],
    before: IQuestionState,
    today: IQuestionState
  }

  choose: {
    state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
    choice: boolean,
    message: string,
    hasResult: boolean,
    chooseResult: boolean
  }
}

export interface IPersonInfo {
  id: number,
  userId: number,
  height: string,
  weight: string,
  physique: string,
  birth: string,
  wechatNumber: string,
  hometown: string,

  graduateEducation: string,
  graduateWorkLocation: string,
  graduateWorkDetail: string,
  oneYearStatus: string,
  currentSchoolStatus: string,
  schoolGraduateInSep: string,
  futureBase: IMultiChoice[],
  selfFutureBase: string,

  industry: IMultiChoice[],
  currentSchoolGrade: string,
  currentSchoolCampus: string,

  temperament: IMultiChoice[],

  interest: IMultiChoice[],
  exerciseFrequency: string,
  stayUpFrequency: string,
  drinkHabit: string,
  smokingHabit: string,
  discoHabit: string,


  takeDesire: string,
  loveHistory: string,
  graduateIncome: IMultiChoice[],
  consumption: IMultiChoice[],
  consumptionShare: string,
  mbti: string,

  superPower: string,
  emo: string,
  say: string,

  selfWechatFirstTime: string,
  wechatFirstTime: string,

  selfBeFrind: string,
  beFriend: string,

  selfShowLove: string,
  showLove: string,

  selfIsLover: string,
  isLover: string,

  selfIsLoveYou: string,
  isLoveYou: string

  createTime: number,
  updateTime: number
}

interface IDepend {
  id: number,
  questionId: number,
  dependQuestionId: number,
  dependOptionId: number
}

export interface IOption {
  id: number,
  questionId: number,
  choice: string,
  choiceIndex: number,
  label: string,
  selected: boolean
}

export interface IOptionalItem {
  questionId: number
  questionIndex: number,
  depends: IDepend[] | undefined,
  title: string,
  required: boolean,
  option: IOption[],
  answer?: string,
  properAnswer?: IOption[],
  rangeAnswer?: number[],
  questionType: QUESTION_TYPE,
  limit?: number,
  order: number,
  otherType?: 'input' | 'picker' | undefined
}

export interface ISpecialChoice {
  id: number,
  createTime: number,
  updateTime: number,
  questionId: number,
  choice: string,
  choiceIndex: number,
  checked: boolean,
}
export interface ISpecialItem {
  questionId: number,
  title: string,
  questionType: QUESTION_TYPE,
  limit?: number,
  index: number,
  choices: ISpecialChoice[],
  answer?: string,
}

export interface ISurveyDetail {
  noRequiredMax: number,
  noRequireMatchRequests: IOptionalItem[],
  requireMatchRequests: IOptionalItem[],
  specialRequests: ISpecialItem[]
}

export interface ISurveyInfo {
  survey: ISurveyItem[]
  images: string[],
  wjxAppId: string,
  wjxPath: string
}

export interface ISurveyItem {
  name: string
  updateTime: number
  info: ISurveyFields[]
}

export interface ISurveyFields {
  name: string,
  fields: ISurveyField[]
}

export interface ISurveyField {
  key: string,
  value: string,
  index: number,
  type: number // 数据类型枚举
}

export interface IPhotoUrls {
  id?: number,
  userId?: number,
  imageUrl: string,
  createTime?: string,
  updateTime?: string,
  delete?: boolean,
  tmpUrl?: string,
  maxAge?: number
}

export interface IMultiChoice {
  label: string
  selected: boolean
  // append?: string
}

export interface ISingleChoice {
  question: string,
  choices: string[],
  selfAnswer?: string
}

export interface IMatchCondition {
  index: number,
  condition: string,
  value: string,
  match_percent: number
}

export interface MatchFeedBackEnum {
  /**
   * 类型
   */
  code: number;
  /**
   * 描述
   */
  description: string;
}

export interface CoS {
  /**
     * cloudId
     */
  cloudId: string;
  /**
   * 创建时间
   */
  createTime: any[] | boolean | number | number | { [key: string]: any } | null | string;
  /**
   * 下载链接
   */
  downloadUrl: null | string;
  /**
   * id
   */
  id: number;
  /**
   * 用户id
   */
  userId: number;
}

export interface IMatchFeedback {
  /**
     * 活动id
     */
  activityId: number;
  /**
   * 用户上传的图像
   */
  images: CoS[];
  /**
   * 可选选项
   */
  options?: MatchFeedBackEnum[];
  /**
   * 用户选择的类型
   */
  type: MatchFeedBackEnum;
  /**
   * 用户id
   */
  userId: number;
}

export interface IMatchAnalysisState {
  match: number,
  matchSuccess: number,
  lucky: number,
  luckyAdd: number,
  conditions: IMatchCondition[]
}
