import {QaQuestionIcon , QaAnswerIcon,QaReachActiveFund,QaReachGreyFund,QaActiveReach,QaGreyReach,QaGreySteps,QaGreyFund,FullLike,BlankLike} from "@/assets/images";

import {View,Text, Label, Checkbox} from "@tarojs/components";
import {Field, Image, Input, Textarea} from "@taroify/core";
import classnames from "classnames";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {sendFavor,sendAns} from "@/actions";
import {IQuestionState} from "@/typings/types";
import {answerQuestion, approvalAnswer, fetchMatchQuestion} from "@/actions/activity";

import './index.scss';

interface QAProps{
  disabled: boolean
  isAnswer: boolean
  question: IQuestionState
}

interface DayCounterProps{
  index: number
  lightUp: boolean[]
  fund: boolean
}

const DayCounter = (props: DayCounterProps) => {
  const {index,fund,lightUp} = props
  return (
    <View className='day-container'>
      {lightUp.map((up, i) => (
        <>
          <View className='day'>
            <View className='icon-container'>
              <Image src={index > i ? (up ? QaActiveReach : QaGreyReach) : QaGreySteps} className='icon'/>
              <View className='text'>
                <View className={index > i ? 'reach-color' : 'unreach-color'}>{i+1}</View>
              </View>
            </View>
          </View>

          <View className='day-line'>
            <View className={index > i ? (up ? 'day-line-solid' : 'day-line-grey') : 'day-line-dash'}/>
          </View>

        </>
      ))}

      <View className='day'>
        <View className='icon-container'>
          <Image src={index>=4? (fund ? QaReachActiveFund:QaReachGreyFund ): QaGreyFund} className='icon'/>
        </View>
      </View>
    </View>
  )
}

const QACard = (props: QAProps) =>{
  const dispatch = useDispatch()
  const activityId = useSelector(rootState=>rootState.activity.id)
  const {disabled,isAnswer} = props
  const {id,question,value,approval,index} = props.question
  const {identified} = useSelector(rootState => rootState.user)
  const [inputValue,setInputValue] = useState('')
  const [approved,setApproved] = useState(approval)
  const [inputFocus,setInputFocus] = useState(false)
  const handleSubmitAnswer = ()=>{
    if(inputValue != ''){
      dispatch(answerQuestion({activityId,questionId:id,answer:inputValue}))
      setInputFocus(false)
    }
  }

  const handleApproval = ()=>{
    if(value){
      dispatch(approvalAnswer({activityId,questionId:id,approval:!approved}))
      setApproved(!approved)
    }
  }

  const handleInputFocus = ()=>{
    setInputFocus(true)
  }

  const handleInputBlur = ()=>{
    setInputFocus(false)
  }

  return (
    <>
      {isAnswer?(
        <View className='qa-container'>
          <Text className='qa-title'>Ta的回答</Text>
          <View className='col qa-question'>
            <Image src={QaQuestionIcon} className='icon'/>
            <View className='text'>
              {question}
            </View>
          </View>
          <View className='col qa-question'>
            <Image src={QaAnswerIcon} className='icon'/>
            <View className='text'>
              {value?value:'Ta没有回答...'}
            </View>
            <Image src={approved?FullLike:BlankLike} className='qa-like' onClick={handleApproval}/>
          </View>
        </View>
      ):(
        <View className='qa-container'>
          <Text className='qa-title'>Ta的提问</Text>
          <View className='col qa-question'>
            <Image src={QaQuestionIcon} className='icon'/>
            <View className='text'>
              {question}
            </View>
          </View>
          <View className={classnames('row qa-input-field',{'qa-input-focus':inputFocus})}>
            <Field>
              <Textarea
                disabled={disabled}
                className={classnames('qa-textarea',{'qa-textarea-disabled': disabled})}
                placeholder='点击此处输入'
                value={disabled?value:inputValue}
                maxlength={100}
                onChange={(e) => setInputValue(e.detail.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                autoHeight
              />
              <View className={classnames('qa-submit',{'qa-submit-allow':inputValue!==''&&inputFocus})}  onClick={handleSubmitAnswer}>确认</View>
            </Field>

          </View>
          <View className='qa-desp'>问答内容将在次日公开给双方，连续4天获得对方点赞并双选成功，可找小助手领取纪念礼品</View>
        </View>
      )
      }
    </>
  )
}

export {DayCounter,QACard}
