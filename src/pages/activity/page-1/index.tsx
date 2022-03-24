import {View} from "@tarojs/components";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {AtButton} from "taro-ui";
import {actionPreJoinActivity, fetchLatestActivityInfo} from "@/actions";
import {LoginModal} from "../../../components";

import './index.scss'

const Index = () => {
  const dispatch = useDispatch();
  const {global, user, activity} = useSelector((state) => state);
  const {nickName, avatarUrl, identified} = user;
  const {showLoginModal} = global;

  const [canJoin, setCanJoin] = useState(true)
  const currentTime = new Date()

  useEffect(() => {
    function checkCanJoin() {
      const checkUser = () => {
        return nickName && (identified === '已认证')
      }
      const checkJoinTime = (current: Date) => {
        return current > activity.signUpStartTime! && current < activity.signUpEndTime!
      }
      // TODO check has paid
      if (checkUser() && checkJoinTime(currentTime)) {
        setCanJoin(true)
      } else {
        setCanJoin(false)
      }
    }

    // 获取活动信息和用户参与情况
    dispatch(fetchLatestActivityInfo())
    // 检查是否能够参与
    checkCanJoin()
  }, [])

  function onJoinActivity() {
    // 发起参与活动，购买请求
    const payload = {
      openid: user.openid,
      activityId: activity.id
    }
    dispatch(actionPreJoinActivity(payload, setCanJoin))
  }

  return (
    <View className='container'>
      <LoginModal opened={showLoginModal}/>
      <View>
        活动介绍和规则
      </View>
      <View>
        <AtButton type='primary' size='normal' circle disabled={!canJoin} onClick={onJoinActivity}>
          现在加入活动
        </AtButton>
      </View>
    </View>
  )
}

export default Index
