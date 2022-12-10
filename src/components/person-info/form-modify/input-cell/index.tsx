import {useEffect, useState} from "react";
import {Cell, Field, Input, Popup, Textarea} from "@taroify/core";
import {Text, View} from "@tarojs/components";
import {INPUT_TYPE, TOAST_SHOW_TIME, WARNING_MSG, WARNING_NOTE} from "@/utils/constant";
import classnames from "classnames";
import {Clear} from "@taroify/icons";
import {floatRegTest, wechatNumberRegTest} from "@/utils/reg";
import {checkString} from "@/utils/fcheck";
import {useSelector} from "react-redux";
import Taro from "@tarojs/taro";
import './index.scss'


export interface InputCellProps {
  title: string,
  modifiable: boolean,
  cellValue: string | undefined,

  inputType: INPUT_TYPE,
  rightText?:string,
  onConfirm: any,
}

const InputCell = (props: InputCellProps) => {
  const {user} = useSelector((state) => state)

  const [inputValue, setInputValue] = useState(props.cellValue ? props.cellValue : '')
  const [popupOpen,setPopupOpen] = useState(false)
  const [feedbackValue, setFeedbackValue] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)

  useEffect(() => {
      setInputValue(props.cellValue ? props.cellValue : '')
  }, [props])

  const checkCanSubmit = () => {
    if (checkString(inputValue)) {
      if (props.inputType === INPUT_TYPE.NUMBER) {
        return floatRegTest(inputValue)
      } else if (props.inputType === INPUT_TYPE.WECHAT_NUMBER) {
        return wechatNumberRegTest(inputValue)
      }
      return true
    } else return props.inputType === INPUT_TYPE.NOT_REQUIRED
    return false
  }

  // 输入
  useEffect(() => {
      setCanSubmit(checkCanSubmit())
      if (checkString(inputValue)) {
        if (props.inputType === INPUT_TYPE.NUMBER) {
          if (!floatRegTest(inputValue)) {
            setFeedbackValue(WARNING_MSG[WARNING_NOTE.INVALID_NUMBER])
            return
          }
        } else if (props.inputType === INPUT_TYPE.WECHAT_NUMBER && !wechatNumberRegTest(inputValue)) {
          setFeedbackValue(WARNING_MSG[WARNING_NOTE.INVALID_WECAHT])
          return
        }
      } else if(props.inputType !== INPUT_TYPE.NOT_REQUIRED){
        setFeedbackValue(WARNING_MSG[WARNING_NOTE.INVALID_BLANK])
      }
      setFeedbackValue('')
  }, [inputValue])

  const onConfirm = () => {
    if (checkCanSubmit()) {
      setPopupOpen(false)
    } else {
      setCanSubmit(false)
      setShowFeedback(true)
      return
    }
    props.onConfirm(inputValue)
  }

  return (
    <>
      <Cell
        className={classnames('form-cell', {'form-qa-cell': props.inputType===INPUT_TYPE.LONG_INPUT})}
        title={props.title}
        clickable={user.isChangeable}
        align='center'
        onClick={async () => {
          if (!props.modifiable) {
            await Taro.showToast({
              title: "暂不支持修改～",
              duration: TOAST_SHOW_TIME,
              icon: 'none'
            })
          }else if(!user.isChangeable){
            await Taro.showToast({
              title: "您已成功报名，暂时不可修改～",
              duration: TOAST_SHOW_TIME,
              icon: 'none'
            })
          }
          else {
            setPopupOpen(true)
          }
        }}
      >
        <View className={classnames('value',{'qa-value':props.inputType===INPUT_TYPE.LONG_INPUT})}>
          {!checkString(props.cellValue) && props.inputType!==INPUT_TYPE.NOT_REQUIRED && <View className='dot'/>}
          <Text>{props.cellValue? props.cellValue:'请填写'}</Text>
        </View>

      </Cell>

      <Popup className='form-popup' open={popupOpen} rounded placement='bottom' onClose={()=>setPopupOpen(false)}>
        <Popup.Backdrop/>
        <Text className='popup-title'>
          {props.inputType===INPUT_TYPE.LONG_INPUT?'修改回答':`修改${props.title}`}
        </Text>
        {props.inputType === INPUT_TYPE.LONG_INPUT ? (
          <View className='input-box long-input'>
            <Field
              className='field'
            >
              <Textarea
                placeholder='请输入'
                limit={100}
                value={inputValue ? inputValue : ''}
                onChange={(e) => {
                  if(e.detail.value.length<=100){
                    setInputValue(e.detail.value)
                  }else{
                    setInputValue(e.detail.value.slice(0,100))
                  }
                }}
              />
            </Field>
            {showFeedback && feedbackValue && feedbackValue !== '' &&
              <View className='warning-note'>{feedbackValue}</View>}
          </View>
        ) :  (
          <View className='input-box'>
            <Field
              className='input-field'
            >
              <Input
                autoFocus
                value={inputValue}
                onChange={(e) => {
                  if(e.detail.value.length < 20){
                    setInputValue(e.detail.value)
                  }
                }}
              />
              {props.inputType === INPUT_TYPE.NUMBER ? (
                <Text className='corner-text'>{props.rightText}</Text>
              ) : (
                <View className='corner-icon'>
                  <Clear style={{color: "rgba(0, 0, 0, 0.3)",zIndex:10}} onClick={() => setInputValue('')}/>
                </View>
              )}
            </Field>
            {showFeedback && feedbackValue && feedbackValue !== '' &&
              <View className='warning-note'>{feedbackValue}</View>}
          </View>
        ) }
        <View className={classnames('confirm-btn', {'confirm-btn-disabled': !canSubmit})} onClick={() => {
          onConfirm()
        }}
        >确认</View>
      </Popup>
    </>
  );
}

export default InputCell
