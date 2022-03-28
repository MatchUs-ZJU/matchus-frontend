import {View} from "@tarojs/components";
import Taro, {useDidShow} from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";

import './index.scss'

const Index = () => {
  const dispatch = useDispatch()
  const {user, global} = useSelector(state => state)
  const {nickName, avatarUrl, identified} = user
  const {showLoginModal} = global

  useDidShow(async () => {
    const checkUserState = async () => {
      if (!nickName || !avatarUrl) {
        await Taro.navigateTo({url: '/pages/introduction/index'})
        return
      }
      if (identified !== '已认证') {
        await Taro.navigateTo({url: '/pages/introduction/index'})
        return
      }
    }

    /**
     * 进入活动页，
     * 首先检查是否完成了基本信息的获取，依据是nickName和avatar是否存在;
     * 其次检查是否完成了必要信息的填写，如果没有，跳转到欢迎页
     */
    await checkUserState()
  })

  return (
    <View>
      这里是活动导航页
    </View>
  )
}

export default Index
