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

export function checkMiniProgramUpdate() {
  // 检查版本更新
  console.log('版本更新：检查版本更新')
  const updateManager = Taro.getUpdateManager()

  updateManager.onCheckForUpdate((res) => {
    if(res.hasUpdate) {
      // 存在版本更新
      console.log('版本更新：存在新版本')
      updateManager.onUpdateReady(async () => {
        console.log('版本更新：版本更新就绪')
        await Taro.showModal({
          title: '更新提示',
          content: '新版本准备就绪，请重启应用',
          success: async (r) => {
            if(r.confirm) {
              console.log('版本更新：用户同意更新')
              updateManager.applyUpdate()
            } else if(r.cancel) {
              console.log('版本更新：用户拒绝更新')
              await Taro.exitMiniProgram()
            }
          }
        })
      })

      updateManager.onUpdateFailed(async () => {
        console.log('版本更新：版本更新失败')
        await Taro.showModal({
          title: '更新提示',
          content: '新版本准备就绪，请您删除并重启小程序',
        })
      })

    } else {
      console.log('版本更新：当前为最新版本小程序')
    }
  })
}
