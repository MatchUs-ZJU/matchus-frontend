import {Button, View, ViewProps} from "@tarojs/components";
import {ActiveBtn, DisableBtn, NotStartBtn} from "@/components/activity-card/right-buttons";
import Taro from "@tarojs/taro";
import classnames from "classnames";
import Watermark from "@/components/activity-card/watermark";
import {Dialog, Field, Image, Switch, Textarea} from "@taroify/core";
import {
  ChooseAcceptChosen,
  ChooseAcceptUnchosen,
  ChooseRejectChosen,
  ChooseRejectUnchosen,
  StepGreyIcon,
  StepIcon
} from "@/assets/images";
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
  const [rejectChosen,setRejectChosen] = useState(false)
  const [acceptChosen,setAcceptChosen] = useState(false)
  const [thisChoice, setThisChoice] = useState<boolean | null>(null)
  const [inputFocus,setInputFocus] = useState(false)
  const [textAreaFilled, setTextAreaFilled] = useState(false)
  const [textAreaContent, setTextAreaContent] = useState('')

  async function goToSeeResult() {
    await Taro.navigateTo({
      url: '/pages/activity/choose-result/index'
    })
  }

  function onChooseChange(value: boolean | null) {
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
          <View className='title'>相惜·双选阶段</View>
          <View className='detail'>
            {state !== 'ACTIVE' ? `双选通道会在${startTime}开放，请认真抉择哦` :
              hasResult && chooseResult ? '恭喜你们双选成功，希望未来能听到更多的好消息' :
                hasResult && !chooseResult ? '别灰心，也许那个Ta正在不远的未来等你' :
              '做出你的选择➔'}
          </View>
          <View
            className={classnames(
              'note',
              {'note-failed': state && state === 'ACTIVE' && hasResult && !chooseResult}
            )}
          >
            {state !== 'ACTIVE' ? `双选结果将于${endTime}公布`
              : !hasResult ? `双选阶段截止时间${endTime}`
                : chooseResult ? '双选成功'
                  : '很遗憾，Ta没有选你'}
          </View>
        </View>
        <View className='col right'>
          {state === 'NOT_START' ? (
            <NotStartBtn type='notStart'/>
          ) : state === 'ACTIVE' && !hasResult ? (
            <View className='row choose choose-active'>
              <View className='col btn-wrapper'>
                <Image
                  className='btn'
                  src={thisChoice === false ?ChooseRejectChosen:ChooseRejectUnchosen}
                  onClick={()=> {
                    if(thisChoice || thisChoice === null){
                      onChooseChange(false)
                    }
                    else if(thisChoice === false){
                      onChooseChange(null)
                    }
                  }}
                />
                <View className='note'>不选Ta</View>
              </View>
              <View className='col btn-wrapper'>
                <Image
                  className='btn'
                  src={thisChoice === true ?ChooseAcceptChosen:ChooseAcceptUnchosen}
                  onClick={()=> {
                    if(!thisChoice){
                      onChooseChange(true)
                    }else{
                      onChooseChange(null)
                    }
                  }}
                />
                <View className='note'>选Ta</View>
              </View>
            </View>
          ) : state === 'ACTIVE' && hasResult && chooseResult ? (
            <ActiveBtn type='seeResult' onClick={goToSeeResult}/>
          ) : state === 'ACTIVE' && hasResult && !chooseResult ? (
            <View className='btn-failed' onClick={goToSeeResult}>
              查看结果
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
              留言板
            </View>
            <View className='desc'>写下想对Ta说的话，双选结束后将展示给对方</View>
            <View className={classnames('row textarea-wrapper', {'textarea-wrapper-focus': inputFocus})}>
              <Field>
                <Textarea autoHeight className='msg-textarea' placeholder='点击此处输入' value={textAreaContent} onChange={onTextAreaChange} onFocus={()=>setInputFocus(true)} onBlur={()=>setInputFocus(false)}/>
                <View
                  className={classnames(
                    'confirm-btn',
                    {
                      'confirm-btn-click': textAreaFilled && inputFocus,
                    })}
                  onClick={confirmSubmit}
                >
                  确认
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
