import {View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {globalSave} from "../../../actions";
import {LoginModal} from "../../../components";

const Index = () => {
  const dispatch = useDispatch()
  const {user, global} = useSelector(state => state)
  const {nickName, avatarUrl, identified} = user
  const {showLoginModal} = global

  useEffect(() => {
    const checkUserState = () => {
      if (!nickName && !avatarUrl) {
        dispatch(globalSave({showLoginModal: true}));
      }
      if (identified !== '已认证') {
        Taro.navigateTo({url: '/pages/introduction/index'})
      }
    }

    /**
     * 进入活动页，
     * 首先检查是否完成了基本信息的获取，依据是nickName和avatar是否存在;
     * 其次检查是否完成了必要信息的填写，如果没有，跳转到欢迎页
     */
    checkUserState()
  }, [])

  return (
    <View>
      <LoginModal opened={showLoginModal} />
      这里是活动导航页
    </View>
  )
}

export default Index
