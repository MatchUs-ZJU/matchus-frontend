export const studentNumberRegTest = (input: string) => {
  const studentNumberRegExpression = /^\w+$/
  return studentNumberRegExpression.test(input)
}

export const phoneNumberRegTest = (input: string) => {
  const tel = /^0\d{2,3}-?\d{7,8}$/
  const phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/

  if(input.length == 11){//手机号码
    if(phone.test(input)) {
      return true;
    }
  }else if(input.length == 13 && input.indexOf("-") != -1 ){
    if(tel.test(input)) {
      return true;
    }
  }
  return false;
}

export const floatRegTest = (input: string)=>{
  const numExp = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
  return numExp.test(input)
}

export const wechatNumberRegTest = (input: string)=>{
  const wechatReg = /^[a-zA-Z][a-zA-Z\d_-]{5,19}$/
  return wechatReg.test(input) || phoneNumberRegTest(input)
}
