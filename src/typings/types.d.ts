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
    filled: boolean
  };

  match: {
    state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
    matchResult: boolean,
    favor: number,
    lastChoose: number,
    left: number,
    refund: boolean,
    message: number
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
