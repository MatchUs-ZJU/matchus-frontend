import {View,Text, ViewProps} from "@tarojs/components";
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
import {EmojiRater} from "@/components/activity-card/emoji-rater";
import {useSelector} from "react-redux";

import './index.scss';
import {DayCounter, QACard} from "@/components/activity-card/daily-question";
import {useEffect, useState} from "react";

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
  const {filled} = useSelector(rootState => rootState.activity.participate.fillForm)
  const {before,today} = useSelector(rootState => rootState.activity.participate.dailyQuestion)
  const {state, matchResult, favor, lastChoose, left,refund} = useSelector(rootState => rootState.activity.participate.match)
  const leftTime = formatLeftTime(left)
  const [lightUp,setLightUp] = useState([false,false,false,false])
  const [fund,setFund] = useState(true)

  useEffect(()=>{
    let tmpLightUp = lightUp
    let tmpFund = fund
    before.map((item,index)=>{
      tmpLightUp[index]=item.value!=='' && item.approval && item.index<today.index
      tmpFund = tmpFund && tmpLightUp[index]
    })

    setLightUp([...tmpLightUp])
    setFund(tmpFund)
  },[before])

  function formatLeftTime(leftMss: number) {
    const day = Math.floor(leftMss / (1000 * 60 * 60 * 24));
    const hour = Math.floor((leftMss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minute = Math.floor((leftMss % (1000 * 60 * 60)) / (1000 * 60));
    return day === 0 ? `${hour}小时${minute}分` : `${day}天${hour}小时`
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
        {state === 'ACTIVE' && (
          <Watermark success={matchResult} type='match'/>
        )}
        <View className='col left'>
          <View className='id'>3</View>
          <Image lazyLoad src={(state && state === 'ACTIVE' && !matchResult) ? StepGreyIcon : StepIcon}
            className='img'/>
        </View>

        <View className='col main'>
          <View className='title'>相识·智能匹配</View>
          <View className='detail'>匹配结果会在{resultShowTime}前公布，请耐心等待</View>
          <View
            className={classnames(
              'note',
              {'note-failed': state && state === 'ACTIVE' && !matchResult}
            )}
          >若匹配失败，100%退全款</View>
        </View>
        <View className='col right'>
        <ActiveBtn type='seeResult' onClick={goToSeeResult}/>
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
        state === "ACTIVE" && matchResult && favor !== null &&
        <View>
          <View className='row feedback-card'>
            <View className='feedback'>
              <View className='row title'>
                <Image src={HeartBeatIcon} className='icon'/>
                每日一问
              </View>
              {
                today &&
                  <View className='qa'>
                    <QACard question={today} disabled={today.index >= 4}/>
                  </View>
              }
              <View className='split'>
                <DayCounter index={today.index} lightUp={lightUp} fund={fund}/>
              </View>
              {
                before && before.length > 0 &&
                <View className='qa'>
                  <QACard question={before[before.length - 1]} isAnswer/>
                </View>
              }
            </View>
          </View>

        </View>
      }
    </View>
  )
}

export default MatchCard
