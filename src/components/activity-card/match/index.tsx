import {useDispatch} from "react-redux";
import {useState} from "react";
import {View, ViewProps} from "@tarojs/components";
import classnames from "classnames";
import {Image} from "@taroify/core";
import {StepIcon} from "@/assets/images";
import {
  ActiveBtn,
  DisableBtn,
  goToRefundText,
  NotStartBtn
} from "@/components/activity-card/right-buttons";
import Taro from "@tarojs/taro";
import Watermark from "@/components/activity-card/watermark";

import './index.scss';

interface MatchCardProps extends ViewProps {
  activity: number | string
  time: string

  state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
  matchResult: boolean,
  favor: number,
  lastChoose: boolean,
  left: number,

  filled: boolean
}

interface LeftTimeBtnProps {
  time: string
}

const LeftTimeBtn = (props: LeftTimeBtnProps) => {
  const {time} = props

  return (
    <View className='btn-disable'>
      <View className='time'>{time}</View>
      <View className='note'>距离匹配结果公布还有</View>
    </View>
  )
}

const MatchCard = (props: MatchCardProps) => {
  const dispatch = useDispatch()
  const {filled, activity, time, state, matchResult, favor, lastChoose, left, ...restProps} = props
  const leftTime = formatLeftTime(left)
  const [favorNumber, setFavorNumber] = useState(favor)

  // 申请退款组件
  const RefundBtn = () => {
    return (
      <View className='btn-failed' onClick={goToRefund}>
        {goToRefundText}
      </View>
    )
  }

  function formatLeftTime(leftMss: number) {
    const day = leftMss / (1000 * 60 * 60 * 24);
    const hour = (leftMss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
    const minute = (leftMss % (1000 * 60 * 60)) / (1000 * 60);
    return day === 0 ? `${hour}小时${minute}分` : `${day}天${hour}小时`
  }

  async function goToRefund() {

  }

  async function goToSeeResult() {
    await Taro.navigateTo({
      url: '/pages/activity/match-result/index'
    })
  }

  return (
    <View className='card-container'>
      <View
        className={classnames(
          'row',
          'activity-card',
          {'activity-card-sheltered': state && state !== 'ACTIVE'},
          {'activity-card-success': state && state === 'ACTIVE' && matchResult},
          {'activity-card-fail': state && state === 'ACTIVE' && !matchResult}
        )}
      >
        {state === 'ACTIVE' ? (
          <Watermark success={matchResult} type='match' />
        ) : (
          <></>
        )}
        <View className='col left'>
          <View className='id'>3</View>
          <Image lazyLoad src={StepIcon} className='img'/>
        </View>
        <View className='col main'>
          <View className='title'>相识·智能匹配</View>
          <View className='detail'>匹配结果会在{time}前公布，请耐心等待</View>
          <View className='note'>若匹配失败，100%退全款</View>
        </View>
        <View className='col right'>
          {state === 'NOT_START' && !filled ? (
            <NotStartBtn type='notStart'/>
          ) : state === 'NOT_START' && filled ? (
            <LeftTimeBtn time={leftTime}/>
          ) : state === 'ACTIVE' && matchResult ? (
            <ActiveBtn type='seeResult' onClick={goToSeeResult}/>
          ) : state === 'ACTIVE' && !matchResult ? (
            <RefundBtn/>
          ) : (
            <DisableBtn type='disable'/>
          )}
        </View>
      </View>
    </View>
  )
}

export default MatchCard
