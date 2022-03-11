import {useDispatch, useSelector} from "react-redux";
import {Button, View} from "@tarojs/components";
import {AtButton} from "_taro-ui@3.0.0-alpha.10@taro-ui";
import {useEffect, useState} from "react";
import {actionFilledOverSurvey, actionFillSurvey} from "../../../actions/activity";

const Index = () => {
  const dispatch = useDispatch();
  const {activity, user} = useSelector(state => state)
  const currentTime = new Date();

  const [canFill, setCanFill] = useState(false)

  useEffect(() => {
    const auth = () => {

    }
    auth()
    checkCanFill()
  }, [])

  function onGotoFillSurvey() {
    dispatch(actionFillSurvey({
      appId: activity.wjxAppId,
      path: activity.wjxPath
    }))
  }

  function onFilledSurvey() {
    dispatch(actionFilledOverSurvey(user.openid, activity.term))
  }

  function checkCanFill() {
    // TODO check can fill
    // if (currentTime < activity.signUpEndTime! && currentTime > activity.signUpStartTime!) {
      setCanFill(true)
    // }
  }

  return (
    <View className='container'>
      <View>
        填写问卷
      </View>
      <View>
        <AtButton type='primary' size='normal' circle disabled={!canFill} onClick={onGotoFillSurvey}>
          点击填写问卷
        </AtButton>
        <AtButton type='primary' size='normal' circle onClick={onFilledSurvey}>
          我已经填完问卷了！
        </AtButton>
      </View>
      <View>
        匹配结果查看
      </View>
    </View>
  )
}

export default Index
