export const getFormatNickname = (nickname: string) => {
  return nickname.length > 4 ? `${nickname.substring(0, 4)}..` : nickname
}
