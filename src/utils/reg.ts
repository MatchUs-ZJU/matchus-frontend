export const studentNumberRegTest = (input: string) => {
  const studentNumberRegExpression = /^\w+$/
  return studentNumberRegExpression.test(input)
}
