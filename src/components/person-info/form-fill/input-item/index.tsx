import {Text, View} from "@tarojs/components";
import {Field, Image, Input, Textarea} from "@taroify/core";
import {SUBJECT_QUESTION, WARNING_MSG, WARNING_NOTE} from "@/utils/constant";
import {floatRegTest, wechatNumberRegTest} from "@/utils/reg";
import './index.scss'

export interface IInputItemProps {
  label: string,
  readonly: boolean,
  value: string | undefined,
  placeholder: string,
  inputType: 'string' | 'number' | 'wechatnumber' | 'long-input',
  showMsg: boolean,
  omissible?:boolean,
  onChange: any
}

const InputItem = (props: IInputItemProps)=>{
  return(

      props.inputType==='long-input'?(
        <View className='form-item form-item-subject'>
          <Text className='question'>{props.label}</Text>
          <Field className='field'>
            <Textarea
              placeholder='请输入'
              limit={100}
              value={props.value?props.value:''}
              onInput={(e) => {
                if(e.detail.value.length <=100){
                  props.onChange(e.detail.value)
                } else {
                  props.onChange(e.detail.value.slice(0,100))
                }
              }}
            />
          </Field>
          {props.showMsg && !props.value &&
            <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
        </View>
      ):(
        <View className='form-item'>
          <Text className='label'>{props.label}</Text>
          <Field className='field'>
            <Input
              placeholder={props.placeholder}
              value={props.value ? props.value : ''}
              readonly={props.readonly}
              onChange={(e)=>props.onChange(e.detail.value)}
            />
          </Field>
          {!props.omissible && props.showMsg && !props.value &&
            <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
          {!props.omissible && props.inputType === 'number' && props.value && !floatRegTest(props.value) &&
            <View className='field-note'>{WARNING_MSG[WARNING_NOTE.INVALID_NUMBER]}</View>}
          {!props.omissible && props.inputType === 'wechatnumber' && props.value && !wechatNumberRegTest(props.value) &&
            <View className='field-note'>{WARNING_MSG[WARNING_NOTE.INVALID_WECAHT]}</View>}
        </View>
      )
  )
}
export default InputItem
