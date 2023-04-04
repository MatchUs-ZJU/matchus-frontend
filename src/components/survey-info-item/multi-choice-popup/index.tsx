import {useEffect, useState} from "react";
import {Image, Picker, Popup} from "@taroify/core";
import {ScrollView, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {PersonalInfoUnchosen} from "@/assets/images";
import {useSelector} from "react-redux";
import {QUESTION_TYPE, TOAST_SHOW_TIME, WARNING_NOTE} from "@/utils/constant";
import classnames from "classnames";
import {checkMultiChoices} from "@/utils/fcheck";
import {IMultiChoice, IOptionalItem} from "@/typings/types";
import './index.scss'


export interface MultiChoicePopUpProps {
  type: QUESTION_TYPE,
  title: string,
  modifiable: boolean,
  multiChoices?: IMultiChoice[] | undefined,
  rangeQuestion?: IOptionalItem | undefined
  multiChoiceLimitRestrict: number | undefined,
  onConfirm: any,
  onClose: any,
  open: boolean
}

const MultiChoicePopUp = (props: MultiChoicePopUpProps) => {
  const {global} = useSelector((state) => state)
  const {windowWidth} = global.system!
  // const [popupOpen,setPopupOpen] = useState(false)
  const [multiChoices, setMultiChoices] = useState(props.multiChoices ? props.multiChoices : [])
  const [rangeQuestion, setRangeQuestion] = useState<IOptionalItem | undefined>(
    {
      answer: "",
      depends: undefined,
      limit: 0,
      option: [],
      order: 0,
      otherType: undefined,
      properAnswer: [],
      questionId: 0,
      questionIndex: 0,
      questionType: QUESTION_TYPE.RANGE,
      rangeAnswer: [],
      required: false,
      title: ""
    }
  )

  const [feedbackValue, setFeedbackValue] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)
  const [range,setRange] = useState<number[]>([])
  useEffect(() => {
    if(props.type === QUESTION_TYPE.RANGE && props.rangeQuestion){
      const cnt = +props.rangeQuestion.option[1].choice - +props.rangeQuestion.option[0].choice+1
      setRange([...new Array(cnt).keys()].map( (i)=> i+(+ props.rangeQuestion.option[0].choice)))
      setRangeQuestion(props.rangeQuestion)
    }
    else if(props.type === QUESTION_TYPE.MULTI_CHOICE)
      setMultiChoices(props.multiChoices ? props.multiChoices : [])
    setCanSubmit(checkCanSubmit())
  }, [props])

  useEffect(() => {
    if(props.type === QUESTION_TYPE.MULTI_CHOICE){
      const thisCheck = checkCanSubmit()
      setCanSubmit(thisCheck)
      if (checkMultiChoices(multiChoices)) {
        setFeedbackValue('')
      } else {
        setFeedbackValue(WARNING_NOTE.AT_LEAST_ONE)
      }
    }
  }, [multiChoices])

  useEffect(() => {
    if(props.type === QUESTION_TYPE.RANGE){
      const thisCheck = checkCanSubmit()
      setCanSubmit(thisCheck)
      if(rangeQuestion && rangeQuestion.rangeAnswer && rangeQuestion.rangeAnswer[1] < rangeQuestion.rangeAnswer[0]){
        setFeedbackValue(WARNING_NOTE.INVALID_RANGE)
      }else{
        setFeedbackValue('')
      }
    }

  },[rangeQuestion])

  const checkCanSubmit = () => {
    if(props.type === QUESTION_TYPE.MULTI_CHOICE)
      return checkMultiChoices(multiChoices)
    return rangeQuestion && rangeQuestion.rangeAnswer ? rangeQuestion.rangeAnswer[0] <= rangeQuestion.rangeAnswer[1] : false
  }

  const onCancel = () => {
    props.onClose()
  }

  const onConfirm = () => {
    if (checkCanSubmit()) {
      if(props.type === QUESTION_TYPE.MULTI_CHOICE)
          props.onConfirm({choice: multiChoices})
      else if(props.type === QUESTION_TYPE.RANGE && rangeQuestion)
        props.onConfirm({choice: `${rangeQuestion.rangeAnswer ? rangeQuestion.rangeAnswer[0] : +rangeQuestion.option[0].choice}┋${rangeQuestion.rangeAnswer ? rangeQuestion.rangeAnswer[1] : +rangeQuestion.option[1].choice}` })
      onCancel()
    } else {
      Taro.showToast({title: feedbackValue,duration:2000,icon:'none'})
      setCanSubmit(false)
      setShowFeedback(true)
      return
    }
  }

  return (
    <Popup className='form-popup' open={props.open} rounded placement='bottom'>
      <Popup.Backdrop onClick={props.onClose}/>
      <View className='popup-title'>
        {props.title}
      </View>
      {props.type === QUESTION_TYPE.MULTI_CHOICE ? (
        <View className='check-body'>
          <ScrollView className='card-scroll' showScrollbar={false} enableFlex scrollY scrollWithAnimation
            style={{width: `${0.9 * windowWidth}`}}
          >
            {multiChoices &&
              <>
                {multiChoices.map((item, idx) => (
                    <View
                      className={classnames('row', 'check-label', {'check-label-selected': item.selected})}
                      onClick={async () => {
                        if (props.multiChoiceLimitRestrict && props.multiChoiceLimitRestrict > 0 && !item.selected && multiChoices.filter((it => it.selected)).length >= props.multiChoiceLimitRestrict) {
                          await Taro.showToast({
                            title: `最多只能选择${props.multiChoiceLimitRestrict}项～`,
                            duration: TOAST_SHOW_TIME,
                            icon: 'none'
                          })
                        } else {
                          let updatedMultiChoices = multiChoices
                          updatedMultiChoices[idx].selected = !updatedMultiChoices[idx].selected
                          setMultiChoices([...updatedMultiChoices])
                        }
                      }}
                    >
                      <Text
                        className={classnames('check-text', {'check-text-selected': item.selected})}
                      >{item.label}</Text>
                      {item.selected && <Image src={PersonalInfoUnchosen} className='selected-icon'/>}
                    </View>

                  )
                )}

              </>}
            {showFeedback && feedbackValue && feedbackValue !== '' &&
              <View className='warning-note'>{feedbackValue}</View>}
          </ScrollView>

        </View>
      ) : props.type === QUESTION_TYPE.RANGE && rangeQuestion && rangeQuestion.option.length>=2 ? (
          <View className='col range-picker'>
            <View className='row range-title'>
              <View>最低</View>
              <View>最高</View>
            </View>
            <Picker value={rangeQuestion.rangeAnswer?rangeQuestion.rangeAnswer:[range[0],range[range.length-1]]} onCancel={onCancel} onChange={(value) => setRangeQuestion({...rangeQuestion, rangeAnswer: [...value]})}>
              <Picker.Column>
                {
                  range.map((_item)=>
                    <Picker.Option value={_item}>{_item}</Picker.Option>
                  )
                }
              </Picker.Column>
              <Picker.Column>
                {
                  range.map((_item)=>
                    <Picker.Option value={_item}>{_item}</Picker.Option>
                  )
                }
              </Picker.Column>
            </Picker>
          </View>

      ) : (
        <>
        </>
      )
      }


      <View className={classnames('confirm-btn', {'confirm-btn-disabled': !canSubmit})} onClick={
        () => {
            onConfirm()
      }}
      >确认</View>
    </Popup>
  );
}

export default MultiChoicePopUp
