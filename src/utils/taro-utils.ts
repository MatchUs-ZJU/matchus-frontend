import Taro from "@tarojs/taro";

export async function viewImages(urls: string[], current?: string) {
  const res = await Taro.previewImage({
    urls: urls,
    current: current
  })
  console.log(res)
}

export function checkHomePage() {
  const currentPages = Taro.getCurrentPages()
  if (currentPages.length) {
    // 当前页是否为首页
    return 'pages/home/index/index' === currentPages[currentPages.length - 1].route
  }
  return false
}
