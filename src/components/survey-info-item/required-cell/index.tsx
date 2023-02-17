import {useEffect, useRef, useState} from "react";
import {Cell, Field, Image, Input, Popup} from "@taroify/core";
import {ScrollView, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {PersonalAddOther, PersonalInfoUnchosen, PersonInfoChosenGrey, PersonInfoChosenGreyLight} from "@/assets/images";
import {useSelector} from "react-redux";
import {
  AddressData,
  CHECK_TYPE,
  TOAST_SHOW_TIME,
  WARNING_MSG,
  WARNING_NOTE
} from "@/utils/constant";
import classnames from "classnames";
import {ArrowDown, ArrowUp} from "@taroify/icons";
import {
  checkMultiChoices,
  checkMultiChoicesWithOther,
  checkMultiChoicesWithOtherTogether,
  checkOtherChoiceState,
  checkString, combineChoices,
  combineOthers, findOthers, generateAnswerString,
  isOthers, splitOthers
} from "@/utils/fcheck";
import {IMultiChoice, IOption} from "@/typings/types";
import './index.scss'


export interface SurveyMultiCellProps {
  title: string,
  answer: string | undefined,
  modifiable: boolean,
  multiChoices: IOption[] | undefined,
  multiChoiceLimitRestrict: number | undefined,
  otherType:'input' | 'picker' | 'none',
  otherValue?: string,
  onConfirm: any,
}

const SurveyMultiCell = (props: SurveyMultiCellProps) => {
  const {global} = useSelector((state) => state)
  const {state, filled} = useSelector(rootState => rootState.activity.participate.fillForm)

  const {windowWidth} = global.system!
  const [popupOpen,setPopupOpen] = useState(false)
  const [cellValue,setCellValue] = useState('')
  const [multiChoices, setMultiChoices] = useState<IOption[]>(props.multiChoices?[...props.multiChoices]:[])

  const [feedbackValue, setFeedbackValue] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)

  useEffect(()=>{
    if(props.multiChoices){
      setMultiChoices([...props.multiChoices])
      if(checkMultiChoices(props.multiChoices)){
        setCellValue(combineChoices(props.multiChoices,true))
        return
      }
    }
    setCellValue('请选择')
  },[props])

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
      return checkMultiChoices(multiChoices)
  }

  const onCancel = () => {
    setPopupOpen(false)
  }

  const onConfirm = () => {
    if (checkCanSubmit()) {
      props.onConfirm({choice:multiChoices})
      onCancel()
    } else {
      setCanSubmit(false)
      setShowFeedback(true)

    }
  }

  return (
    <>
      <Cell
        className='form-cell form-qa-cell'
        title={props.title}
        clickable={props.modifiable}
        align='center'
        onClick={async () => {
          if(props.modifiable){
            setMultiChoices(props.multiChoices?props.multiChoices:[])
            setPopupOpen(true)
            if(state==='ACTIVE' && filled){
              await Taro.showToast({
                title: "您已提交本期活动问卷，暂时不可修改～",
                duration: TOAST_SHOW_TIME,
                icon: 'none'
              })
            }
            else {
              setMultiChoices(props.multiChoices?props.multiChoices:[])
              setPopupOpen(true)
            }
          }else{
            await Taro.showToast({
              title: "您已提交本期活动问卷，暂时不可修改～", duration: 2000, icon: 'none'
            })
          }

        }}
      >
        <View className='value qa-value'>
          {!checkString(props.answer) && <View className='dot'/>}
          <Text>{cellValue}</Text>
        </View>
      </Cell>

      <Popup className='form-popup' open={popupOpen} rounded placement='bottom' onClose={()=>setPopupOpen(false)}>
        <Popup.Backdrop/>
        <View className='popup-title'>
          {props.title}
        </View>

          <View className='check-body'>
            <ScrollView className='card-scroll' showScrollbar={false} enableFlex scrollY scrollWithAnimation style={{width: `${0.9*windowWidth}`}}>
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
        </ScrollView>
      </View>
        {showFeedback && feedbackValue && feedbackValue !== '' &&
          <View className='warning-note'>{feedbackValue}</View>}
        <View className={classnames('confirm-btn', {'confirm-btn-disabled': !canSubmit})} onClick={() => {
          onConfirm()
        }}
        >确认</View>

      </Popup>
    </>
  );
}

export default SurveyMultiCell;
