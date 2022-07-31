import {useEffect, useState} from "react";
import {AreaPicker, Backdrop, Cell, DatetimePicker, Image, Picker} from "@taroify/core";
import {View} from "@tarojs/components";
import {areaList} from "@vant/area-data"
import {useSelector} from "react-redux";

import classnames from "classnames";
import {getAddressCode} from "@/utils/fcheck";
import {getTimeStampFromDate} from "@/utils/ftime";
import {getFormattedLocation} from "@/utils/fstring";
import './index.scss'

export interface SinglePickerCardProps {
  type: 'date' | 'address' | 'custom',
  value?: string[]
  onCancel: any,
  onConfirm: any,
}

const SinglePickerCard = (props: SinglePickerCardProps) => {
  const {user, resource} = useSelector((state) => state)
  const {faculties} = resource
  const [pickerValue, setPickerValue] = useState(0)

  const [addressValue, setAddressValue] = useState(["330000", "330100"])

  const [minDate] = useState(new Date(1970, 0, 1))
  const [maxDate] = useState(new Date())
  const [defaultBirth] = useState(new Date(2000, 0, 1))
  const [birthValue, setBirthValue] = useState(defaultBirth)
  const [backdropOpen,setBackdropOpen] = useState(true)
  const onConfirm = () => {
    props.onCancel()
    if(props.type === 'date') props.onConfirm(getTimeStampFromDate(birthValue))
    else if(props.type === 'address') props.onConfirm(getFormattedLocation(addressValue))
    else{
      props.onConfirm(props.value? props.value[pickerValue]:[])
    }
  }
  return (
    <>
      <Backdrop className='backdrop' open={backdropOpen} onClick={()=> props.onCancel()}/>
      <View className={classnames('card-body')}>
        <Picker onCancel={props.onCancel} onChange={(value) => setPickerValue(value)}>
          <Picker.Toolbar>
            <Picker.Button onClick={props.onCancel}>取消</Picker.Button>
            <Picker.Button onClick={onConfirm}>确认</Picker.Button>
          </Picker.Toolbar>
          {props.type === 'date' ? (
            <DatetimePicker
              type='date'
              min={minDate}
              max={maxDate}
              defaultValue={defaultBirth}
              onChange={setBirthValue}
              onCancel={props.onCancel}
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
          ) : props.type === 'custom' ? (
            <Picker.Column>
              {
                props.value && props.value.map((item,idx)=>(
                  <Picker.Option value={idx}>{item}</Picker.Option>
                ))
              }
            </Picker.Column>
          ):(
            <></>
          )}
        </Picker>
      </View>
    </>
  )}

export default SinglePickerCard
