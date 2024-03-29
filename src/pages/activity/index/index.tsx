import {View, Text} from "@tarojs/components";
import {useDispatch, useSelector} from "react-redux";
import {Image} from "@taroify/core";
import {useEffect, useState} from "react";
import {fetchLatestActivityInfo, fetchUserInfo} from "@/actions";
import {ActivityHelp} from "@/assets/images"
import Taro, {useDidShow, usePullDownRefresh, useShareAppMessage} from "@tarojs/taro";
import {MatchCard, SurveyCard, SignUpCard, ChooseCard} from "@/components/";
import {Like} from "@taroify/icons";
import classnames from "classnames";
import {fetchMatchQuestion} from "@/actions/activity";
import {fetchPersonInfo} from "@/actions/user";
import './index.scss';

const Index = () => {
  const dispatch = useDispatch()
  const {user, activity} = useSelector(state => state)
  const {nickName, avatarUrl, identified, login, receivedData} = user
  const {id, price, wjxPath, wjxAppId, participate} = activity
  const {match, state, choose} = participate

  const [payBodyPrefix, setPayBodyPrefix] = useState('')
  const [signUpStartTime, setSignUpStartTime] = useState('')
  const [matchResultShowTime, setMatchResultShowTime] = useState('')
  const [twoWayChooseStartTime, setTwoWayChooseStartTime] = useState('')
  const [twoWayChooseEndTime, setTwoWayChooseEndTime] = useState('')

  usePullDownRefresh(async () => {
    await fetchData()
  })

  useShareAppMessage(_ => {
    return {
      title: 'MatchUs - 每个人都在寻找契合的另一块拼图',
      path: 'pages/home/index/index',
    }
  })

  useDidShow(async () => {
    const checkUserState = async () => {
      if (!login || !receivedData) {
        await Taro.switchTab({url: '/pages/home/index/index'})
        return
      }

      if (!nickName || !avatarUrl || identified === '未认证') {
        await Taro.reLaunch({url: '/pages/introduction/index'})
        return
      }

      if (identified === '认证失败') {
        await Taro.reLaunch({url: '/pages/user/information/index'})
        return
      }
    }

    /**
     * 进入活动页，
     * 首先检查是否完成了基本信息的获取，依据是nickName和avatar是否存在;
     * 其次检查是否完成了必要信息的填写，如果没有，跳转到欢迎页
     */
    await checkUserState()

    await fetchData()
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

  useEffect(() => {
    // 只有认证成功，匹配成功且位于合适的时间段内，才拿每日一问信息
    if (identified === '认证成功' && match.state === "ACTIVE" && match.matchResult) {
      dispatch(fetchMatchQuestion(id))
    }
  }, [identified, match, choose])

  async function fetchData() {
    dispatch(fetchLatestActivityInfo())
    if(login){
      dispatch(fetchPersonInfo())
    }
  }

  return (
    <View className='container'>
      <View className='header'>
        <Image src={activity.imageUrl}/>
      </View>
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

      <View
        className='help'
        onClick={
          async () => {
            await Taro.navigateTo({url: '/pages/user/help/index'});
          }
        }
      >
        <Image src={ActivityHelp}/>
      </View>

    </View>
  )
}

export default Index
