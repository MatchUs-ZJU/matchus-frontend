import {Button, View, ViewProps} from "@tarojs/components";
import {ActiveBtn, DisableBtn, NotStartBtn} from "@/components/activity-card/right-buttons";
import Taro from "@tarojs/taro";
import classnames from "classnames";
import Watermark from "@/components/activity-card/watermark";
import {Dialog, Field, Image, Switch, Textarea} from "@taroify/core";
import {StepGreyIcon, StepIcon} from "@/assets/images";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {sendTwcResult, sendMessage} from "@/actions";
import {Records} from "@taroify/icons";

import './index.scss'

interface ChooseCardProps extends ViewProps {
  activity: number | string
  startTime: string
  endTime: string
}

const ChooseCard = (props: ChooseCardProps) => {
  const dispatch = useDispatch()
  const {activity, startTime, endTime} = props
  const {
    state,
    choice,
    message,
    hasResult,
    chooseResult
  } = useSelector(rootState => rootState.activity.participate.choose)
  const [thisChoice, setThisChoice] = useState(false)
  const [inputFocus,setInputFocus] = useState(false)
  const [textAreaFilled, setTextAreaFilled] = useState(false)
  const [textAreaContent, setTextAreaContent] = useState('')

  async function goToSeeResult() {
    await Taro.navigateTo({
      url: '/pages/activity/choose-result/index'
    })
  }

  function onChooseChange(value: boolean) {
    setThisChoice(value)
    dispatch(sendTwcResult({id: activity, choose: value}))
  }

  function onTextAreaChange(e) {
    if (e.detail.value && e.detail.value.length) {
      setTextAreaFilled(true)
    } else {
      setTextAreaFilled(false)
    }

    setTextAreaContent(e.detail.value)
  }

  function confirmSubmit() {
    if (textAreaContent && textAreaContent.length) {
      dispatch(sendMessage({message: textAreaContent, id: activity}))
    }
  }

  useEffect(() => {
    setTextAreaContent(message)
    setTextAreaFilled(message !== null && message.length !== 0)
  }, [message])

  useEffect(() => {
    setThisChoice(choice)
  }, [choice])

  return (
    <View className='card-container'>
      <View
        className={classnames(
          'row',
          'activity-card',
          {'activity-card-sheltered': state && state !== 'ACTIVE'},
          {'activity-card-choosed': state && state =='ACTIVE' && thisChoice},
          {'activity-card-success': state && state === 'ACTIVE' && hasResult && chooseResult},
          {'activity-card-fail': state && state === 'ACTIVE' && hasResult && !chooseResult}
        )}
      >
        {state === 'ACTIVE' && hasResult && (
          <Watermark success={chooseResult} type='choose'/>
        )}
        <View className='col left'>
          <View className='id'>4</View>
          <Image lazyLoad src={(state && state === 'ACTIVE' && hasResult && !chooseResult) ? StepGreyIcon : StepIcon} className='img'/>
        </View>
        <View className='col main'>
          <View className='title'>????????????????????</View>
          <View className='detail'>
            {state !== 'ACTIVE' ? `??????????????????${startTime}???????????????????????????` :
              hasResult && chooseResult ? '??????????????????????????????????????????????????????????????????' :
                hasResult && !chooseResult ? '????????????????????????Ta???????????????????????????' :
              '???????????????????????????????????? ??? ??????Ta'}
          </View>
          <View
            className={classnames(
              'note',
              {'note-failed': state && state === 'ACTIVE' && hasResult && !chooseResult}
            )}
          >
            {state !== 'ACTIVE' ? `??????????????????${endTime}??????`
              : !hasResult ? `????????????????????????${endTime}`
                : chooseResult ? '????????????'
                  : '????????????Ta????????????'}
          </View>
        </View>
        <View className='col right'>
          {state === 'NOT_START' ? (
            <NotStartBtn type='notStart'/>
          ) : state === 'ACTIVE' && !hasResult ? (
            <View className='col choose'>
              <Switch size='30px' onChange={onChooseChange} checked={thisChoice}/>
              <View
                className={classnames(
                  'note',
                  {'checked': thisChoice}
                )}
              >{thisChoice ? '' : '???'}???Ta</View>
            </View>
          ) : state === 'ACTIVE' && hasResult && chooseResult ? (
            <ActiveBtn type='seeResult' onClick={goToSeeResult}/>
          ) : state === 'ACTIVE' && hasResult && !chooseResult ? (
            <View className='btn-failed' onClick={goToSeeResult}>
              ????????????
            </View>
          ) : (
            <DisableBtn type='disable'/>
          )}
        </View>
      </View>
      {
        state === "ACTIVE" && !hasResult &&
        <View className='row message-board-container'>
          <View className='col message-board'>
            <View className='row title'>
              <Records style={{color: "#918AE3", marginRight: '6px'}} size='20px'/>
              ?????????
            </View>
            <View className='desc'>????????????Ta?????????????????????????????????????????????</View>
            <View className={classnames('row textarea-wrapper', {'textarea-wrapper-focus': inputFocus})}>
              <Field>
                <Textarea autoHeight className='msg-textarea' placeholder='??????????????????' value={textAreaContent} onChange={onTextAreaChange} onFocus={()=>setInputFocus(true)} onBlur={()=>setInputFocus(false)}/>
                <View
                  className={classnames(
                    'confirm-btn',
                    {
                      'confirm-btn-click': textAreaFilled && inputFocus,
                    })}
                  onClick={confirmSubmit}
                >
                  ??????
                </View>
              </Field>
            </View>

          </View>
        </View>
      }
    </View>
  )
}

export default ChooseCard
