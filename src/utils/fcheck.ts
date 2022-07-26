import {IMultiChoice, IPersonInfo, IPhotoUrls} from "@/typings/types";
import {USER_TYPE} from "@/utils/constant";
import user from "@/reducers/user";

export const isOthers = (input: string) => {
  if (input && input.slice(0, 2) === '其他') return true
  return false
}

export const fillOthers = (input: string) => {
  return splitOthers(input) && splitOthers(input) !== ''
}

export const splitOthers = (input: string) => {
  if (!isOthers(input)) return input
  else return input.slice(3)
}

export const combineOthers = (input: string) => {
  if(input && input!=='') return '其他'+'-' + input
  else return '其他'

}

export const completeChoices = (getInfo:IMultiChoice[],completeInfo:IMultiChoice[])=>{
  if(!getInfo || getInfo.length === 0) return completeInfo
  const res =  completeInfo.map((item)=>{
    const findRes = getInfo.filter((it) => it.label===item.label && it.selected)
    if(findRes.length > 0){
      return {...item,selected:true}
    }
    else return item
  })
  return res
}

export const getAddressCode = (value: string[])=>{
  if(value[0] === '310000' || value[0] === '110000' || value[0] === '120000' || value[0] ==='500000'){
    return [value[0]]
  }
  else return value
}

// 检查是否选中其他
export const checkOtherChoiceState = (data)=>{
  const check = data && data.filter((item) => item.label === '其他' && item.selected).length!==0
  return check
}

// 单选+其他 不区分其他
export const checkRadio = (input: string) => {
  if(!input) return false
  if (isOthers(input) && fillOthers(input)) return true;
  else if (!isOthers(input) && input !== '') return true;
  return false
}

// 多选无其他
export const checkMultiChoices = (choices:IMultiChoice[])=>{
  if(!choices || choices.length===0) return false
  return choices.filter((item)=>item.selected).length !== 0
}

// 多选+其他
export const checkMultiChoicesWithOther = (choices:IMultiChoice[],otherValue:string | undefined) =>{
  if(!checkMultiChoices(choices)) return false
  else if(checkOtherChoiceState(choices) && (!otherValue || otherValue === '')) return false
  return true
}

// 检查照片是否存在
export const checkPhotos = (photos: IPhotoUrls[] | undefined) => {
  if(photos && photos.length>0 && photos.filter((item)=>item.imageUrl).length !== 0) {
    return true
  }
  else return false
}

// 连接字符串
export const combineChoices = (choices:IMultiChoice[])=>{
  if(!checkMultiChoices(choices)) return ''
  const selected = choices.filter((item)=>item.selected)
  if(selected.length === 0) return ''
  else if(selected.length === 1) return selected[0].label
  else{
    return selected.map((item)=>item.label).join(' | ')
  }
}

export const checkString = (input:string) => {
  if(input && input !== '') return true
  return false
}

export const checkBasicInfo = (personInfo: IPersonInfo) => {
   return personInfo && checkString(personInfo.wechatNumber) && checkString(personInfo.height) && checkString(personInfo.weight) && checkString(personInfo.physique) && checkString(personInfo.birth) && checkString(personInfo.hometown)
}
export const checkStatusInfo = (personInfo: IPersonInfo,userType: number) => {
  if (userType === USER_TYPE.ENROLLED){
    return personInfo && checkString(personInfo.currentSchoolStatus) && checkString(personInfo.oneYearStatus)
      && checkString(personInfo.schoolGraduateInSep) && checkMultiChoicesWithOther(personInfo.futureBase,personInfo.selfFutureBase)
  }
  else{
    return personInfo && checkString(personInfo.graduateEducation) && checkString(personInfo.graduateWorkLocation)
  }
}
export const checkMajorInfo = (personInfo: IPersonInfo,userType: number) => {
  if (userType === USER_TYPE.ENROLLED){
    return personInfo && checkString(personInfo.currentSchoolGrade) && checkString(personInfo.currentSchoolCampus) && checkMultiChoices(personInfo.industry)
  }
  else{
    return personInfo && checkString(personInfo.graduateWorkDetail)
  }
}
export const checkLoveInfo = (personInfo : IPersonInfo,userType:number) => {
  const commonRequire = personInfo && checkString(personInfo.loveHistory) && checkString(personInfo.consumptionShare)
  if(userType === USER_TYPE.ENROLLED){
    return commonRequire && checkMultiChoices(personInfo.consumption)
  }
  else{
    return commonRequire && checkMultiChoices(personInfo.graduateIncome)
  }
}
export const checkApperanceInfo = (personInfo: IPersonInfo,images:IPhotoUrls[]) =>{
  return personInfo && checkMultiChoices(personInfo.temperament) && checkPhotos(images)
}
export const checkHabitInfo = (personInfo: IPersonInfo) => {
  return personInfo && checkMultiChoicesWithOther(personInfo.interest, personInfo.selfInterest) && checkString(personInfo.exerciseFrequency) && checkString(personInfo.stayUpFrequency) &&
    checkString(personInfo.drinkHabit) && checkString(personInfo.smokingHabit) && checkString(personInfo.discoHabit)
}
export const checkSubjectInfo = (personInfo: IPersonInfo) => {
  return personInfo && checkString(personInfo.superPower) && checkString(personInfo.emo) && checkString(personInfo.say) && checkString(personInfo.wechatFirstTime) && checkString(personInfo.beFriend) && checkString(personInfo.showLove) && checkString(personInfo.isLover) && checkString(personInfo.isLoveYou)
}

export const  checkRequired = (personInfo:IPersonInfo | undefined,images:IPhotoUrls[],userType:number) => {
  if(!personInfo) return false
  return checkBasicInfo(personInfo) && checkStatusInfo(personInfo,userType) && checkMajorInfo(personInfo,userType)
  && checkLoveInfo(personInfo,userType) && checkApperanceInfo(personInfo,images) && checkHabitInfo(personInfo) && checkSubjectInfo(personInfo)
}
