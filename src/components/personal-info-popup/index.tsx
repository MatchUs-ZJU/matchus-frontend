import {useEffect, useState} from "react";
import {AreaPicker, Cell, DatetimePicker, Field, Image, Input, Picker, Popup, Textarea} from "@taroify/core";
import {ScrollView, Text, View} from "@tarojs/components";
import {areaList} from "@vant/area-data"
import Taro from "@tarojs/taro";
import {PersonalAddOther, PersonalInfoUnchosen, PersonInfoChosenGrey, PersonInfoChosenGreyLight} from "@/assets/images";
import {useSelector} from "react-redux";
import {
  AddressData,
  CHECK_TYPE,
  CONSUMPTION_SHARE,
  CURRENT_CAMPUS,
  CURRENT_GRADE,
  CURRENT_STATUS,
  CURRENT_TYPE,
  GENDER,
  GRADUATE_EDUCATION,
  HABIT_FREQUENCY,
  INPUT_TYPE,
  LOVE_HISTORY,
  ONE_YEAR_STATUS,
  PHYSIQUE,
  PICKER_TYPE,
  SCHOOL_GRADUATE_IN_SEP,
  TAKE_DESIRE,
  TOAST_SHOW_TIME,
  WARNING_MSG,
  WARNING_NOTE
} from "@/utils/constant";
import classnames from "classnames";
import {ArrowDown, ArrowUp, Clear} from "@taroify/icons";
import {floatRegTest, wechatNumberRegTest} from "@/utils/reg";
import {
  checkMultiChoices,
  checkMultiChoicesWithOther,
  checkMultiChoicesWithOtherTogether,
  checkOtherChoiceState,
  checkPhotos,
  checkString,
  combineOthers,
  findOthers,
  getAddressCode,
  isOthers,
  splitOthers
} from "@/utils/fcheck";
import PhotoBox from "@/components/person-info/photo-box";
import {IMultiChoice, IPhotoUrls} from "@/typings/types";
import {getFormattedLocation} from "@/utils/fstring";
import {getTimeStampFromDate} from "@/utils/ftime";
import './index.scss'


export interface PopUpProps {
  open: boolean,
  title: string,
  type: 'picker' | 'input' | 'check' | 'photo' | 'qa-input',
  inputType?: INPUT_TYPE,
  pickerType?: PICKER_TYPE,
  checkType?: CHECK_TYPE,
  photoUrls?: IPhotoUrls[],
  initialValue?: any,
  checkRestrict?: number,
  otherEnabled?: boolean,
  otherValue?: string,
  cancel: any,
  confirm: any,
}

