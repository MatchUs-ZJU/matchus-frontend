import {IMultiChoice, IPersonInfo, IPhotoUrls} from "@/typings/types";
import {USER_TYPE} from "@/utils/constant";
import MultiChoices from "@/components/person-info/fill-card/multi-choices";

export const isOthers = (input: string) => {
  if (input && input.slice(0, 2) === '其他') return true
  else return false
}

export const findOthers = (choices:IMultiChoice[])=>{
  return choices.filter(item=>isOthers(item.label))
}

export const fillOthers = (input: string) => {
  return checkString(splitOthers(input))
}

export const emptyOther = () =>{
  return '其他〖〗'
}

export const splitOthers = (input: string) => {
  if (!isOthers(input)) {
    return input
  }
  else {
    return input.slice(3, -1)
  }
}

export const combineOthers = (input: string) => {
  if(input && input!=='') return '其他〖' + input +'〗'
  else return '其他〖〗'
}

export const showOthers = (input: string) => {
  if(input && input!=='') return '其他'+'-' + input
  else return '其他-未完善'
}

export const updateOther = (choices:IMultiChoice[],append?:string)=>{
  let updatedData:IMultiChoice[] = []
  choices.map((item)=>{
    if(isOthers(item.label)) updatedData.push({label:combineOthers(append?append:''),selected:true})
    else updatedData.push(item)
  })
  return updatedData
}

export const cancelOthers = (choices:IMultiChoice[]) => {
  let updatedData:IMultiChoice[] = []
  choices.map((item)=>{
    if(isOthers(item.label)) updatedData.push({label:'其他',selected:false})
    else if(item.label === '我要自己选') updatedData.push( {label:'我要自己选',selected:false})
    else  updatedData.push(item)
  })
  return updatedData
}

export const completeChoices = (getInfo:IMultiChoice[],completeInfo:IMultiChoice[])=>{
  if(!getInfo || getInfo.length === 0) return completeInfo
  let getInfoOther: IMultiChoice[] = []
  const otherArray = findOthers(getInfo)
  const other = otherArray.length>0?otherArray[0]:{label:'其他',selected:false}
  completeInfo.map((item)=>{
    // 已选
    const findRes = getInfo.filter((it) => it.label===item.label && it.selected)
    // 如果不是其他
    if(!isOthers(item.label)){
      if(findRes.length > 0){
        // 填入已选
        getInfoOther.push({...item,selected:true})
      }
      else{
        //填入未选
        getInfoOther.push({...item,selected:false})
      }
    }else{
      // 判断怎么加上其他
      if(findRes.length>0){
        // 选中其他，但未填入其他，填写页面保存功能造成
        getInfoOther.push({label:'其他',selected:true})
      }else{ // 还没有过其他
        // 没有找到一样de其他选项，可能是已经填入了，或者是没选
        if(!fillOthers(other.label)){
          getInfoOther.push({label:other.label,selected:false})
        }else{
          getInfoOther.push(other)
        }
      }
    }})
  return getInfoOther
}

export const getAddressCode = (value: string[])=>{
  if(value[0] === '310000' || value[0] === '110000' || value[0] === '120000' || value[0] ==='500000'){
    return [value[0]]
  }
  else return value
}

// 检查是否选中其他
export const checkOtherChoiceState = (data)=>{
  const check = data && data.filter((item) => (isOthers(item.label) || item.label === '我要自己选') && item.selected).length!==0
  return check
}

// 单选+其他 不区分其他
export const checkRadio = (input: string) => {
  // const str =
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
  else if(checkOtherChoiceState(choices) && !otherValue) return false
  return true
}

// 多选+其他 不区分其他
export const checkMultiChoicesWithOtherTogether = (choices:IMultiChoice[]) =>{
  if(!checkMultiChoices(choices)) return false
  const res = findOthers(choices)
  if(res.length > 0 &&res[0].selected){
    return fillOthers(res[0].label)
  }
  return true
}

// 检查照片是否存在
export const checkPhotos = (photos: IPhotoUrls[] | undefined) => {
  if(photos && photos.length>0 && photos.filter((item)=>item.imageUrl).length !== 0) {
    return true
  }
  else return false
}

