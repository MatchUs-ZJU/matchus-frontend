import {useEffect, useState} from "react";
import {Backdrop, Cell, Field, Image, Input} from "@taroify/core";
import {ScrollView, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  PersonalAddOther,
  PersonInfoChosenGrey,
  PersonInfoChosenGreyLight,
  PersonInfoChosenPrimary, PersonInfoUnchosenPrimary
} from "@/assets/images";
import {TOAST_SHOW_TIME, WARNING_MSG, WARNING_NOTE} from "@/utils/constant";

import classnames from "classnames";
import {IMultiChoice} from "@/typings/types";
import {
  cancelOthers,
  checkMultiChoices, checkMultiChoicesWithOther, checkMultiChoicesWithOtherTogether,
  checkOtherChoiceState,
  checkString, combineFormatItem,
  findOthers,
  isOthers,
  splitOthers,
  updateOther
} from "@/utils/fcheck";
import {ArrowDown, ArrowUp} from "@taroify/icons";
import {useSelector} from "react-redux";
import './index.scss'

export interface IMultiChoicesItemProps {
  label:string,
  placeholder: string,
  showMsg:boolean,

  value: IMultiChoice[],
  onChange:any, // call back
  restrict:number, // 限制多选数量
  otherType?: 'none' | 'input' | 'picker'
  otherValue?:string, // 其他的值 暂时只有输入类型
  appendValue?: any,
}

