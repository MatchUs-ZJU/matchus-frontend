import {Text, View} from "@tarojs/components";
import {useDispatch, useSelector} from "react-redux";
import {Image} from "@taroify/core";
import {ActivityHeaderPlaceholderImage} from "@/assets/images";
import {useEffect, useState} from "react";
import {fetchLatestActivityInfo} from "@/actions";
import Taro, {useDidShow} from "@tarojs/taro";
import {MatchCard, SurveyCard, SignUpCard} from "@/components/activity-card";

import './index.scss'

const Index = () => {
  const dispatch = useDispatch()
  const {user, activity} = useSelector(state => state)
  const {nickName, avatarUrl, identified} = user
  const {price, wjxPath, wjxAppId, participate} = activity
  const {signUp, match, choose, fillForm} = participate

  const [payBodyPrefix, setPayBodyPrefix] = useState('')
  const [signUpStartTime, setSignUpStartTime] = useState('')
  const [matchResultShowTime, setMatchResultShowTime] = useState('')
  const [twoWayChooseStartTime, setTwoWayChooseStartTime] = useState('')
  const [pushGoToFillForm, setPushGoToFillForm] = useState(false)

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
    // await checkUserState()

    /**
     * 检查活动当前状态
     */
  })

  useEffect(() => {
    // 进入界面就获取活动的基本信息，和个人信息
    fetchData()
  }, [])

  useEffect(() => {
    // 处理时间等数据
    if (activity.signUpStartTime) {
      let t = new Date(activity.signUpStartTime)
      setSignUpStartTime(`${t.getMonth()}.${t.getDate()}`)
    }

    if (activity.matchResultShowTime) {
      let t = new Date(activity.matchResultShowTime)
      setMatchResultShowTime(`${t.getMonth()}.${t.getDate()}日${t.getHours()}点`)
    }

    if (activity.twoWayChooseStartTime) {
      let t = new Date(activity.twoWayChooseStartTime)
      setTwoWayChooseStartTime(`${t.getMonth()}月${t.getDate()}日${t.getHours()}时`)
    }

    if(activity.id && user.openid) {
      setPayBodyPrefix(`${activity.id}-${user.openid}`)
    }
  }, [activity])

  function fetchData() {
    dispatch(fetchLatestActivityInfo())
  }

  return (
    <View className='container' style={{position: 'relative'}}>
      <Image src={activity.imageUrl ? activity.imageUrl : ActivityHeaderPlaceholderImage} className='header'/>
      <View className='container wrapper'>
        <SignUpCard
          price={price}
          state={signUp.state}
          paid={signUp.paid}
          participated={signUp.participated}
          time={signUpStartTime}
          activity={activity.id}
          bodyPrefix={payBodyPrefix}
        />

        <SurveyCard
          activity={activity.id}
          filled={fillForm.filled}
          state={fillForm.state}
          wjxAppId={activity.wjxAppId}
          wjxPath={activity.wjxPath}
        />

        <MatchCard
          activity={activity.id}
          time={matchResultShowTime}
          state={match.state}
          matchResult={match.matchResult}
          favor={match.favor}
          lastChoose={match.lastChoose}
          left={match.left}
          filled={fillForm.filled}
        />

        {/*<View className='row activity-card'>*/}
        {/*  <Watermark content='匹配失败'/>*/}
        {/*  <View className='col left'>*/}
        {/*    <View className='id'>4</View>*/}
        {/*    <Image lazyLoad src={StepIcon} className='img'/>*/}
        {/*  </View>*/}
        {/*  <View className='col main'>*/}
        {/*    <View className='title'>相惜·双选阶段</View>*/}
        {/*    <View className='detail'>参与活动需支付报名费10元，请珍惜每一次遇见！</View>*/}
        {/*    <View className='note' onClick={() => {*/}
        {/*      console.log("test")*/}
        {/*    }}>点击查看详细活动规则</View>*/}
        {/*  </View>*/}
        {/*  <View className='col right'>*/}
        {/*    <View className='col choose'>*/}
        {/*      <Switch size='30px'/>*/}
        {/*      <View className='note'>选Ta</View>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*</View>*/}
      </View>
    </View>
  )
}

export default Index
