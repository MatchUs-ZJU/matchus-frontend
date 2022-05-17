export const getFormatNickname = (nickname: string) => {
  return nickname.length > 4 ? `${nickname.substring(0, 4)}..` : nickname
}

export const getFormatGender = (gender: number) => {
  return gender ? (gender === 1 ? '男' : '女') : '未选择'
}

export const getFormatUserType = (userType: number) => {
  return userType ? (userType === 1 ? '在校生' : userType === 2 ? '2019年-2022年从浙大毕业的毕业生' : '2018年以前从浙大毕业的毕业生') : '未选择'
}

