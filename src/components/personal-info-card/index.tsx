import {useEffect, useState} from "react";
import {AreaPicker, Cell, Checkbox, DatetimePicker, Field, Image, Input, Picker} from "@taroify/core";
import {Text, View} from "@tarojs/components";
import {areaList} from "@vant/area-data"
import Taro from "@tarojs/taro";
import {
  PersonalAddOther, PersonalInfoUnchosen,
  PersonInfoChosenGrey,
  PersonInfoChosenGreyLight, PersonInfoChosenPrimary
} from "@/assets/images";
import {useSelector} from "react-redux";
import {
  CHECK_TYPE,
  CONSUMPTION_SHARE,
  CURRENT_CAMPUS,
  CURRENT_GRADE,
  CURRENT_STATUS,
  CURRENT_TYPE,
  GRADUATE_EDUCATION,
  HABIT_FREQUENCY,
  LOVE_HISTORY,
  ONE_YEAR_STATUS,
  PHYSIQUE,
  PICKER_TYPE, SCHOOL_GRADUATE_IN_SEP,
  TAKE_DESIRE,
  TOAST_SHOW_TIME
} from "@/utils/constant";

import classnames from "classnames";

import {IMultiChoice} from "@/typings/types";
import {getTimeStampFromDate} from "@/utils/ftime";
import {checkOtherChoiceState, getAddressCode} from "@/utils/fcheck";
import {getFormattedLocation} from "@/utils/fstring";

import './index.scss'

export interface CardProps {
  up: boolean,
  type: 'picker' | 'check',
  pickerType?: PICKER_TYPE,
  checkType?: CHECK_TYPE,
  otherEnable?:boolean,
  otherValue?:string,
  initialValue?: IMultiChoice[],
  cancel: any,
  confirm: any,
}

