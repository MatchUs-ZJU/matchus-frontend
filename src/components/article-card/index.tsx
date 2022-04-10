import {Text, View} from "@tarojs/components";
import {Image} from "@taroify/core";
import {Like} from "@taroify/icons";
import {IArticle} from "@/typings/types";
import Taro from "@tarojs/taro";
import {useEffect, useState} from "react";

import './index.scss'

interface ArticleCardProps {
  article: IArticle
  key: number
}

const ArticleCard = (props: ArticleCardProps) => {

  const {article} = props
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    // 处理文章的时间
    if (article) {
      setDate(new Date(article.date))
    }
  }, [article])

  async function onOpenArticleView() {
    Taro.setStorageSync('webViewSrc', article.url)
    await Taro.navigateTo({
      url: `/pages/home/article-view/index`
    })
  }

  return (
    <View className='row article-card' onClick={onOpenArticleView}>
      <Image
        lazyLoad
        src={article.image}
        className='img'
        mode='center'
      />
      <View className='col detail'>
        <View className='title'>{article.title}</View>
        <View className='desc'>{article.description}</View>
        <View className='row note' >
          <Text className='col tag'>#{article.tag}</Text>
          <View className='row date'>
            <Like style={{color: "#FF6C90", margin: "0 8px 0 0"}} />
            <Text>{date.getFullYear()}.{date.getMonth()}.{date.getDate()}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ArticleCard;
