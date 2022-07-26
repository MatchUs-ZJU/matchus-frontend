import {areaList} from "@vant/area-data"

export const getFormatNickname = (nickname: string) => {
  return nickname.length > 4 ? `${nickname.substring(0, 4)}..` : nickname
}

export const getFormatGender = (gender: number) => {
  return gender ? (gender === 1 ? '男' : '女') : '未选择'
}

export const getFormatUserType = (userType: number) => {
  return userType ? (userType === 1 ? '在校生' : userType === 2 ? '2019年-2022年从浙大毕业的毕业生' : '2018年以前从浙大毕业的毕业生') : '未选择'
}

export const getBadgeInfo = (identified, userType) => {
  return identified === '认证成功' ? (userType === 1 ? '在校生' : '毕业生')
    : identified === '认证中' ? '审核中' : identified === '认证失败' ? '审核不通过' : '未认证'
}

export const getIdentifiedStatus = (identified) => {
  return identified === '认证成功' ? '已认证' : identified === '认证中' ? '审核中' : identified === '认证失败' ? '审核不通过' : '未认证'
}

export const getFormattedLocation = (codes: string[]) =>{
  if(!codes || codes.length === 0) return ''
  else if(codes.length === 1){  // 省级
    return areaList.province_list[codes[0]]
  }
  else if(codes.length === 2){ //省-市
    return areaList.province_list[codes[0]] +'-'+ areaList.city_list[codes[1]]
  }
  else{ // 省-市-区
    return areaList.province_list[codes[0]] +'-'+ areaList.city_list[codes[1]] + '-' + areaList.county_list[codes[2]]
  }
}