const PersonalInfoCard = (props: CardProps) => {
  const {user, resource} = useSelector((state) => state)
  const {faculties} = resource
  const [pickerValue, setPickerValue] = useState(0)

  // 多选+其他
  const [futureBaseValue,setFutureBaseValue] = useState(props.initialValue)
  const [interestValue, setInterestValue] = useState(props.initialValue)
  const [otherValue,setOtherValue] = useState(props.otherValue?props.otherValue:'')

  // 多选无其他
  const [temperValue, setTemperValue] = useState(props.initialValue)
  const [industryValue,setIndustryValue] = useState(props.initialValue)
  const [consumptionValue,setConsumptionValue] = useState(props.initialValue)
  const [graduateIncomeValue,setGraduateIncomeValue] = useState(props.initialValue)

  const [addressValue, setAddressValue] = useState(["330000", "330100"])
  const [minDate] = useState(new Date(1970, 0, 1))
  const [maxDate] = useState(new Date())
  const [defaultBirth] = useState(new Date(2010, 11, 30))
  const [birthValue, setBirthValue] = useState(defaultBirth)

  useEffect(()=>{
    console.log('state',props)
    if(props.type === 'check'){
      if(props.checkType === CHECK_TYPE.FUTURE_BASE){
        setFutureBaseValue(props.initialValue)
        setOtherValue(props.otherValue?props.otherValue:'')
      }
      else if(props.checkType === CHECK_TYPE.INTEREST){
        setInterestValue(props.initialValue)
        setOtherValue(props.otherValue?props.otherValue:'')
      }
      else if(props.checkType === CHECK_TYPE.TEMPER){
        setTemperValue(props.initialValue)
      }
      else if(props.checkType === CHECK_TYPE.CONSUMPTION){
        setConsumptionValue(props.initialValue)
      }
      else if(props.checkType === CHECK_TYPE.INDUSTRY){
        setIndustryValue(props.initialValue)
      }
      else if(props.checkType === CHECK_TYPE.GRADUATE_INCOME){
        setGraduateIncomeValue(props.initialValue)
      }
    }
  },[props])

  const onCancel = () => {
    props.cancel()
  }

  const onConfirm = () => {
    if (props.type === 'picker') {
      if (props.pickerType) {
        if (props.pickerType === PICKER_TYPE.CURRENT_STATUS) {
          props.confirm({currentSchoolStatus: CURRENT_STATUS[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.ONE_YEAR_STATUS) {
          props.confirm({oneYearStatus: ONE_YEAR_STATUS[pickerValue]})
        }else if (props.pickerType === PICKER_TYPE.SCHOOL_GRADUATE_IN_SEP) {
          props.confirm({schoolGraduateInSep: SCHOOL_GRADUATE_IN_SEP[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.CURRENT_TYPE) {
          props.confirm({currentType: CURRENT_TYPE[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.GENDER_) {
          props.confirm({gender: pickerValue})
        } else if (props.pickerType === PICKER_TYPE.BIRTH) {
          props.confirm({birth: getTimeStampFromDate(birthValue)})
        } else if (props.pickerType === PICKER_TYPE.HOMETOWN) {
            props.confirm({hometown: getFormattedLocation(addressValue)})
        } else if (props.pickerType === PICKER_TYPE.LOVE_HISTORY_) {
          props.confirm({loveHistory: LOVE_HISTORY[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.CURRENT_SCHOOL_CAMPUS) {
          props.confirm({currentSchoolCampus: CURRENT_CAMPUS[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.CURRENT_SCHOOL_GRADE) {
          props.confirm({currentSchoolGrade: CURRENT_GRADE[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.GRADUATE_EDUCATION) {
          props.confirm({graduateEducation: GRADUATE_EDUCATION[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.GRADUATE_WORK_LOCATION) {
          props.confirm({graduateWorkLocation: getFormattedLocation(addressValue)})
        }  else if (props.pickerType === PICKER_TYPE.TAKE_DESIRE) {
          props.confirm({takeDesire: TAKE_DESIRE[pickerValue]})
        } else if (props.pickerType === PICKER_TYPE.CONSUMPTION_SHARE) {
          props.confirm({consumptionShare: CONSUMPTION_SHARE[pickerValue]})
        } else if(props.pickerType === PICKER_TYPE.EXERICE_HABIT){
          props.confirm({exerciseFrequency: HABIT_FREQUENCY[pickerValue]})
        } else if(props.pickerType === PICKER_TYPE.STAYUP_HABIT){
          props.confirm({stayUpFrequency: HABIT_FREQUENCY[pickerValue]})
        } else if(props.pickerType === PICKER_TYPE.DRINK_HABIT){
          props.confirm({drinkHabit: HABIT_FREQUENCY[pickerValue]})
        } else if(props.pickerType === PICKER_TYPE.SMOKING_HABIT){
          props.confirm({smokingHabit: HABIT_FREQUENCY[pickerValue]})
        } else if(props.pickerType === PICKER_TYPE.DISCO_HABIT){
          props.confirm({discoHabit: HABIT_FREQUENCY[pickerValue]})
        } else if(props.pickerType === PICKER_TYPE.PHYSIQUE){
          props.confirm({physique: PHYSIQUE[pickerValue]})
        }
      }
    } else if (props.type === 'check') {
      if (props.checkType === CHECK_TYPE.INTEREST) {
        props.confirm({interest: interestValue})
      } else if (props.checkType === CHECK_TYPE.TEMPER) {
        props.confirm({temper: temperValue})
      }
      else if(props.checkType === CHECK_TYPE.FUTURE_BASE){

      }
      else if(props.checkType === CHECK_TYPE.INDUSTRY){
        props.confirm({industry: industryValue})
      }
      else if (props.checkType === CHECK_TYPE.CONSUMPTION) {
        props.confirm({consumption: consumptionValue})
      }
      else if (props.checkType === CHECK_TYPE.GRADUATE_INCOME) {
        props.confirm({graduateIncome: graduateIncomeValue})
      }
    }
    props.cancel()

  }

  return (
    <View className={classnames('card-body', {'up': props.up})}>
      {props.type === 'picker' ? (
        props.pickerType &&
        <Picker siblingCount={3} onCancel={onCancel} onChange={(value) => setPickerValue(value)}>
          <Picker.Toolbar>
            <Picker.Button onClick={onCancel}>取消</Picker.Button>
            <Picker.Button onClick={onConfirm}>确认</Picker.Button>
          </Picker.Toolbar>
          {props.pickerType === PICKER_TYPE.GENDER_ ? (
            <Picker.Column>
              <Picker.Option value={0}>男</Picker.Option>
              <Picker.Option value={1}>女</Picker.Option>
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.BIRTH ? (
            <DatetimePicker
              // className='date-picker'
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
                CURRENT_CAMPUS.map((item,idx) => (
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
          ) : props.pickerType === PICKER_TYPE.SCHOOL_GRADUATE_IN_SEP ? (
            <Picker.Column>
              {SCHOOL_GRADUATE_IN_SEP && SCHOOL_GRADUATE_IN_SEP.map((item, id) =>
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
          ) : props.pickerType === PICKER_TYPE.TAKE_DESIRE ? (
            <Picker.Column>
              {TAKE_DESIRE && TAKE_DESIRE.map((item, id) =>
                <Picker.Option value={id}>{item}</Picker.Option>
              )}
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.GRADUATE_EDUCATION ? (
            <Picker.Column>
              {GRADUATE_EDUCATION && GRADUATE_EDUCATION.map((item, id) =>
                <Picker.Option value={id}>{item}</Picker.Option>
              )}
            </Picker.Column>
          )  : props.pickerType === PICKER_TYPE.CONSUMPTION_SHARE ? (
            <Picker.Column>
              {CONSUMPTION_SHARE && CONSUMPTION_SHARE.map((item, id) =>
                <Picker.Option value={id}>{item}</Picker.Option>
              )}
            </Picker.Column>
          ) : props.pickerType === PICKER_TYPE.EXERICE_HABIT || props.pickerType === PICKER_TYPE.STAYUP_HABIT || props.pickerType === PICKER_TYPE.DRINK_HABIT|| props.pickerType === PICKER_TYPE.SMOKING_HABIT|| props.pickerType === PICKER_TYPE.DISCO_HABIT ? (
            <Picker.Column>
              {HABIT_FREQUENCY && HABIT_FREQUENCY.map((item, id) =>
                <Picker.Option value={id}>{item}</Picker.Option>
              )}
            </Picker.Column>
          ) : (
            <>
            </>
          )
          }
        </Picker>
      ) : (
        props.checkType &&
        <View className='col'>
          {props.checkType === CHECK_TYPE.TEMPER ? (
            <Checkbox.Group className='check-body'>
              <Cell.Group inset>
                {temperValue && temperValue.map((item, idx) => (
                  <Cell
                    className={classnames({'cell-checked': item.selected})}
                    title={item.label}
                    onClick={async () => {
                      if (temperValue.filter((tag) => tag.selected).length >= 2 && !item.selected) {
                        await Taro.showToast({
                          title: "只能选择1-2项哦～",
                          duration: TOAST_SHOW_TIME,
                          icon: 'none'
                        })
                      } else {
                        let updatedTemper = temperValue
                        updatedTemper[idx].selected = !updatedTemper[idx].selected
                        setTemperValue([...updatedTemper])
                        props.confirm({temperament: [...temperValue]})
                      }
                    }}
                  >
                    {item.selected && <Image src={PersonInfoChosenPrimary} className='icon'/>}
                  </Cell>
                ))}

              </Cell.Group>
            </Checkbox.Group>
          ): props.checkType === CHECK_TYPE.CONSUMPTION ?(
            <Checkbox.Group className='check-body'>
              <Cell.Group inset>
                {consumptionValue && consumptionValue.map((item, idx) => (
                  <Cell
                    className={classnames({'cell-checked': item.selected})}
                    title={item.label}
                    onClick={async () => {
                      if (consumptionValue.filter((tag) => tag.selected).length >= 2 && !item.selected) {
                        await Taro.showToast({
                          title: "只能选择1-2项哦～",
                          duration: TOAST_SHOW_TIME,
                          icon: 'none'
                        })
                      } else {
                        let updatedConsumption = consumptionValue
                        consumptionValue[idx].selected = !consumptionValue[idx].selected
                        setConsumptionValue([...updatedConsumption])
                        props.confirm({consumption: [...updatedConsumption]})
                      }
                    }}
                  >
                    {item.selected && <Image src={PersonInfoChosenPrimary} className='icon'/>}
                  </Cell>
                ))}

              </Cell.Group>
            </Checkbox.Group>
          ): props.checkType === CHECK_TYPE.GRADUATE_INCOME ?(
            <Checkbox.Group className='check-body'>
              <Cell.Group inset>
                {graduateIncomeValue && graduateIncomeValue.map((item, idx) => (
                  <Cell
                    className={classnames({'cell-checked': item.selected})}
                    title={item.label}
                    onClick={async () => {
                      if (graduateIncomeValue.filter((tag) => tag.selected).length >= 2 && !item.selected) {
                        await Taro.showToast({
                          title: "只能选择1-2项哦～",
                          duration: TOAST_SHOW_TIME,
                          icon: 'none'
                        })
                      } else {
                        let updatedGraduateIncome = graduateIncomeValue
                        updatedGraduateIncome[idx].selected = !updatedGraduateIncome[idx].selected
                        setGraduateIncomeValue([...updatedGraduateIncome])
                        props.confirm({graduateGraduateIncome: [...updatedGraduateIncome]})
                      }
                    }}
                  >
                    {item.selected && <Image src={PersonInfoChosenPrimary} className='icon'/>}
                  </Cell>
                ))}

              </Cell.Group>
            </Checkbox.Group>
          ):props.checkType === CHECK_TYPE.INDUSTRY ?(
            <View className='check-body'>
              <Cell.Group inset>
                {industryValue && industryValue.map((item, idx) => (
                  <Cell
                    className={classnames('cell-label',{'cell-checked': item.selected})}
                    title={item.label}
                    onClick={async () => {
                      if (industryValue.filter((tag) => tag.selected).length >= 3 && !item.selected) {
                        await Taro.showToast({
                          title: "只能选择1-3项哦～",
                          duration: TOAST_SHOW_TIME,
                          icon: 'none'
                        })
                      } else {
                        let updatedIndustry = industryValue
                        updatedIndustry[idx].selected = !updatedIndustry[idx].selected
                        // setIndustryValue([...updatedIndustry])
                        props.confirm({industry: updatedIndustry})
                      }
                    }}
                  >
                    {item.selected &&
                      <Image
                        src={PersonInfoChosenPrimary}
                        className='icon'
                      />
                    }
                  </Cell>
                ))}
              </Cell.Group>
            </View>
          ):props.checkType === CHECK_TYPE.FUTURE_BASE?(
            <>
              <View className='check-body'>
                <Cell.Group inset>
                  {futureBaseValue && futureBaseValue.map((item, idx) => (
                      item.label !== '其他' &&
                        <Cell
                          className={classnames({'cell-checked': item.selected})}
                          title={item.label}
                          onClick={async () => {
                            let updatedFutureBase = futureBaseValue
                            futureBaseValue[idx].selected = !updatedFutureBase[idx].selected
                            setIndustryValue([...updatedFutureBase])
                            props.confirm({futureBase: updatedFutureBase})
                          }}
                        >
                          {item.selected &&
                            <Image
                              src={PersonInfoChosenPrimary}
                              className={classnames('icon')}
                            />
                          }
                        </Cell>

                  ))}
                </Cell.Group>
                {props.otherEnable &&
                checkOtherChoiceState(futureBaseValue) ? (
                  <View
                    className='cell-other-input'
                  >
                    <Field className='field'>
                      <Input
                        value={otherValue?otherValue:''}
                        placeholder='请输入省份'
                        onChange={(e)=>setOtherValue(e.detail.value)}
                      />
                      <Image src={otherValue && otherValue!==''?PersonInfoChosenGrey:PersonInfoChosenGreyLight}
                        className='icon'
                        onClick={()=>{
                               if(otherValue && otherValue!==''){
                                props.confirm({selfFutureBase:otherValue})
                             }}}
                      />
                    </Field>
                  </View>
                ) : (
                  <View
                    className='cell-other'
                    onClick={()=>{
                      let updateFutureBase = futureBaseValue!.map((item)=>{
                        if(item.label === '其他') return {label:'其他',selected:true}
                        else return item
                      })
                      setFutureBaseValue([...updateFutureBase])
                      props.confirm({futureBase: updateFutureBase})
                    }}
                  >
                    <>
                      <Image src={PersonalAddOther} className='icon'/>
                      <Text>其他</Text>
                    </>
                  </View>)
                }
              </View>
            </>
          ) : props.checkType === CHECK_TYPE.INTEREST?(
              <>
                <View className='check-body'>
                  <Cell.Group inset>
                    {interestValue && interestValue.map((item, idx) => (
                      item.label !== '其他' &&
                      <Cell
                        className={classnames({'cell-checked': item.selected})}
                        title={item.label}
                        onClick={async () => {
                          let updatedInterestValue = interestValue
                          updatedInterestValue[idx].selected = !updatedInterestValue[idx].selected
                          setIndustryValue([...updatedInterestValue])
                          props.confirm({interest: updatedInterestValue})
                        }}
                      >
                        {item.selected &&
                          <Image
                            src={PersonInfoChosenPrimary}
                            className={classnames('icon')}
                          />
                        }
                      </Cell>

                    ))}
                  </Cell.Group>
                  {props.otherEnable &&
                  checkOtherChoiceState(interestValue) ? (
                    <View
                      className='cell-other-input'
                    >
                      <Field className='field'>
                        <Input
                          value={otherValue?otherValue:''}
                          placeholder='请输入其他兴趣爱好 '
                          onChange={(e)=>setOtherValue(e.detail.value)}
                        />
                        <Image src={otherValue && otherValue!==''?PersonInfoChosenGrey:PersonInfoChosenGreyLight}
                          className='icon'
                          onClick={()=>{
                                 if(otherValue && otherValue!==''){
                                   props.confirm({selfInterest:otherValue})
                                 }}}
                        />
                      </Field>
                    </View>
                  ) : (
                    <View
                      className='cell-other'
                      onClick={()=>{
                        let updateInterest = interestValue!.map((item)=>{
                          if(item.label === '其他') return {label:'其他',selected:true}
                          else return item
                        })
                        setFutureBaseValue([...updateInterest])
                        props.confirm({interest: updateInterest})
                      }}
                    >
                      <>
                        <Image src={PersonalAddOther} className='icon'/>
                        <Text>其他</Text>
                      </>

                    </View>)
                  }
                </View>
              </>
            ):(<></>)}
        </View>
          )

      }
    </View>
  )}



export default PersonalInfoCard