const MultiChoiceItem = (props: IMultiChoicesItemProps) => {
  const {global} = useSelector((state) => state)

  // item
  const [cardOpen,setCardOpen] = useState(false)

  // card
  const [otherValue,setOtherValue] = useState(props.otherValue?props.otherValue:'')
  const [addressPickerOpen,setAddressPickerOpen] = useState(false)

  const {windowHeight} = global.system!
  useEffect(()=>{
    if(props.otherType==='picker' ){
      setOtherValue(props.otherValue?props.otherValue:'')
    }else if(props.otherType==='input'){
      const other = findOthers(props.value)
      setOtherValue(other.length >0?splitOthers(other[0].label):'')
    }

  },[props.otherType])

  return (
    props ?( <>
      <View className={classnames('form-item',{'form-item-fold':cardOpen})}>
        <Text className='label'>{props.label}</Text>
        <Field
          className='field'
          rightIcon={cardOpen?<ArrowUp onClick={() => setCardOpen(!cardOpen)}/>:<ArrowDown onClick={() => setCardOpen(!cardOpen)}/>}
        >
          {!checkMultiChoices(props.value) ?
            (<Input
              readonly
              placeholder={props.placeholder}
            />):(
              <View className='tag-array'>
                {props.otherType === 'picker' ?
                  props.value && props.value.map((item) => (
                    item.selected &&
                    <View className='tag'>
                      <Text
                        className='tag-text'
                      >
                        {item.label === '我要自己选' ? combineFormatItem(item.label, props.otherValue) : item.label}
                      </Text>
                      <Image src={PersonInfoUnchosenPrimary} className='tag-delete'
                        onClick={() => {
                               if (item.selected && item.label === '我要自己选') {
                                 props.onChange({other: ''})
                                 setOtherValue('')
                               }

                               if(item.selected && isOthers(item.label)){
                                 setOtherValue('')
                               }

                               const obj = props.value.map(
                                 (cur) => {
                                   if (cur.label === item.label) {
                                     cur.selected = !cur.selected
                                   }
                                   return cur
                                 })
                               props.onChange({choice: [...obj]})
                             }}
                      />
                    </View>
                  )) : (
                    props.value.map((item, idx) => (
                        item.selected &&
                        <View className='tag'>
                          <Text className='tag-text'>
                            {isOthers(item.label) ? combineFormatItem(item.label) : item.label}
                          </Text>
                          <Image src={PersonInfoUnchosenPrimary} className='tag-delete'
                            onClick={() => {
                             if (item.selected && isOthers(item.label)) {
                               const cancelRes = cancelOthers(props.value)
                               // setCompleteInterest( [...cancelRes])
                               props.onChange({choice:cancelRes})
                               // setPersonForm({...personForm, interest: cancelRes})
                             } else {
                               const obj = props.value
                               obj[idx] = {label: item.label, selected: false}
                               props.onChange({choice:[...obj]})
                               // setPersonForm({...personForm, interest: [...obj]})
                             }
                             }}
                          />
                        </View>
                      )
                    )
                  )
                }
              </View>
            )
          }


        </Field>
        {props.showMsg && !checkMultiChoices(props.value) &&
          <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
        {props.showMsg && props.otherType==='input' &&  !checkMultiChoicesWithOtherTogether(props.value) &&
          <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED_OTHER]}</View>}
        {props.showMsg && props.otherType==='picker' && !checkMultiChoicesWithOther(props.value,props.otherValue) &&
          <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED_OTHER]}</View>}
      </View>

      <Backdrop open={cardOpen} className='backdrop' onClick={
        ()=>{setCardOpen(false)}}
      />

      {cardOpen && <View className={classnames('card-body')}>

        <View className='col'>
          <ScrollView className='card-scroll' scrollY scrollWithAnimation style={{maxHeight: `${windowHeight * 0.5}px`}}>
            <View className='check-body'>
              <Cell.Group inset>
                {props.value.map((item, idx) => (
                  !isOthers(item.label) && item.label !=='我要自己选' ?(
                    <Cell
                      className={classnames({'cell-checked': item.selected})}
                      title={item.label}
                      onClick={async () => {
                        if (!item.selected && props.restrict > 0 && props.value.filter((it) => it.selected).length >= props.restrict) {
                          await Taro.showToast({
                            title: `最多只能选${props.restrict}项`,
                            duration: TOAST_SHOW_TIME,
                            icon: 'none'
                          })
                        } else {
                          let updatedMultiChoices = props.value
                          updatedMultiChoices[idx].selected = !updatedMultiChoices[idx].selected
                          props.onChange({choice:updatedMultiChoices,other:otherValue})
                        }
                      }}
                    >
                      {item.selected &&
                        <Image
                          src={PersonInfoChosenPrimary}
                          className={classnames('icon')}
                        />
                      }
                    </Cell>
                  ):(
                    // 没选其他
                      !item.selected ?(
                      <View
                        className='cell-other'
                        onClick={() => {
                          const updatedValue = updateOther(props.value,'')
                          props.onChange({choice:[...updatedValue]})
                        }}
                      >
                        <Image src={PersonalAddOther} className='icon'/>
                        <View>其他</View>
                      </View>):(
                        // 选了其他
                        props.otherType==='input' ? (
                          // 其他为输入形式 即无附加数据
                          <View
                            className='cell-other-input'
                          >
                            <Field className='field'>
                              <Input
                                value={otherValue}
                                placeholder='请输入其他兴趣爱好'
                                onChange={(e) => {
                                  // setOtherValue(e.detail.value)
                                  if (e.detail.value.length < 10) {
                                    props.onChange({choice: updateOther(props.value,e.detail.value)})
                                    setOtherValue(e.detail.value)
                                  }
                                }
                                }
                              />
                              <Image src={otherValue && otherValue !== '' ? PersonInfoChosenGrey : PersonInfoChosenGreyLight}
                                     className='icon'
                              />
                            </Field>
                          </View>

                        ):(
                          // 其他从提供数据中进行单选
                          <>
                            <View className='cell-other-input'>
                              <Field
                                className='field'
                                rightIcon={addressPickerOpen?<ArrowUp/>:<ArrowDown/>}
                                onClick={()=>setAddressPickerOpen(!addressPickerOpen)}
                              >
                                <Input
                                  value={checkOtherChoiceState(props.value) && checkString(props.otherValue)?props.otherValue:''}
                                  placeholder='我要自己选'
                                  readonly
                                />
                              </Field>
                            </View>
                            {
                              addressPickerOpen && <View className='append-view'>
                                <ScrollView className='append-scroll' scrollY scrollWithAnimation style={{height: `${addressPickerOpen?'200px':'0'}`}}>
                                  <Cell.Group inset clickable>
                                    {props.appendValue && props.appendValue.map((it)=>(
                                      <Cell className='cell'
                                        title={it}
                                        onClick={()=>{
                                              setOtherValue(it)
                                              // let updatedChoices = props.value.map((it)=>{
                                              //   if(it.label==='我要自己选') return {label:'我要自己选',selected:true}
                                              //   else return it
                                              // })
                                              props.onChange({choice:props.value,other:it})
                                              setAddressPickerOpen(false)
                                            }
                                            }
                                      />
                                    ))}
                                  </Cell.Group>
                                </ScrollView>
                              </View>
                            }
                          </>
                        )
                      )
                    )
                ))}
              </Cell.Group>

            </View>
          </ScrollView>
        </View>
      </View>}
    </>):(<></>)
  )}
export default MultiChoiceItem