const PersonalInfoPopUp = (props: PopUpProps) => {
  const {user, resource,global} = useSelector((state) => state)
  const {faculties} = resource
  const {windowHeight} = global.system!
  // 共享
  const [pickerValue, setPickerValue] = useState(0)
  const [inputValue, setInputValue] = useState(props.initialValue ? props.initialValue : '')
  const [addressValue, setAddressValue] = useState(["330000", "330100"])

  const [feedbackValue, setFeedbackValue] = useState('')

  const [minDate] = useState(new Date(1970, 0, 1))
  const [maxDate] = useState(new Date())
  const [defaultBirth] = useState(new Date(2000, 0, 1))
  const [birthValue, setBirthValue] = useState(defaultBirth)

  const [otherValue, setOtherValue] = useState('')
  const [confirmedValue, setConfirmedValue] = useState( '')
  const [multiChoices, setMultiChoices] = useState(props.initialValue ? props.initialValue : Array<IMultiChoice>())
  const [photoUrls, setPhotoUrls] = useState(props.photoUrls ? props.photoUrls : [])

  const [showFeedback, setShowFeedback] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)

  const [addressPickerOpen,setAddressPickerOpen] = useState(false)

  useEffect(() => {
    setOtherValue(confirmedValue)
    if(props.checkType === CHECK_TYPE.INTEREST){
      let updatedMultiChoices = multiChoices.map(it=>{
        if(isOthers(it.label)) {
          if(checkString(confirmedValue)) return {label:combineOthers(confirmedValue),selected:true}
          else return {label:'其他',selected:false}
          // return {label: combineOthers(confirmedValue),selected:fillOthers(confirmedValue)}
        }
        else return it
      })
      console.log('confirmedChange',updatedMultiChoices)
      setMultiChoices([...updatedMultiChoices])
      setCanSubmit(checkString(confirmedValue))
    }
    else{
      setCanSubmit(checkMultiChoices(multiChoices)?(checkOtherChoiceState(multiChoices)?checkString(confirmedValue):true):true)
    }
  }, [confirmedValue])

  useEffect(() => {
    if (props.type === 'photo') {
      setPhotoUrls(user.images ? user.images : [])
    }
  }, [user.images])

  useEffect(() => {
    if (props.type === 'input' || props.type === 'qa-input') {
      setInputValue(props.initialValue ? props.initialValue : '')
    } else if (props.type === 'check') {
      setMultiChoices(props.initialValue ? props.initialValue : [])
      if (props.otherEnabled) {
        if(props.checkType === CHECK_TYPE.FUTURE_BASE){
          setConfirmedValue(props.otherValue ? props.otherValue: '')
        }else{
          const res = findOthers(props.initialValue)
          setConfirmedValue(res.length>0?splitOthers(res[0].label):'')
        }
      }
    } else if (props.type === 'picker') {
      setPickerValue(0)
      setCanSubmit(true)
    }
    setFeedbackValue('')
  }, [props])

  const checkCanSubmit = () => {
    if (props.type === 'picker') return true
    else if ((props.type === 'input' || props.type === 'qa-input')) {
      if (checkString(inputValue)) {
        if (props.inputType === INPUT_TYPE.WEIGHT || props.inputType === INPUT_TYPE.HEIGHT) {
          return floatRegTest(inputValue)
        } else if (props.inputType === INPUT_TYPE.WECHAT_NUMBER) {
          return wechatNumberRegTest(inputValue)
        }
        return true
      } else return props.inputType === INPUT_TYPE.MBTI
    } else if (props.type === 'check') {
      if (props.otherEnabled) {
        if(props.checkType === CHECK_TYPE.FUTURE_BASE){
          return checkMultiChoicesWithOther(multiChoices, confirmedValue)
        }else{
          return checkMultiChoicesWithOtherTogether(multiChoices)
        }
      } else {
        return checkMultiChoices(multiChoices)
      }
    } else if (props.type === 'photo') {
      return checkPhotos(photoUrls)
    }
    return false
  }

  // 输入
  useEffect(() => {
    if (props.type === 'input' || props.type === 'qa-input') {
      setCanSubmit(checkCanSubmit())
      if (checkString(inputValue)) {
        if (props.inputType === INPUT_TYPE.HEIGHT || props.inputType === INPUT_TYPE.WEIGHT) {
          if (!floatRegTest(inputValue)) {
            setFeedbackValue(WARNING_MSG[WARNING_NOTE.INVALID_NUMBER])
            return
          }
        } else if (props.inputType === INPUT_TYPE.WECHAT_NUMBER && !wechatNumberRegTest(inputValue)) {
          setFeedbackValue(WARNING_MSG[WARNING_NOTE.INVALID_WECAHT])
          return
        }
        setFeedbackValue('')
      } else {
        setFeedbackValue(WARNING_MSG[WARNING_NOTE.INVALID_BLANK])
      }
    }
  }, [inputValue])

  useEffect(() => {
    if (props.type === 'check') {
      setCanSubmit(checkCanSubmit())
      if (props.type === 'check') {
        if (checkMultiChoices(multiChoices)) {
          if (props.otherEnabled && !checkMultiChoicesWithOther(multiChoices, confirmedValue)) {
            setFeedbackValue(WARNING_MSG[WARNING_NOTE.REQUIRED_OTHER])
          }
          setFeedbackValue('')
        } else {
          setFeedbackValue(WARNING_MSG[WARNING_NOTE.AT_LEAST_ONE])
        }
      }
    }
  }, [multiChoices])

  // 图片
  useEffect(() => {
    if (props.type === 'photo') {
      if (!checkPhotos(photoUrls)) {
        setFeedbackValue(WARNING_MSG[WARNING_NOTE.INVALID_PHOTO])
      }else{
        setFeedbackValue('')
      }
      setCanSubmit(checkCanSubmit())
    }
  }, [photoUrls])

  const onCancel = () => {
    props.cancel()
  }

  const onConfirm = () => {
    if (checkCanSubmit()) {
      props.cancel()
    } else {
      setCanSubmit(false)
      setShowFeedback(true)
      return
    }

    if (props.type === 'picker') {
      if (props.pickerType) {
        if (props.pickerType === PICKER_TYPE.CURRENT_STATUS) {
          props.confirm({currentSchoolStatus: CURRENT_STATUS[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.ONE_YEAR_STATUS) {
          props.confirm({oneYearStatus: ONE_YEAR_STATUS[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.CURRENT_TYPE) {
          props.confirm({currentType: CURRENT_TYPE[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.GENDER_) {
          props.confirm({gender: GENDER[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.BIRTH) {
          // const formatDate = `${birthValue.getFullYear()}-${birthValue.getMonth() + 1<10?`0${birthValue.getMonth() + 1}`:(birthValue.getMonth() + 1)}-${birthValue.getDate()<10?`0${birthValue.getDate()}`:birthValue.getDate()}`
          props.confirm({birth: getTimeStampFromDate(birthValue)})
        } else if (props.pickerType === PICKER_TYPE.HOMETOWN) {
          props.confirm({hometown: getFormattedLocation(addressValue)})
        } else if (props.pickerType === PICKER_TYPE.GRADUATE_WORK_LOCATION) {
          props.confirm({graduateWorkLocation: getFormattedLocation(addressValue)})
        } else if (props.pickerType === PICKER_TYPE.PHYSIQUE) {
          props.confirm({physique: PHYSIQUE[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.LOVE_HISTORY_) {
          props.confirm({loveHistory: LOVE_HISTORY[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.CURRENT_SCHOOL_CAMPUS) {
          props.confirm({currentSchoolCampus: CURRENT_CAMPUS[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.CURRENT_SCHOOL_GRADE) {
          props.confirm({currentSchoolGrade: CURRENT_GRADE[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.GRADUATE_EDUCATION) {
          props.confirm({graduateEducation: GRADUATE_EDUCATION[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.FACULTY) {
          props.confirm({faculty: faculties[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.EXERICE_HABIT) {
          props.confirm({exerciseFrequency: HABIT_FREQUENCY[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.STAYUP_HABIT) {
          props.confirm({stayUpFrequency: HABIT_FREQUENCY[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.DRINK_HABIT) {
          props.confirm({drinkHabit: HABIT_FREQUENCY[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.SMOKING_HABIT) {
          props.confirm({smokingHabit: HABIT_FREQUENCY[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.DISCO_HABIT) {
          props.confirm({discoHabit: HABIT_FREQUENCY[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.TAKE_DESIRE) {
          props.confirm({takeDesire: TAKE_DESIRE[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.CONSUMPTION_SHARE) {
          props.confirm({consumptionShare: CONSUMPTION_SHARE[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.SCHOOL_GRADUATE_IN_SEP) {
          props.confirm({schoolGraduateInSep: SCHOOL_GRADUATE_IN_SEP[pickerValue]})
        }

      }
    } else if (props.type === 'input') {
      if (props.inputType === INPUT_TYPE.WEIGHT) {
        props.confirm({weight: inputValue})
      } else if (props.inputType === INPUT_TYPE.HEIGHT) {
        props.confirm({height: inputValue})
      } else if (props.inputType === INPUT_TYPE.PHONE_NUMBER) {
        props.confirm({phoneNumber: inputValue})
      } else if (props.inputType === INPUT_TYPE.WECHAT_NUMBER) {
        props.confirm({wechatNumber: inputValue})
      } else if (props.inputType === INPUT_TYPE.GRADUATE_WORK_DETAIL) {
        props.confirm({graduateWorkDetail: inputValue})
      } else if (props.inputType === INPUT_TYPE.MBTI) {
        props.confirm({mbti: inputValue})
      }
    } else if (props.type === 'qa-input') {
      if (props.inputType === INPUT_TYPE.SUPER_POWER) {
        props.confirm({superPower: inputValue})
      } else if (props.inputType === INPUT_TYPE.EMO) {
        props.confirm({emo: inputValue})
      } else if (props.inputType === INPUT_TYPE.SAY) {
        props.confirm({say: inputValue})
      }
    } else if (props.type === 'check') {
      if (props.checkType === CHECK_TYPE.INTEREST) {
        props.confirm({interest: [...multiChoices]})
      } else if (props.checkType === CHECK_TYPE.FUTURE_BASE) {
        props.confirm({futureBase: multiChoices, selfFutureBase: confirmedValue})
      } else if (props.checkType === CHECK_TYPE.TEMPER) {
        props.confirm({temperament: multiChoices})
      } else if (props.checkType === CHECK_TYPE.INDUSTRY) {
        props.confirm({industry: multiChoices})
      } else if (props.checkType === CHECK_TYPE.GRADUATE_INCOME) {
        props.confirm({graduateIncome: multiChoices})
      } else if (props.checkType === CHECK_TYPE.CONSUMPTION) {
        props.confirm({consumption: multiChoices})
      }
    } else if (props.type === 'photo') {
      props.confirm(photoUrls)
    }
  }

  return (
    <Popup className='popup' open={props.open} rounded placement='bottom' onClose={onCancel}>
      <Popup.Backdrop/>
      <Text className='popup-title'>
        {props.title}
      </Text>
      {props.type === 'picker' ? (
        props.pickerType &&
        <Picker siblingCount={3} onCancel={onCancel} onChange={(value) => setPickerValue(value)}>
          {props.pickerType === PICKER_TYPE.GENDER_ ? (
            <Picker.Column>
              <Picker.Option value={0}>男</Picker.Option>
              <Picker.Option value={1}>女</Picker.Option>
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.BIRTH ? (
            <DatetimePicker
              className='date-picker'
              type='date'
              min={minDate}
              max={maxDate}
              defaultValue={defaultBirth}
              onChange={setBirthValue}
              onCancel={onCancel}
            />
          ) : props.pickerType === PICKER_TYPE.CURRENT_TYPE ? (
            <Picker.Column>
              <Picker.Option value={0}>在校生</Picker.Option>
              <Picker.Option value={1}>毕业生</Picker.Option>
              <Picker.Option value={2}>教职工</Picker.Option>
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.CURRENT_SCHOOL_CAMPUS ? (
            <Picker.Column>
              {CURRENT_CAMPUS ?
                CURRENT_CAMPUS.map((item, idx) => (
                  <Picker.Option value={idx}>{item}</Picker.Option>
                ))
                : <></>
              }
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.SCHOOL_GRADUATE_IN_SEP ? (
            <Picker.Column>
              {SCHOOL_GRADUATE_IN_SEP ?
                SCHOOL_GRADUATE_IN_SEP.map((item, idx) => (
                  <Picker.Option value={idx}>{item}</Picker.Option>
                ))
                : <></>
              }
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.CURRENT_SCHOOL_GRADE ? (
            <Picker.Column>
              {CURRENT_GRADE ?
                CURRENT_GRADE.map((item, idx) => (
                  <Picker.Option value={idx}>{item}</Picker.Option>
                ))
                : <></>
              }
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.FACULTY ? (
            <Picker.Column>
              {faculties && faculties.length ?
                faculties.map((item) => (
                  <Picker.Option value={item.id}>{item.name}</Picker.Option>
                ))
                : <></>
              }
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.HOMETOWN || props.pickerType === PICKER_TYPE.GRADUATE_WORK_LOCATION ? (
            <AreaPicker
              depth={2}
              value={addressValue}
              onChange={(value) => {
                setAddressValue(getAddressCode(value))
              }}
            >
              <AreaPicker.Columns children={areaList}/>
            </AreaPicker>
          ) : props.pickerType === PICKER_TYPE.CURRENT_STATUS ? (
            <Picker.Column>
              {CURRENT_STATUS && CURRENT_STATUS.map((item, id) =>
                <Picker.Option value={id}>{item}</Picker.Option>
              )}
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.ONE_YEAR_STATUS ? (
            <Picker.Column>
              {ONE_YEAR_STATUS && ONE_YEAR_STATUS.map((item, id) =>
                <Picker.Option value={id}>{item}</Picker.Option>
              )}
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.PHYSIQUE ? (
            <Picker.Column>
              {PHYSIQUE && PHYSIQUE.map((item, id) =>
                <Picker.Option value={id}>{item}</Picker.Option>
              )}
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.LOVE_HISTORY_ ? (
            <Picker.Column>
              {LOVE_HISTORY && LOVE_HISTORY.map((item, id) =>
                <Picker.Option value={id}>{item}</Picker.Option>
              )}
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.GRADUATE_EDUCATION ? (
            <Picker.Column>
              {GRADUATE_EDUCATION && GRADUATE_EDUCATION.map((item, id) =>
                <Picker.Option value={id}>{item}</Picker.Option>
              )}
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.SMOKING_HABIT || props.pickerType === PICKER_TYPE.DRINK_HABIT || props.pickerType === PICKER_TYPE.EXERICE_HABIT || props.pickerType === PICKER_TYPE.STAYUP_HABIT || props.pickerType === PICKER_TYPE.DISCO_HABIT ? (
            <Picker.Column>
              {HABIT_FREQUENCY && HABIT_FREQUENCY.map((item, id) =>
                <Picker.Option value={id}>{item}</Picker.Option>
              )}
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.TAKE_DESIRE ? (
            <Picker.Column>
              {TAKE_DESIRE && TAKE_DESIRE.map((item, id) =>
                <Picker.Option value={id}>{item}</Picker.Option>
              )}
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.CONSUMPTION_SHARE ? (
            <Picker.Column>
              {CONSUMPTION_SHARE && CONSUMPTION_SHARE.map((item, id) =>
                <Picker.Option value={id}>{item}</Picker.Option>
              )}
            </Picker.Column>
          ) : (
            <></>
          )
          }
        </Picker>
      ) : props.type === 'check' ? (
        <ScrollView className='card-scroll' scrollY scrollWithAnimation style={{maxHeight: `${0.5*windowHeight}`}}>
          <View className='check-body'>
            {multiChoices &&
              <>
                {multiChoices.map((item, idx) => (
                  !isOthers(item.label) && item.label!=='我要自己选' ? (
                    <View
                      className={classnames('row', 'check-label', {'check-label-selected': item.selected})}
                      onClick={async () => {
                        if (props.checkRestrict && props.checkRestrict > 0 && !item.selected && multiChoices.filter((it => it.selected)).length >= props.checkRestrict) {
                          await Taro.showToast({
                            title: `最多只能选择${props.checkRestrict}项～`,
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
                        }}
                      >
                          <Image src={PersonalAddOther} className='icon'/>
                          <Text>其他</Text>
                      </View>
                    ) : (
                      // 是其他且已有填写其他值
                      confirmedValue && confirmedValue !== '' &&
                      <View
                        className={classnames('row', 'check-label', {'check-label-selected': true})}
                        onClick={() => {
                          let updatedMultiChoices = multiChoices
                          if(props.checkType === CHECK_TYPE.FUTURE_BASE){
                            updatedMultiChoices[idx].selected = false
                          }else{
                            updatedMultiChoices[idx] = {label:'其他',selected:false}
                          }
                            setMultiChoices([...updatedMultiChoices])
                            setConfirmedValue('')
                        }}
                      >
                        <Text className={classnames('check-text', {'check-text-selected': true})}>{confirmedValue}</Text>
                        <Image src={PersonalInfoUnchosen} className='selected-icon'/>
                      </View>
                    )
                  )
                ))}
                {props.otherEnabled && checkOtherChoiceState(multiChoices) && !confirmedValue &&
                props.checkType === CHECK_TYPE.INTEREST ?
                  (<View className='cell-other-input'>
                    <Field className='field'>
                      <Input
                        value={otherValue ? otherValue : ''}
                        placeholder='请输入其他兴趣爱好'
                        onChange={(e) => setOtherValue(e.detail.value)}
                      />
                      <Image
                        src={otherValue ? PersonInfoChosenGrey : PersonInfoChosenGreyLight}
                        className='icon'
                        onClick={() => {
                          if (otherValue && otherValue !== '') {
                            setConfirmedValue(otherValue)
                          }
                        }}
                      />
                    </Field>
                  </View>):props.checkType === CHECK_TYPE.FUTURE_BASE ?(
                    checkOtherChoiceState(multiChoices) &&
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
                                <Cell className='cell'
                                      title={item}
                                      onClick={() => {
                                        setOtherValue(item)
                                        let updatedChoices = multiChoices.map((it) => {
                                          if (it.label === '我要自己选') return {label: '我要自己选', selected: true}
                                          else return it
                                        })
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
                  ):(
                    <></>
                  )

                }
              </>}
            {showFeedback && feedbackValue && feedbackValue !== '' &&
              <View className='warning-note'>{feedbackValue}</View>}
          </View>
        </ScrollView>
      ) : props.type === 'input' ? (
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
            {props.inputType === INPUT_TYPE.HEIGHT ? (
              <Text className='corner-text'>cm</Text>
            ) : props.inputType === INPUT_TYPE.WEIGHT ? (
              <Text className='corner-text'>kg</Text>
            ) : (
              <View className='corner-icon'>
                <Clear style={{color: "rgba(0, 0, 0, 0.3)",zIndex:10}} onClick={() => setInputValue('')}/>
              </View>
            )}
          </Field>
          {showFeedback && feedbackValue && feedbackValue !== '' && props.inputType !== INPUT_TYPE.MBTI &&
            <View className='warning-note'>{feedbackValue}</View>}
        </View>
      ) : props.type === 'qa-input' ? (
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
      ) : (
        <>
          <PhotoBox images={user.images ? user.images : []} onChange={setPhotoUrls}/>
          {showFeedback && feedbackValue &&
            <View className='warning-note'>{feedbackValue}</View>}
        </>
      )}
      <View className={classnames('confirm-btn', {'confirm-btn-disabled': !canSubmit})} onClick={() => {
        onConfirm()
      }}
      >确认</View>
    </Popup>
  );
}

export default PersonalInfoPopUp
