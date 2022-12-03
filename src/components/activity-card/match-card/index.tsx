import {View, ViewProps} from "@tarojs/components";
import classnames from "classnames";
import {Image} from "@taroify/core";
import {HeartBeatIcon, StepGreyIcon, StepIcon} from "@/assets/images";
import {
  ActiveBtn,
  DisableBtn, FinishedBtn,
  NotStartBtn
} from "@/components/activity-card/right-buttons";
import Taro from "@tarojs/taro";
import Watermark from "@/components/activity-card/watermark";
import {DayCounter, QACard} from "@/components/activity-card/daily-question";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";

import {confirmSubscribe, notifySubscribe} from "@/actions/activity";
import './index.scss';

interface MatchCardProps extends ViewProps {
  activity: number | string
  resultShowTime: string
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
  const {resultShowTime} = props
  const dispatch = useDispatch()
  const {subscribe} = useSelector(rootState => rootState.activity.participate.match)
  const {filled} = useSelector(rootState => rootState.activity.participate.fillForm)
  const {approval, before, today} = useSelector(rootState => rootState.activity.participate.dailyQuestion)
  const {
    state,
    matchResult,
    message,
    left,
    refund
  } = useSelector(rootState => rootState.activity.participate.match)
  const leftTime = formatLeftTime(left)
  const [lightUp, setLightUp] = useState([false, false, false, false])
  const [fund, setFund] = useState(false)

  useEffect(() => {
    if (state === 'ACTIVE' && matchResult) {
      let tmpLightUp = lightUp
      approval.map((item) => {
        tmpLightUp[item.index] = item.approval;
      })

      const tmpFund = tmpLightUp.every((item) => item)

      setLightUp([...tmpLightUp])
      setFund(tmpFund)
    }
  }, [approval])

  function formatLeftTime(leftMss: number) {
    const day = Math.floor(leftMss / (1000 * 60 * 60 * 24));
    const hour = Math.floor((leftMss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minute = Math.floor((leftMss % (1000 * 60 * 60)) / (1000 * 60));
    return day === 0 ? `${hour}小时${minute}分` : `${day}天${hour}小时`
  }

  async function goToSeeResult() {
    // 用户订阅消息通知
    if(!subscribe){
      dispatch(notifySubscribe([
        '49EFzIqjgDy4yVdz0Bo9pkKdT-cPP7K_99sXh51NIkk',
        'kxVQfvpFZd3taINF-u2HrhO9iGDLiaaf6ICO2LCQvVk',
      ],true))
    }

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
        {state === 'ACTIVE' && (
          <Watermark success={matchResult} type='match'/>
        )}
        <View className='col left'>
          <View className='id'>3</View>
          <Image lazyLoad src={(state && state === 'ACTIVE' && !matchResult) ? StepGreyIcon : StepIcon}
            className='img'
          />
        </View>

        <View className='col main'>
          <View className='title'>相识·智能匹配</View>
          <View className='detail'>
            {state && state === 'ACTIVE' && !matchResult ?
              (message && message === -1 ? '您的身份审核未通过，请重新申请，期待下一次相遇' : message === -2 ? `您没有填写新修改的问卷` : `本次活动匹配失败，缘分还在路上，请查看匹配失败分析报告`)
              : `匹配结果会在${resultShowTime}前公布，请耐心等待`}</View>
          <View
            className={classnames(
              'note',
              {'note-failed': state && state === 'ACTIVE' && !matchResult}
            )}
          >{state && state === 'ACTIVE' && !matchResult ? '退款将在2个工作日内返还！' : '若匹配失败，100%退全款'}</View>
        </View>
        <View className='col right'>
          {state === 'NOT_START' && !filled ? (
            <NotStartBtn type='notStart'/>
          ) : state === 'NOT_START' && filled ? (
            <LeftTimeBtn time={leftTime}/>
          ) : state === 'ACTIVE' && matchResult ? (
            <ActiveBtn type='seeResult' onClick={goToSeeResult}/>
          ) : state === 'ACTIVE' && !matchResult ? (
            refund ? (
              <FinishedBtn type='hasRefund'/>
            ) : (
              <FinishedBtn type='inRefund'/>
            )
          ) : (
            <DisableBtn type='disable'/>
          )}
        </View>
      </View>
      {
        state === "ACTIVE" && matchResult &&
        <View className='row feedback-card'>
          <View className='feedback'>
            <View className='row title'>
              <Image src={HeartBeatIcon} className='icon'/>
              每日一问
            </View>
            {
              today && today.index < 4 &&
              <View className='qa'>
                <QACard question={today} disabled={today.index >= 4}/>
              </View>
            }
            <View className='split'>
              <DayCounter index={today?today.index:0} lightUp={lightUp} fund={fund}/>
            </View>
            {
              before &&
              <View className='qa'>
                <QACard question={before} isAnswer/>
              </View>
            }
          </View>
        </View>
      }
    </View>
  )
}

export default MatchCard
