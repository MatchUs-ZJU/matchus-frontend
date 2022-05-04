import {View, Text} from "@tarojs/components";
import {useDispatch, useSelector} from "react-redux";
import {Image} from "@taroify/core";
import {useEffect, useState} from "react";
import {fetchLatestActivityInfo} from "@/actions";
import Taro, {useDidShow, usePullDownRefresh, useShareAppMessage} from "@tarojs/taro";
import {MatchCard, SurveyCard, SignUpCard, ChooseCard} from "@/components/";
import {Like} from "@taroify/icons";
import classnames from "classnames";

import './index.scss'

const Index = () => {
  const dispatch = useDispatch()
  const {user, activity} = useSelector(state => state)
  const {nickName, avatarUrl, identified, login} = user
  const {id, price, wjxPath, wjxAppId, participate} = activity
  const {signUp, match, choose, fillForm, state} = participate

  const [payBodyPrefix, setPayBodyPrefix] = useState('')
  const [signUpStartTime, setSignUpStartTime] = useState('')
  const [matchResultShowTime, setMatchResultShowTime] = useState('')
  const [twoWayChooseStartTime, setTwoWayChooseStartTime] = useState('')
  const [twoWayChooseEndTime, setTwoWayChooseEndTime] = useState('')

  usePullDownRefresh(() => {
    fetchData()
  })

  useShareAppMessage(_ => {
    return {
      title: 'MatchUs - 每个人都在寻找契合的另一块拼图',
      path: 'pages/home/index/index',
    }
  })

  useDidShow(async () => {
    const checkUserState = async () => {
      if (!login) {
        await Taro.switchTab({url: '/pages/home/index/index'})
        return
      }

      if (!nickName || !avatarUrl) {
        await Taro.reLaunch({url: '/pages/introduction/index'})
        return
      }
      if (identified !== '已认证') {
        await Taro.reLaunch({url: '/pages/introduction/index'})
        return
      }
    }

    fetchData()
    /**
     * 进入活动页，
     * 首先检查是否完成了基本信息的获取，依据是nickName和avatar是否存在;
     * 其次检查是否完成了必要信息的填写，如果没有，跳转到欢迎页
     */
    await checkUserState()
  })

  useEffect(() => {
    // 处理时间等数据
    if (activity.signUpStartTime) {
      let t = new Date(activity.signUpStartTime)
      setSignUpStartTime(`${t.getMonth() + 1}.${t.getDate()}`)
    }

    if (activity.matchResultShowTime) {
      let t = new Date(activity.matchResultShowTime)
      setMatchResultShowTime(`${t.getMonth() + 1}月${t.getDate()}日${t.getHours()}时`)
    }

    if (activity.twoWayChooseStartTime) {
      let t = new Date(activity.twoWayChooseStartTime)
      setTwoWayChooseStartTime(`${t.getMonth() + 1}月${t.getDate()}日${t.getHours()}时`)
    }

    if (activity.twoWayChooseEndTime) {
      let t = new Date(activity.twoWayChooseEndTime)
      setTwoWayChooseEndTime(`${t.getMonth() + 1}月${t.getDate()}日${t.getHours()}时`)
    }

    if (activity.id && user.openid) {
      setPayBodyPrefix(`${activity.id}-${user.openid}`)
    }
  }, [activity])

  function fetchData() {
    dispatch(fetchLatestActivityInfo())
  }

  return (
    <View className='container'>
      <Image src={activity.imageUrl} className='header'/>
      <View className='wrapper'>
        <SignUpCard
          price={price}
          time={signUpStartTime}
          activity={id}
          bodyPrefix={payBodyPrefix}
        />

        <SurveyCard
          activity={id}
          wjxAppId={wjxAppId}
          wjxPath={wjxPath}
        />

        <MatchCard
          activity={id}
          resultShowTime={matchResultShowTime}
        />

        {
          (!(match.state === 'ACTIVE' && !match.matchResult)) &&
          <ChooseCard
            activity={id}
            startTime={twoWayChooseStartTime}
            endTime={twoWayChooseEndTime}
          />
        }

        <View
          className={classnames(
            'row',
            'footer',
            {'footer-failed': state === 'FAIL'},
            {'footer-success': state === 'SUCCESS'}
          )}
        >
          <Like
            style={{marginRight: '8px'}}
            size='18px'
          />
          <Text
            className={classnames(
              {'footer-failed': state === 'FAIL'},
              {'footer-success': state !== 'FAIL'}
            )}
          >
            {state !== 'FAIL' ? '祝你度过一段愉快的MatchUs旅程！' : '很遗憾，没能帮你找到合适的Ta ！'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default Index
