import {CHECK_TYPE, SUBJECT_QUESTION, TOAST_SHOW_TIME, WARNING_MSG, WARNING_NOTE} from "@/utils/constant";
import {IMultiChoice, ISingleChoice} from "@/typings/types";
import {useEffect, useState} from "react";
import {AreaPicker, Cell, Field, Input, Popup, Radio, Textarea} from "@taroify/core";
import {Text, View} from "@tarojs/components";
import {checkRadio, combineOthers, fillOthers, isOthers, splitOthers} from "@/utils/fcheck";
import Taro, {setPageInfo, useDidShow} from "@tarojs/taro";
import classnames from "classnames";
import {useSelector} from "react-redux";
import './index.scss'

export interface ISingleChoiceCellProps{
  title: string,
  singleChoice: ISingleChoice | undefined,
  selectedChoice: string | undefined,
  onConfirm: any
}

const SingleChoiceCell = (props: ISingleChoiceCellProps)=>{
  const {user} = useSelector((state) => state)
  const [popupOpen,setPopupOpen] = useState(false)
  const [singleChoice,setSingleChoice] = useState(props.singleChoice? props.singleChoice:{question:'',choices:[]})
  const [selectedChoice,setRadioValue] = useState(props.selectedChoice?props.selectedChoice:'')

  const [otherWarning,setOtherWarning] = useState(false)
  const [warningMsg,setWarningMsg] = useState('')
  const [showWarning,setShowWarning] = useState(false)

  useEffect(()=>{
    setWarningMsg('')
    setShowWarning(false)
    setSingleChoice(props.singleChoice?props.singleChoice:{question: '', choices: []})
    setRadioValue(props.selectedChoice?props.selectedChoice:'')
  },[props])

  const checkCanSubmit = ()=>{
    return checkRadio(selectedChoice)
  }

  useEffect(()=>{
    if(!checkCanSubmit()){
      setWarningMsg(WARNING_MSG[WARNING_NOTE.PLZ_CHOOSE_ONE])
    }
    else {
      setShowWarning(false)
      setWarningMsg('')
    }
  },[selectedChoice])

  const onConfirm = ()=>{
    if(checkCanSubmit()){
      props.onConfirm(selectedChoice)
      setPopupOpen(false)
    }
    else{
      setShowWarning(true)
    }
  }

  return (
    <>
      <Cell
        className={classnames('form-cell', {'form-qa-cell': props.singleChoice})}
        title={props.title}
        align='center'
        onClick={async () => {
          if(!user.isChangeable){
            await Taro.showToast({
              title: "您已成功报名，暂时不可修改～",
              duration: TOAST_SHOW_TIME,
              icon: 'none'
            })
          }
          else {
            setSingleChoice(props.singleChoice?props.singleChoice:{question: '', choices: []})
            setRadioValue(props.selectedChoice?props.selectedChoice:'')
            setPopupOpen(true)
          }
        }}
      >
        <View className={classnames('value', {'qa-value': props.singleChoice})}>
          {!props.singleChoice && <View className='dot'/>}
          <Text>{props.selectedChoice ?splitOthers(props.selectedChoice) : '请填写'}</Text>
        </View>
      </Cell>

      <Popup
        className='form-popup'
        open={popupOpen}
        onClose={()=>setPopupOpen(false)}
        rounded placement='bottom'
      >
        <Text className='popup-title'>修改回答</Text>
        <View className='radio-body'>
          <Text className='question'>{singleChoice.question}</Text>
          <Radio.Group
            size={20}
            direction='vertical'
            onChange={(value)=> {
              if(value === '其他'){
                setRadioValue(value)
              }
              else{
                setRadioValue(value)
              }

            }}
            value={isOthers(selectedChoice)?'其他':selectedChoice}
          >
            {
              singleChoice.choices.map((item)=>(
                <>
                  <Radio shape='round' name={item}>{item}</Radio>
                </>
              ))
            }
          </Radio.Group>
          { isOthers(selectedChoice) &&
            <Field className='field'>
              <Textarea
                placeholder='请输入'
                limit={100}
                style='max-height:100px'
                value={splitOthers(selectedChoice)}
                onChange={(e) => {
                  setRadioValue(combineOthers(e.detail.value))}
                }
              />
            </Field>}
          {showWarning && warningMsg && <View className='field-note'>{warningMsg}</View>}
        </View>
        <View className={classnames('confirm-btn', {'confirm-btn-disabled': !checkCanSubmit()})} onClick={() => {
          onConfirm()
        }}
        >确认</View>
      </Popup>
    </>
  )
}

export default SingleChoiceCell
