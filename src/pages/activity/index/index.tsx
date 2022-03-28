import {View} from "@tarojs/components";
import Taro, {useDidShow} from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";

import './index.scss'
import {Image} from "@taroify/core";
import {ActivityImage} from "@/assets/images";
import {ActivityCard} from "@/components";


const activity_stage = [
  {
    index:1,
    info:{
      title:"启程·报名",
      detail:"参与匹配需支付10元即可@@@@@@@@@@@",
      add:"点击查看详细活动规则",
      click_content:"去报名"
    }
  },
  {
    index:2,
    info:{
      title:"了解·填写问卷",
      detail:"目的是了解需求，包含性格测试等+其他重要提示",
      add:"问卷大约需要10min",
      click_content:"去填写"
    }
  },
  {
    index:3,
    info:{
      title:"初遇·智能匹配",
      detail:"匹配结果会在3.30日下午6点前公布，请耐心等待",
      add:"匹配失败，100%退全款",
      click_content:""
    }
  },
  {
    index:4,
    info:{
      title:"心意·双选阶段",
      detail:"双方互相确认心意，决定是否继续深入了解",
      add:"双选阶段于04.01晚8点开启",
      click_content:"未开始"
    }
  }
]


const Index = () => {
  const dispatch = useDispatch()
  const {user, global} = useSelector(state => state)
  const {nickName, avatarUrl, identified} = user
  const {showLoginModal} = global

  // useDidShow(async () => {
  //   const checkUserState = async () => {
  //     if (!nickName || !avatarUrl) {
  //       await Taro.navigateTo({url: '/pages/introduction/index'})
  //       return
  //     }
  //     if (identified !== '已认证') {
  //       await Taro.navigateTo({url: '/pages/introduction/index'})
  //       return
  //     }
  //   }
  //
  //   /**
  //    * 进入活动页，
  //    * 首先检查是否完成了基本信息的获取，依据是nickName和avatar是否存在;
  //    * 其次检查是否完成了必要信息的填写，如果没有，跳转到欢迎页
  //    */
  //   await checkUserState()
  // })

  return (
    <View className='container'>
      <Image src={ActivityImage} className='act-img'></Image>
      <View className='container wrapper'>
        {
          activity_stage.map((item) => {
            return <ActivityCard index={item.index} info={item.info} ></ActivityCard>
          })
        }
        {/*<ActivityCard index={1}></ActivityCard>*/}
        {/*<ActivityCard index={2}></ActivityCard>*/}
        {/*<ActivityCard index={3}></ActivityCard>*/}
      </View>
    </View>
  )
}

export default Index
