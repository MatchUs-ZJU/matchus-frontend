import {useEffect, useState} from "react";
import {AreaPicker, Cell, DatetimePicker, Picker, Popup} from "@taroify/core";
import {Text, View} from "@tarojs/components";
import {areaList} from "@vant/area-data"
import {useSelector} from "react-redux";
import {PICKER_TYPE, TOAST_SHOW_TIME} from "@/utils/constant";
import {getAddressCode} from "@/utils/fcheck";
import {getFormattedLocation} from "@/utils/fstring";
import {getDateFromStamp, getTimeStampFromDate} from "@/utils/ftime";
import Taro from "@tarojs/taro";
import './index.scss'

export interface PickerCellProps {
  title: string,
  modifiable: boolean,
  cellValue: string | undefined,

  pickerType: PICKER_TYPE,
  pickerContent?: any[],
  onConfirm: any,
}

const PickerCell = (props: PickerCellProps) => {
  const {user} = useSelector((state) => state)

  const [cellValue,setCellValue] = useState('')
  const [pickerValue, setPickerValue] = useState(0)
  const [addressValue, setAddressValue] = useState(["330000", "330100"])
  const [minDate] = useState(new Date(1970, 0, 1))
  const [maxDate] = useState(new Date())
  const [defaultBirth] = useState(new Date(2000, 0, 1))
  const [birthValue, setBirthValue] = useState(defaultBirth)

  const [popupOpen,setPopupOpen] = useState(false)

  useEffect(() => {
    setPickerValue(0)
    if(props.cellValue){
      if(props.pickerType === PICKER_TYPE.DATE) setCellValue(getDateFromStamp(props.cellValue))
      else return setCellValue(props.cellValue)
    }else{
      setCellValue('请填写')
    }
  }, [props])

  const onCancel = ()=>{
    setPopupOpen(false)
  }

  const onConfirm = () => {
    if (props.pickerType) {
      if(props.pickerType === PICKER_TYPE.COMMON && props.pickerContent){
        props.onConfirm(props.pickerContent[pickerValue])
      }
      else if(props.pickerType === PICKER_TYPE.ADDRESS){
        props.onConfirm(getFormattedLocation(addressValue))
      }
      else if(props.pickerType === PICKER_TYPE.DATE){
        props.onConfirm(getTimeStampFromDate(birthValue))
      }
    }
    setPopupOpen(false)
  }

  return (
    <>
      <Cell
        className='form-cell'
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
        <View className='badge-container'>
          {!props.cellValue && <View className='dot'/>}
          <Text>{cellValue}</Text>
        </View>
      </Cell>

      <Popup className='form-popup' open={popupOpen} rounded placement='bottom' onClose={()=>setPopupOpen(false)}>
        <Popup.Backdrop/>
        <Text className='popup-title'>
          {`修改${props.title}`}
        </Text>
        {props.pickerType &&
          <Picker siblingCount={3} onCancel={onCancel} onChange={(value) => setPickerValue(value)}>
            {props.pickerType === PICKER_TYPE.COMMON ? (
              <Picker.Column>
                {
                  props.pickerContent && props.pickerContent.map((item,idx)=>
                    <Picker.Option value={idx}>{item}</Picker.Option>
                  )
                }
              </Picker.Column>
            ) : props.pickerType === PICKER_TYPE.DATE ? (
              <DatetimePicker
                className='date-picker'
                type='date'
                min={minDate}
                max={maxDate}
                defaultValue={defaultBirth}
                onChange={setBirthValue}
                onCancel={onCancel}
              />
            ) : props.pickerType === PICKER_TYPE.ADDRESS ? (
              <AreaPicker
                depth={2}
                value={addressValue}
                onChange={(value) => {
                  setAddressValue(getAddressCode(value))
                }}
              >
                <AreaPicker.Columns children={areaList}/>
              </AreaPicker>
            ) : (<></>)
            }
          </Picker>
        }
        <View className='confirm-btn' onClick={() => {onConfirm()}}>确认</View>
      </Popup>
    </>
  );
}

export default PickerCell
