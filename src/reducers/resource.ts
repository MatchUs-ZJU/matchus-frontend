import {RESOURCE_SAVE} from "@/constants";
import {IFaculty, IQuestion, IResourceImages} from "@/typings/types";

export interface IResourceState {
  help: IQuestion[],
  faculties: IFaculty[]
  images: IResourceImages
}

const INITIAL_STATE: IResourceState = {
  images: {
    aboutUsTopImageUrl: '',
    matchResultTopImageUrl: '',
    chooseResultSuccessTopImageUrl: '',
    chooseResultFailTopImageUrl: '',

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
