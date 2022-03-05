import Taro from "@tarojs/taro";
import {HTTP_STATUS} from "../utils/status";
import {BASE_URL} from "../config";

let checkHttpStatus = (response: API.Response) => {
  // stop loading
  Taro.stopPullDownRefresh();
  Taro.hideNavigationBarLoading();
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data;
  }

  let message = HTTP_STATUS[response.statusCode] || `ERROR CODE: ${response.statusCode}`;
  let error: any = new Error(message);
  error.data = response.data;
  error.text = message;
  error.code = response.statusCode;
  throw error;
}

let checkSuccess = (data: API.ResponseData) => {
  Taro.hideNavigationBarLoading();
  if (data.success && data.code === 0) {
    return data.data;
  }

  const message = data.msg || '服务器异常并且没有返回原因';
  const error: any = new Error(message);
  error.data = data;
  error.text = message;
  error.code = data.code;
  throw error;
}

/**
 * 请求错误处理
 */
function throwError(err) {
  Taro.hideNavigationBarLoading();

  // show error message
  console.log("请求失败：" + `${err.code} ${err.text}`)
  Taro.showToast({
    title: "网络请求失败: " + `${err.text}`,
    icon: "error",
    duration: 5000
  })
  throw err
}

export default {
  request(url: string, options: any, method?: string) {
    let contentType = options.contentType || 'application/json';

    // show loading animation
    Taro.showNavigationBarLoading();

    // send request
    return Taro.request({
      ...options,
      method: method || 'GET',
      url: `${BASE_URL}${url}`,
      header: {
        'content-type': contentType,
        ...options.header,
      },
    }).then(checkHttpStatus)
      .then((res) => {
        return checkSuccess(res);
      })
      .catch((error) => {
        throwError(error);
      });
  },

  get(url: string, options?: { [key: string]: any; params?: object }) {
    return this.request(url, {...options});
  },

  delete(url: string, options?: { [key: string]: any; params?: object }) {
    return this.request(url, {...options}, 'DELETE');
  },

  post(url, options?: any) {
    return this.request(
      url,
      {
        ...options,
        data: JSON.stringify(options.data),
      },
      'POST'
    );
  },
}


