import {View} from "@tarojs/components";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {AtButton} from "taro-ui";

import './index.scss'
import {globalSave,actionPreJoinActivity, fetchLatestActivityInfo} from "../../../actions";
import {IdentificationModal, LoginModal} from "../../../components";

const Index = () => {
  const dispatch = useDispatch();
  const {global, user, activity} = useSelector((state) => state);
  const {nickName, identified} = user;
  const {showLoginModal, showIdentifyModal} = global;

  const [canJoin, setCanJoin] = useState(true)
  const currentTime = new Date()

  useEffect(() => {
    function checkUserState() {
      if (!nickName) {
        dispatch(globalSave({showLoginModal: true}));
        return;
      }
      if (identified !== 3) {
        dispatch(globalSave({showIdentifyModal: true}));
        return;
      }
    }

    function checkCanJoin() {
      const checkUser = () => {
        return nickName && (identified === 3)
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
    // 检查昵称和验证状态
    checkUserState()
    // 检查是否能够参与
    checkCanJoin()
  }, [])

  function onJoinActivity() {
    // 发起参与活动，购买请求
    const payload = {
      openid: user.openid,
      term: activity.term
    }
    dispatch(actionPreJoinActivity(payload, setCanJoin))
  }

  return (
    <View className='container'>
      <LoginModal opened={showLoginModal}/>
      <IdentificationModal opened={showIdentifyModal}/>
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
