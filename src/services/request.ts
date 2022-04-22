import Taro from "@tarojs/taro";
import {API_STATUS_CODE, HTTP_STATUS, HTTP_STATUS_CODE} from "@/utils/status";
import {BASE_URL} from "@/config";
import {checkHomePage} from "@/utils/taro-utils";
import {removeJWT} from "@/services/jwt";

let checkHttpStatus = (response: API.Response) => {
  // stop loading
  Taro.hideNavigationBarLoading();
  if (response.statusCode >= HTTP_STATUS_CODE.SUCCESS_LOWER_BOUND && response.statusCode < HTTP_STATUS_CODE.SUCCESS_UPPER_BOUND) {
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
  if (data.success && data.code === API_STATUS_CODE.SUCCESS) {
    return data
  }

  // token expire
  if(data.code === API_STATUS_CODE.TOKEN_EXPIRE) {
    handleJWTExpired()
      .then(() => {
        return data
      })
  }

  const message = data.msg || '服务器异常并且没有返回原因';
  const error: any = new Error(message);
  error.data = data;
  error.text = message;
  error.code = data.code;
  throw error;
}

async function handleJWTExpired() {
  console.log('网络请求：JWT过期，重新登录')
  removeJWT()
  if(!checkHomePage()) {
    await Taro.reLaunch({url: '/pages/home/index/index'})
  }
}

/**
 * 请求错误处理
 */
function throwError(err) {
  Taro.hideNavigationBarLoading();

  // show error message
  console.log("请求失败：" + `${err.code} - ${err.text}`)
  Taro.showToast({
    title: "网络请求失败: 请刷新或重新重试",
    icon: 'none',
    duration: 3000
  })
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


