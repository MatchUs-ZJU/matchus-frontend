import {RESOURCE_SAVE} from "../constants";

export interface IFaculty {
  id: string,
  name: string
}

export interface IQuestion {
  id: string
  question: {},
  answer: string,
}

export interface IMyState {
  help: IQuestion[],
  faculties: IFaculty[]
}

const INITIAL_STATE: IMyState = {
  faculties: [],
  help: []
}

export default function resource(state = INITIAL_STATE, action) {
  switch (action.type) {
    case RESOURCE_SAVE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
