import {useEffect, useState} from "react";
import {Image, Popup, Slider} from "@taroify/core";
import {ScrollView, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {PersonalInfoUnchosen} from "@/assets/images";
import {useSelector} from "react-redux";
import {QUESTION_TYPE, TOAST_SHOW_TIME, WARNING_MSG, WARNING_NOTE} from "@/utils/constant";
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
  const {user, global} = useSelector((state) => state)
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

  useEffect(() => {

    if(props.type === QUESTION_TYPE.RANGE)
      setRangeQuestion(props.rangeQuestion)
    else if(props.type === QUESTION_TYPE.MULTI_CHOICE)
      setMultiChoices(props.multiChoices ? props.multiChoices : [])
  }, [props])

  useEffect(() => {
    const thisCheck = checkCanSubmit()
    setCanSubmit(thisCheck)
    if (checkMultiChoices(multiChoices)) {
      setFeedbackValue('')
    } else {
      setFeedbackValue(WARNING_MSG[WARNING_NOTE.AT_LEAST_ONE])
    }
  }, [multiChoices])

  const checkCanSubmit = () => {
    if(props.type === QUESTION_TYPE.MULTI_CHOICE)
      return checkMultiChoices(multiChoices)
    return true
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
        <View className='survey-slider-wrapper'>
          <Slider className='survey-slider' range
            defaultValue={[+rangeQuestion.option[0].choice, +rangeQuestion.option[1].choice]} step={1}
            min={+rangeQuestion.option[0].choice} max={+rangeQuestion.option[1].choice} size={3}
            value={rangeQuestion.rangeAnswer ? rangeQuestion.rangeAnswer : [+rangeQuestion.option[0].choice, +rangeQuestion.option[1].choice]}
            onChange={(value) => {
                    setRangeQuestion({...rangeQuestion, rangeAnswer: [...value]})
                  }}
          >
            <Slider.Thumb><Text
              className='slider-text'
            >{rangeQuestion.rangeAnswer ? rangeQuestion.rangeAnswer[0] : rangeQuestion.option[0].choice}</Text></Slider.Thumb>
            <Slider.Thumb><Text
              className='slider-text'
            >{rangeQuestion.rangeAnswer ? rangeQuestion.rangeAnswer[1] : rangeQuestion.option[1].choice}</Text></Slider.Thumb>
          </Slider>
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
