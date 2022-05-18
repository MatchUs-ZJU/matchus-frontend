import Taro from "@tarojs/taro";
import {CLOUD_ENV} from "@/config";

export async function viewImages(urls: string[], current?: string) {
  const res = await Taro.previewImage({
    urls: urls,
    current: current
  })
  console.log(res)
}

export async function uploadIdentificationImage(realName: string, studentNumber: string, url: string) {
  const generateFileName = () => {
    const sn = studentNumber === '' ? '3180000000' : studentNumber
    const rn = realName === '' ? '微信用户' : realName
    return `${sn}-${rn}-${new Date().getTime()}`
  }
  return Taro.cloud.uploadFile({
    cloudPath: `identify/${generateFileName()}.png`,
    filePath: url,
    config: {
      env: CLOUD_ENV
    }
  })
}

export function checkHomePage() {
  const currentPages = Taro.getCurrentPages()
  if (currentPages.length) {
    // 当前页是否为首页
    return 'pages/home/index/index' === currentPages[currentPages.length - 1].route
  }
  return false
}
