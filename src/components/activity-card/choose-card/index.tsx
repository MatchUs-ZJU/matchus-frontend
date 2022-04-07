import {View, ViewProps} from "@tarojs/components";
import {ActiveBtn, DisableBtn, NotStartBtn} from "@/components/activity-card/right-buttons";
import Taro from "@tarojs/taro";
import classnames from "classnames";
import Watermark from "@/components/activity-card/watermark";
import {Collapse, Image, Switch, Textarea} from "@taroify/core";
import {StepIcon} from "@/assets/images";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {sendTwcResult} from "@/actions";

import './index.scss'
import {ArrowDown, ArrowUp, Records} from "@taroify/icons";
import {sendMessage} from "@/actions/activity";

interface ChooseCardProps extends ViewProps {
  activity: number | string
  startTime: string
  endTime: string

  state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
  choice: boolean,
  message: string,
  hasResult: boolean,
  chooseResult: boolean
}

const ChooseCard = (props: ChooseCardProps) => {
  const dispatch = useDispatch()
  const {activity, startTime, endTime, state, choice, message, hasResult, chooseResult, ...restProps} = props
  const [thisChoose, setThisChoose] = useState(false)
  const [textAreaFilled, setTextAreaFilled] = useState(false)
  const [textAreaContent, setTextAreaContent] = useState(message)
  const [expand, setExpand] = useState(false)

  async function goToSeeResult() {
    await Taro.navigateTo({
      url: '/pages/activity/match-result/index'
    })
  }

  function onChooseChange(value: boolean) {
    setThisChoose(value)
    dispatch(sendTwcResult(value))
  }

  function onTextAreaChange(e) {
    if(e.detail.value && e.detail.value.length) {
      setTextAreaFilled(true)
    } else {
      setTextAreaFilled(false)
    }
    setTextAreaContent(e.detail.value)
  }

  function onConfirmCommit() {
    if(textAreaContent && textAreaContent.length) {
      dispatch(sendMessage(textAreaContent))
    }
  }

  return (
    <View className='card-container'>
      <View
        className={classnames(
          'row',
          'activity-card',
          {'activity-card-sheltered': state && state !== 'ACTIVE'},
          {'activity-card-success': state && state === 'ACTIVE' && hasResult && chooseResult},
          {'activity-card-fail': state && state === 'ACTIVE' && hasResult && !chooseResult}
        )}
      >
        {state === 'ACTIVE' && hasResult && (
          <Watermark success={chooseResult} type='choose'/>
        )}
        <View className='col left'>
          <View className='id'>4</View>
          <Image lazyLoad src={StepIcon} className='img'/>
        </View>
        <View className='col main'>
          <View className='title'>相惜·双选阶段</View>
          <View className='detail'>
            {state !== 'ACTIVE' ? `双选通道会在${startTime}开放，请认真抉择哦！` : '每一次匹配都来之不易，希望大家好好珍惜，不要错过！'}
          </View>
          <View className='note'>
            {state !== 'ACTIVE' ? `双选阶段于${startTime}开启`
              : !hasResult ? `双选阶段截止时间${endTime}`
                : chooseResult ? '双选成功'
                  : '很遗憾，Ta没有选你'}
          </View>
        </View>
        <View className='col right'>
          {state === 'NOT_START' ? (
            <NotStartBtn type='notStart'/>
          ) : state === 'ACTIVE' && !hasResult ? (
            <View className='col choose'>
              <Switch size='30px' onChange={onChooseChange}/>
              <View
                className={classnames(
                  'note',
                  {'checked': thisChoose}
                )}
              >{thisChoose ? '' : '不'}选Ta</View>
            </View>
          ) : state === 'ACTIVE' && hasResult && chooseResult ? (
            <ActiveBtn type='seeResult' onClick={goToSeeResult}/>
          ) : state === 'ACTIVE' && hasResult && !chooseResult ? (
            <View className='btn-failed'>
              查看结果
            </View>
          ) : (
            <DisableBtn type='disable'/>
          )}
        </View>
      </View>
      {
        state === "ACTIVE" &&
        <View className='row message-board-container'>
          <View className='col message-board'>
            <View className='row title'>
              <Records style={{color: "#918AE3", marginRight: '6px'}} size='16px'/>
              留言板
            </View>
            <View className='desc'>写下想对Ta说的话，双选结束后将展示给对方</View>
            <Textarea className='textarea' placeholder='点击此处输入' value={textAreaContent} onChange={onTextAreaChange}/>
            <View
              className={classnames(
                'confirm-btn',
                {
                  'confirm-btn-click': textAreaFilled,
                })}
              onClick={onConfirmCommit}
            >
              确认
            </View>
          </View>
        </View>
      }
    </View>
  )
}

export default ChooseCard
