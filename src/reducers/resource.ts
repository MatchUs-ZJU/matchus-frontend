import {RESOURCE_SAVE} from "@/constants";
import {IFaculty, IQuestion, IResourceImage} from "@/typings/types";

export interface IResourceState {
  help: IQuestion[],
  faculties: IFaculty[]
  images: IResourceImage
}

const INITIAL_STATE: IResourceState = {
  images: {
    contactUsUrl: '',
    followUsUrl: ''
  },
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
