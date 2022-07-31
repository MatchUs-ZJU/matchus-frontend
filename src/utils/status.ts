// Http status
// 200-299 means success,
// else is a http request failure flag
export const HTTP_STATUS = {
  200: '请求成功',
  400: '发出的请求有错误，服务器取消该次操作',
  401: '用户没有权限（令牌、用户名、密码错误）',
  403: '用户得到授权，但是访问是被禁止的',
  404: '请求不存在',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

export const HTTP_STATUS_CODE = {
  SUCCESS_LOWER_BOUND: 200,
  SUCCESS_UPPER_BOUND: 300
}

export const API_STATUS_CODE = {
  SUCCESS: 0,
  OUT_OF_TIME: 13,
  TOKEN_EXPIRE: 2,
}

