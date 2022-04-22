export const getFormatNickname = (nickname: string) => {
  return nickname.length > 4 ? `${nickname.substring(0, 4)}..` : nickname
}

export const getFormatGender = (gender: number) => {
  return gender ? (gender === 1 ? '男' : '女') : '未选择'
}
