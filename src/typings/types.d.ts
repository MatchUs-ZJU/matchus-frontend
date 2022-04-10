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

  currentParticipant: number,
  currentTerm: number,

  totalTerm: number,
  matched: number,
  unavailable: number,
}

export interface IParticipateState {
  state: 'NOT_ACTIVE' | 'ACTIVE' | 'SUCCESS' | 'FAILED'

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
  }

  choose: {
    state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
    choice: boolean,
    message: string,
    hasResult: boolean,
    chooseResult: boolean
  }
}
