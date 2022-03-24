import {Text, View} from "@tarojs/components";
import {Image} from "@taroify/core";
import {Like} from "@taroify/icons";
import {IArticle} from "@/typings/types";
import Taro from "@tarojs/taro";

import './index.scss'

interface ArticleCardProps {
  article: IArticle
  key: number
}

const ArticleCard = (props: ArticleCardProps) => {

  const {article} = props

  async function onOpenArticleView() {
    await Taro.navigateTo({
      url: `pages/home/article-view?src=${article.url}`
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
        <View className='row' style='align-item: center; width: 100%'>
          <Text className='col tag'>#{article.tag}</Text>
          <View className='row date'>
            <Like style={{ color: "#FF6C90", margin: "0 8px 0 0"}} />
            <Text>{article.date.getFullYear()}.{article.date.getMonth()}.{article.date.getDate()}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ArticleCard;
