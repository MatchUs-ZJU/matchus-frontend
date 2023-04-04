import {useState} from "react";
import {AreaPicker, Backdrop, DatetimePicker, Field, Input, Picker} from "@taroify/core";
import {Text, View} from "@tarojs/components";
import {areaList} from "@vant/area-data"

import classnames from "classnames";
import {checkString, getAddressCode} from "@/utils/fcheck";
import {getTimeStampFromDate} from "@/utils/ftime";
import {getFormattedLocation} from "@/utils/fstring";
import {ArrowDown, ArrowUp} from "@taroify/icons";
import {WARNING_NOTE} from "@/utils/constant";
import './index.scss'

export interface PickerCardProps {
  type: 'date' | 'address' | 'common',
  readonly:boolean,
  label:string,
  placeholder: string,
  showValue: string | undefined,
  showMsg:boolean,

  value?: string[]
  onConfirm: any,
}

const PickerCard = (props: PickerCardProps) => {

  const [cardOpen,setCardOpen] = useState(false)

  // card
  const [pickerValue, setPickerValue] = useState(0)
  const [addressValue, setAddressValue] = useState(["330000", "330100"])

  const [minDate] = useState(new Date(1970, 0, 1))
  const [maxDate] = useState(new Date())
  const [defaultBirth] = useState(new Date(2000, 0, 1))
  const [birthValue, setBirthValue] = useState(defaultBirth)

  const onConfirm = () => {
    setCardOpen(false)
    if(props.type === 'date') props.onConfirm(getTimeStampFromDate(birthValue))
    else if(props.type === 'address') props.onConfirm(getFormattedLocation(addressValue))
    else{
      props.onConfirm(props.value? props.value[pickerValue]:[])
    }
  }
  return (
    <>
      <View className='form-item'>
        <Text className='label'>{props.label}</Text>
        <Field className='field' rightIcon={cardOpen? <ArrowUp/>:<ArrowDown/>} onClick={() => {
          if(!props.readonly){
            setCardOpen(!cardOpen)
          }}}
        >
          <Input readonly placeholder={props.placeholder} value={props.showValue?props.showValue:''}/>
        </Field>
        {props.showMsg && !checkString(props.showValue) &&
          <View className='field-note'>{WARNING_NOTE.REQUIRED}</View>}
      </View>
      <Backdrop className='backdrop' open={cardOpen} onClick={()=> setCardOpen(false)}/>
      {cardOpen && <View className={classnames('card-body')}>
        <Picker onCancel={()=>setCardOpen(false)} onChange={(value) => setPickerValue(value)}>
          <Picker.Toolbar>
            <Picker.Button onClick={()=>setCardOpen(false)}>取消</Picker.Button>
            <Picker.Button onClick={onConfirm}>确认</Picker.Button>
          </Picker.Toolbar>
          {props.type === 'date' ? (
            <DatetimePicker
              type='date'
              min={minDate}
              max={maxDate}
              defaultValue={defaultBirth}
              onChange={setBirthValue}
              onCancel={()=>setCardOpen(false)}
            />
          ) : props.type === 'address' ? (
            <AreaPicker
              depth={2}
              value={addressValue}
              onChange={(value) => {
                setAddressValue(getAddressCode(value))
              }}
            >
              <AreaPicker.Columns children={areaList}/>
            </AreaPicker>
          ) : props.type === 'common' ? (
            <Picker.Column>
              {
                props.value && props.value.map((item, idx) => (
                  <Picker.Option value={idx}>{item}</Picker.Option>
                ))
              }
            </Picker.Column>
          ) : (
            <></>
          )}
        </Picker>
      </View>}
    </>
  )}

export default PickerCard
