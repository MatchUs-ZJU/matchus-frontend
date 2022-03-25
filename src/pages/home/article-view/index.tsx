import {View, WebView} from "@tarojs/components";
import Taro from "@tarojs/taro";

import './index.scss'

interface ArticleViewProps {
  src: string
}

const Index = (props: ArticleViewProps) => {

  const {src} = props

  async function onSuccess() {
    console.log('浏览文章：打开文章成功')
  }

  async function onFail() {
    console.log('浏览文章：打开文章失败')
    await Taro.showToast({
      title: '打开文章失败',
      icon: 'error',
      duration: 3000
    })

    await Taro.navigateBack()
  }

  return (
    <View className='container'>
      <WebView src={src} onError={onFail} onLoad={onSuccess}/>
    </View>
  )
}

export default Index;
