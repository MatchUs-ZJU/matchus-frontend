export const getFormatNickname = (nickname: string) => {
  return nickname.length > 5 ? `${nickname.substring(0, 5)}...` : nickname
}
