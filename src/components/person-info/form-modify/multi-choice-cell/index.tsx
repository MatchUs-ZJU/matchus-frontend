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
  combineOthers, findOthers,
  isOthers, splitOthers
} from "@/utils/fcheck";
import {IMultiChoice, IOption} from "@/typings/types";
import './index.scss'


export interface MultiCellPopupProps {
  title: string,
  modifiable: boolean,
  multiChoices: IMultiChoice[] | IOption[] | undefined,
  multiChoiceLimitRestrict: number,
  otherType:'input' | 'picker' | 'none',
  otherValue?: string,
  onConfirm: any,
}

const MultiChoiceCell = (props: MultiCellPopupProps) => {
  const {user,global} = useSelector((state) => state)
  const {windowWidth} = global.system!
  const [popupOpen,setPopupOpen] = useState(false)
  const [cellValue,setCellValue] = useState('')
  const [multiChoices, setMultiChoices] = useState(props.multiChoices ? props.multiChoices : [])
  const [confirmedValue, setConfirmedValue] = useState( props.otherValue?props.otherValue:'')

  const [otherValue, setOtherValue] = useState('')
  const [addressPickerOpen,setAddressPickerOpen] = useState(false)

  const [feedbackValue, setFeedbackValue] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)

  useEffect(()=>{
    if(props.multiChoices){
      if(props.otherType === 'picker'){
        if(checkMultiChoices(props.multiChoices)){
          setCellValue(combineChoices(props.multiChoices,false,props.otherValue))
          return
        }
        setConfirmedValue(props.otherValue!)
      }else if(props.otherType === 'input'){
        if(checkMultiChoicesWithOtherTogether(props.multiChoices)){
          setCellValue(combineChoices(props.multiChoices,true))
          return
        }
        const otherChoice = findOthers(props.multiChoices)
        setConfirmedValue(splitOthers(otherChoice.length>0?otherChoice[0].label:''))
      }
      else if(checkMultiChoices(props.multiChoices)){
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
      if (props.otherType !== 'none' && !thisCheck) {
        setFeedbackValue(WARNING_MSG[WARNING_NOTE.REQUIRED_OTHER])
      }else{
        setFeedbackValue('')
      }
    } else {
      setFeedbackValue(WARNING_MSG[WARNING_NOTE.AT_LEAST_ONE])
    }
  }, [multiChoices])

  useEffect(() => {
    setOtherValue(confirmedValue)
    if(props.otherType === 'input'){
      let updatedMultiChoices = multiChoices.map(it=>{
        if(isOthers(it.label)) {
          if(checkString(confirmedValue)) return {label:combineOthers(confirmedValue),selected:true}
          else return {label:'其他',selected:it.selected}
        }
        else return it
      })
      setMultiChoices([...updatedMultiChoices])
      setCanSubmit(checkString(confirmedValue))
    }
    else if(props.otherType === 'picker'){
      setCanSubmit(checkMultiChoicesWithOther(multiChoices, confirmedValue))
    }else if(props.otherType === 'none'){
      setCanSubmit(checkMultiChoices(multiChoices))
    }
  }, [confirmedValue])

  const checkCanSubmit = () => {
    if(props.otherType === 'picker'){
      return checkMultiChoicesWithOther(multiChoices, confirmedValue)
    }else if(props.otherType === 'input'){
      return checkMultiChoicesWithOtherTogether(multiChoices)
    }else {
      return checkMultiChoices(multiChoices)
    }
    return false
  }

  const checkComplete = ()=>{
    if(props.otherType === 'picker') return checkMultiChoicesWithOther(props.multiChoices, props.otherValue)
    else return checkMultiChoices(props.multiChoices)
  }

  const onCancel = () => {
    setPopupOpen(false)
  }

  const onConfirm = () => {
    if (checkCanSubmit()) {
      onCancel()
    } else {
      setCanSubmit(false)
      setShowFeedback(true)
      return
    }
    if(props.otherType === 'none' || props.otherType === 'input') props.onConfirm({choice:multiChoices})
    else if(props.otherType === 'picker') props.onConfirm({choice:multiChoices,other:confirmedValue})
  }

  return (
    <>
      <Cell
        className={classnames('form-cell',{'form-qa-cell':checkMultiChoices(multiChoices)})}
        title={props.title}
        clickable={user.isChangeable}
        align='center'
        onClick={async () => {
          setMultiChoices(props.multiChoices?props.multiChoices:[])
          setPopupOpen(true)
          if(!user.isChangeable){
            await Taro.showToast({
              title: "您已成功报名，暂时不可修改～",
              duration: TOAST_SHOW_TIME,
              icon: 'none'
            })
          }
          else {
            setMultiChoices(props.multiChoices?props.multiChoices:[])
            setPopupOpen(true)
          }
        }}
      >
        <View className={classnames('value',{'qa-value':checkMultiChoices(multiChoices)})}>
          {!checkComplete() && <View className='dot'/>}
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
                  !isOthers(item.label) && item.label!=='我要自己选' ? (
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
                  ) : (
                    !item.selected ? (
                      // 是其他但没有选择其他
                      <View
                        className='cell-other'
                        onClick={() => {
                          let updatedMultiChoices = multiChoices
                          updatedMultiChoices[idx].selected = true
                          setConfirmedValue('')
                          setMultiChoices([...updatedMultiChoices])
                          if(props.otherType === 'picker'){
                            setAddressPickerOpen(true)
                          }
                        }}
                      >
                        <Image src={PersonalAddOther} className='icon'/>
                        <Text>其他</Text>
                      </View>
                    ) : (
                      // 是其他且选择了其他
                      <>
                        <View
                          className={classnames('row', 'check-label', {'check-label-selected': true})}
                          onClick={() => {
                            let updatedMultiChoices = multiChoices
                            if(props.otherType === 'picker'){
                              updatedMultiChoices[idx].selected = false
                            }else{
                              updatedMultiChoices[idx] = {label:'其他',selected:false}
                            }
                            setMultiChoices([...updatedMultiChoices])
                            setConfirmedValue('')
                          }}
                        >
                          <Text className={classnames('check-text', {'check-text-selected': true})}>{'（其他）'+`${props.otherType==='input'?splitOthers(item.label):confirmedValue}`}</Text>
                          <Image src={PersonalInfoUnchosen} className='selected-icon'/>
                        </View>
                        {props.otherType === 'input' &&
                          <View className='cell-other-input'>
                            <Field className='field'>
                              <Input
                                value={splitOthers(item.label)}
                                placeholder='请输入其他兴趣爱好'
                                onChange={(e) => {
                                  setConfirmedValue(e.detail.value)
                                  // setOtherValue(e.detail.value)
                                }}
                              />
                              <Image
                                src={otherValue ? PersonInfoChosenGrey : PersonInfoChosenGreyLight}
                                className='icon'
                                onClick={() => {
                                  if (otherValue) {
                                    setConfirmedValue(otherValue)
                                  }
                                }}
                              />
                            </Field>
                          </View>
                        }
                      </>
                    )
                  )
                ))}
                {checkOtherChoiceState(multiChoices) && !confirmedValue && props.otherType === 'picker'&&
                    <>
                      <Field
                        className='field'
                        rightIcon={addressPickerOpen?<ArrowUp/>:<ArrowDown/>}
                        onClick={()=>setAddressPickerOpen(!addressPickerOpen)}
                      >
                        <Input
                          readonly
                          value={confirmedValue ? confirmedValue : ''}
                          placeholder='请选择自选发展地'
                        />
                        <Image
                          src={otherValue && otherValue !== '' ? PersonInfoChosenGrey : PersonInfoChosenGreyLight}
                          className='icon'
                          onClick={() => {
                            if (otherValue && otherValue !== '') {
                              setConfirmedValue(otherValue)
                            }
                          }}
                        />
                      </Field>
                      {addressPickerOpen &&
                        <View className='append-view'>
                          <ScrollView className='append-scroll' scrollY scrollWithAnimation style={{height: `${addressPickerOpen?'200px':'0'}`}}>
                            <Cell.Group inset clickable>
                              {AddressData.map((item) => (
                                <Cell
                                  className='cell'
                                  title={item}
                                  onClick={() => {
                                    let updatedChoices = multiChoices.map((it) => {
                                      if (it.label === '我要自己选') return {label: '我要自己选', selected: true}
                                      else return it
                                    })
                                    setOtherValue(item)
                                    setMultiChoices([...updatedChoices])
                                    // setOtherValue(item)
                                    setConfirmedValue(item)
                                    setAddressPickerOpen(false)
                                  }}
                                />
                              ))}
                            </Cell.Group>
                          </ScrollView>
                        </View>
                      }
                    </>
                }
              </>}
            {showFeedback && feedbackValue && feedbackValue !== '' &&
              <View className='warning-note'>{feedbackValue}</View>}
        </ScrollView>

      </View>

        <View className={classnames('confirm-btn', {'confirm-btn-disabled': !canSubmit})} onClick={() => {
          onConfirm()
        }}
        >确认</View>

      </Popup>
    </>
  );
}

export default MultiChoiceCell
