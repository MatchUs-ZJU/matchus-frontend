export interface IArticle {
  title: string,
  description: string,
  tag: string,
  date: Date,
  image: string,

  url: string
}

export interface IBanner {
  url: string;
}

export interface IHomeData {
  startTime: Date,
  endTime: Date,
  signUpEndTime: Date,

  currentParticipant: number,
  totalParticipant: number,

  term: number,
  matched: number,
  unavailable: number,
}
