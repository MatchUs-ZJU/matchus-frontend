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
  signUpEndTime: number,

  currentParticipant: number,
  totalParticipant: number,

  term: number,
  matched: number,
  unavailable: number,
}
