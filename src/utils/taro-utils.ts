import Taro from "@tarojs/taro";

export async function viewImages(urls: string[], current?: string) {
  const res = await Taro.previewImage({
    urls: urls,
    current: current
  })
  console.log(res)
}
