import {
  QaQuestionIcon,
  QaAnswerIcon,
  QaReachActiveFund,
  QaReachGreyFund,
  QaActiveReach,
  QaGreyReach,
  QaGreySteps,
  QaGreyFund,
  FullLike,
  BlankLike
} from "@/assets/images";

import {View, Text} from "@tarojs/components";
import {Field, Image, Textarea} from "@taroify/core";
import classnames from "classnames";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IQuestionState} from "@/typings/types";
import {answerQuestion, approvalAnswer} from "@/actions/activity";

import './index.scss';

interface QAProps {
  disabled?: boolean
  isAnswer?: boolean
  question: IQuestionState
}

interface DayCounterProps {
  index: number
  lightUp: boolean[]
  fund: boolean
}

const DayCounter = (props: DayCounterProps) => {
  const {index, fund, lightUp} = props
  return (
    <View className='day-container'>
      {lightUp.map((up, i) => (
        <>
          <View className='day'>
            <View className='icon-container'>
              <Image src={index > i ? (up ? QaActiveReach : QaGreyReach) : QaGreySteps} className='icon'/>
              <View className='text'>
                <View className={index > i ? 'reach-color' : 'unreach-color'}>{i + 1}</View>
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
          <Image src={index >= 4 ? (fund ? QaReachActiveFund : QaReachGreyFund) : QaGreyFund} className='icon'/>
        </View>
      </View>
    </View>
  )
}

const QACard = (props: QAProps) => {
  const dispatch = useDispatch()
  const activityId = useSelector(rootState => rootState.activity.id)
  const {disabled = false, isAnswer = false} = props
  const {id, question, value, approval} = props.question
  const [inputValue, setInputValue] = useState('')
  const [approved, setApproved] = useState(approval)
  const [inputFocus, setInputFocus] = useState(false)

  useEffect(() => {
    setApproved(approval)
  }, [approval])

  useEffect(() => {
    setInputValue(value ? value : '')
  }, [value])

  const handleSubmitAnswer = () => {
    if (inputValue != '' && id !== -1) {
      dispatch(answerQuestion({activityId, questionId: id, answer: inputValue}))
      setInputFocus(false)
    }
  }

  const handleApproval = () => {
    if (value && id !== -1) {
      dispatch(approvalAnswer({activityId, questionId: id, approval: !approved}))
    }
  }

  const handleInputFocus = () => {
    setInputFocus(true)
  }

  const handleInputBlur = () => {
    setInputFocus(false)
  }

  return (
    <>
      {isAnswer ? (
        <View className='qa-container'>
          <Text className='qa-title'>Ta?????????</Text>
          <View className='col qa-question'>
            <Image src={QaQuestionIcon} className='icon'/>
            <View className='text'>
              {question}
            </View>
          </View>
          <View className='col qa-question'>
            <Image src={QaAnswerIcon} className='icon'/>
            {value ?
              <>
                <View className='text'>
                  {value}
                </View>
                <Image src={approved ? FullLike : BlankLike} className='qa-like' onClick={handleApproval}/>
              </>
              : <View className='text'>Ta????????????...</View>}
          </View>
        </View>
      ) : (
        <View className='qa-container'>
          <View className='col qa-question'>
            <Image src={QaQuestionIcon} className='icon'/>
            <View className='text'>
              {question}
            </View>
          </View>
          <View className={classnames('row qa-input-field', {'qa-input-focus': inputFocus})}>
            <Field>
              <Textarea
                disabled={disabled}
                className={classnames('qa-textarea', {'qa-textarea-disabled': disabled})}
                placeholder='??????????????????'
                value={disabled ? value : inputValue}
                maxlength={100}
                onChange={(e) => setInputValue(e.detail.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                autoHeight
              />
              <View
                className={classnames('qa-submit', {'qa-submit-allow': inputValue !== '' && inputFocus})}
                onClick={handleSubmitAnswer}
              >
                ??????
              </View>
            </Field>
          </View>
          <View className='qa-desp'>????????????????????????????????????????????????4????????????????????????????????????????????????????????????????????????</View>
        </View>
      )
      }
    </>
  )
}

export {DayCounter, QACard}