export const combineFormatItem = (input:string,append?:string) => {
  if(isOthers(input)) return fillOthers(input)?'其他-'+splitOthers(input):'未完善'
  else if(input === '我要自己选') return append?'其他-'+append:'未完善'
  else return input
}

// 连接字符串
export const combineChoices = (choices:IMultiChoice[],together: boolean,append?:string)=>{
  if(!checkMultiChoices(choices)) return ''
  const selected = choices.filter((item)=>item.selected)
  if(selected.length === 0) return ''
  else if(selected.length === 1) {
    if(together)
      return combineFormatItem(selected[0].label)
    else
      return combineFormatItem(selected[0].label,append)
  }
  else{
    let res:string[]=[]
    selected.map((item)=> {
      if(together)
        res.push(combineFormatItem(item.label))
      else
        res.push(combineFormatItem(item.label,append))
    })
    return res.join(' | ')
  }
}

export const checkString = (input:string | undefined) => {
  if(input && input !== '') return true
  return false
}

export const checkBasicInfo = (personInfo: IPersonInfo) => {
   return personInfo && checkString(personInfo.wechatNumber) && checkString(personInfo.height) && checkString(personInfo.weight) && checkString(personInfo.physique) && checkString(personInfo.birth) && checkString(personInfo.hometown)
}
export const checkStatusInfo = (personInfo: IPersonInfo,userType: number) => {
  if(userType === USER_TYPE.OTHER) return true

  if (userType === USER_TYPE.STUDENT){
    return personInfo && checkString(personInfo.currentSchoolStatus) && checkString(personInfo.oneYearStatus)
      && checkString(personInfo.schoolGraduateInSep) && checkMultiChoicesWithOther(personInfo.futureBase,personInfo.selfFutureBase)
  }
  else{
    return personInfo && checkString(personInfo.graduateEducation) && checkString(personInfo.graduateWorkLocation) &&checkString(personInfo.graduateWorkDetail) && checkMultiChoices(personInfo.graduateIncome)
  }
}
export const checkMajorInfo = (personInfo: IPersonInfo,userType: number) => {
  if (userType === USER_TYPE.STUDENT){
    return personInfo && checkString(personInfo.currentSchoolGrade) && checkString(personInfo.currentSchoolCampus) && checkMultiChoices(personInfo.industry)
  }
  else{
    return personInfo && checkMultiChoices(personInfo.industry)
  }
}
export const checkLoveInfo = (personInfo : IPersonInfo,userType:number) => {
  const commonRequire = personInfo && checkString(personInfo.loveHistory) && checkString(personInfo.consumptionShare)
  if(userType === USER_TYPE.STUDENT){
    return commonRequire && checkMultiChoices(personInfo.consumption)
  }
  else{
    return commonRequire
  }
}
export const checkApperanceInfo = (personInfo: IPersonInfo,images:IPhotoUrls[]) =>{
  return personInfo && checkMultiChoices(personInfo.temperament) && checkPhotos(images)
}
export const checkHabitInfo = (personInfo: IPersonInfo) => {
  return personInfo && checkMultiChoicesWithOtherTogether(personInfo.interest) && checkString(personInfo.exerciseFrequency) && checkString(personInfo.stayUpFrequency) &&
    checkString(personInfo.drinkHabit) && checkString(personInfo.smokingHabit) && checkString(personInfo.discoHabit)
}
export const checkSubjectInfo = (personInfo: IPersonInfo) => {
  return personInfo && checkString(personInfo.superPower) && checkString(personInfo.emo) && checkString(personInfo.say) &&
    checkRadio(personInfo.wechatFirstTime) && checkRadio(personInfo.beFriend) && checkRadio(personInfo.showLove) && checkRadio(personInfo.isLover) && checkRadio(personInfo.isLoveYou)
}

export const  checkRequired = (personInfo:IPersonInfo | undefined,images:IPhotoUrls[] | undefined,userType:number) => {
  if(!personInfo || !images) return false

  return checkBasicInfo(personInfo) && checkStatusInfo(personInfo,userType) && checkMajorInfo(personInfo,userType)
  && checkLoveInfo(personInfo,userType) && checkApperanceInfo(personInfo,images) && checkHabitInfo(personInfo) && checkSubjectInfo(personInfo)
}
