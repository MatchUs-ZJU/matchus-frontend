export const getFormatTime = (time: Date) => {
  // return `${time.getFullYear()}.${time.getMonth() + 1}.${time.getDate()}`
  return `${time.getFullYear()}-${time.getMonth() + 1 < 10 ? `0${time.getMonth() + 1}` : (time.getMonth() + 1)}-${time.getDate() < 10 ? `0${time.getDate()}` : time.getDate()}`
}

export const getDateFromStamp = (timeStamp: string) => {
  return getFormatTime(new Date(Number(timeStamp)))
}

export const getTimeStampFromDate = (date: Date) => {
  return date.valueOf().toString()
}


