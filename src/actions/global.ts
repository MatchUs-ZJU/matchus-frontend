import {GLOBAL_SAVE} from "@/constants";

export const globalSave = (payload) => {
  return {
    type: GLOBAL_SAVE,
    payload
  }
}


