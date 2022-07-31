import {CHECK_TYPE, WARNING_MSG, WARNING_NOTE} from "@/utils/constant";
import {IMultiChoice, ISingleChoice} from "@/typings/types";
import {useEffect, useState} from "react";
import {AreaPicker, Field, Input, Popup, Radio, Textarea} from "@taroify/core";
import {Text, View} from "@tarojs/components";
import {checkRadio, combineOthers, fillOthers, isOthers, splitOthers} from "@/utils/fcheck";
import './index.scss'

export interface IMultiChoicePopup{
  type: CHECK_TYPE,
  open: boolean,
  radioData: ISingleChoice,
  radioChecked: string,
  selfChoice: string,
  onCancel: any,
  onConfirm: any
}

const MultiChoice = (props: IMultiChoicePopup)=>{
  const {onCancel,onConfirm,type,selfChoice} = props
  const [SingleData,setSingleData] = useState(props.radioData? props.radioData:{question:'',choices:[]})
  const [radioValue,setRadioValue] = useState(props.radioChecked?props.radioChecked:'')

  const [otherValue,setOtherValue] = useState(selfChoice)
  const [otherWarning,setOtherWarning] = useState(false)
  const [warningMsg,setWarningMsg] = useState('')
  const [showWarning,setShowWarning] = useState(false)
  useEffect(()=>{
    setWarningMsg('')
    setShowWarning(false)
    setOtherValue(props.selfChoice?props.selfChoice:'')
    setSingleData(props.radioData ? props.radioData : {question:'',choices:[]})
    setRadioValue(props.radioChecked?props.radioChecked:'')
  },[props])

  const checkCanSubmit = ()=>{
    return checkRadio(radioValue)
  }

  useEffect(()=>{
    if(!checkCanSubmit()){
      setWarningMsg(WARNING_MSG[WARNING_NOTE.PLZ_CHOOSE_ONE])
    }
    else {
      setShowWarning(false)
      setWarningMsg('')
    }
  },[radioValue])

  const onModalConfirm = ()=>{
    if(checkCanSubmit()){
      if(type === CHECK_TYPE.WECHAT_FIRST_TIME){
        onConfirm({wechatFirstTime: radioValue})
      } else if(type === CHECK_TYPE.BE_FRIEND){
        onConfirm({beFriend: radioValue})
      }else if(type === CHECK_TYPE.SHOW_LOVE){
        onConfirm({showLove: radioValue})
      }
      else if(type === CHECK_TYPE.IS_LOVER){
        onConfirm({isLover: radioValue})
      }
      else if(type === CHECK_TYPE.IS_LOVE_YOU){
        onConfirm({isLoveYou: radioValue})
      }
      onCancel()
    }
    else{
      setShowWarning(true)
    }
  }

  return (
    <Popup
      className='modal-popup'
      open={props.open}
      onClose={props.onCancel}
    >
      <View className='radio-body'>
        <Text className='question'>{SingleData.question}</Text>
        <Radio.Group
          size={20}
          className='radio-wrapper'
          direction='vertical'
          onChange={(value)=> {
            if(value === '其他'){
              setRadioValue(value)
            }
            else{
              setRadioValue(value)
            }

          }}
          value={isOthers(radioValue)?'其他':radioValue}
        >
          {
            SingleData.choices.map((item)=>(
              <>
                <Radio shape='square' name={item}>{item}</Radio>
              </>
            ))
          }
        </Radio.Group>
        { isOthers(radioValue) &&
          <Field className='field'>
            <Textarea
              placeholder='请输入'
              limit={100}
              style='max-height:100px'
              value={splitOthers(radioValue)}
              onChange={(e) => {
                setRadioValue(combineOthers(e.detail.value))}
              }
            />
          </Field>}
        {showWarning && warningMsg && <View className='field-note'>{warningMsg}</View>}
      </View>
      <View className='check-btn-wrapper'>
        <View className='btn btn-cancel' onClick={onCancel}>
          返回
        </View>
        <View className='btn btn-confirm' onClick={onModalConfirm}>
          确认
        </View>
      </View>
    </Popup>
  )
}

export default MultiChoice
