export const getFormatTime = (time: Date) => {
  return `${time.getFullYear()}.${time.getMonth() + 1}.${time.getDate()}`
}
