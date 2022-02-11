import {GLOBAL_SAVE} from "../constants";

export const saveGlobal = (payload) => {
  return {
    type: GLOBAL_SAVE,
    payload
  }
}


