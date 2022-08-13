import {useEffect, useState} from "react";
import {Backdrop, Cell, Field, Image, Input} from "@taroify/core";
import {ScrollView, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  PersonalAddOther,
  PersonInfoChosenGrey,
  PersonInfoChosenGreyLight,
  PersonInfoChosenPrimary
} from "@/assets/images";
import {TOAST_SHOW_TIME} from "@/utils/constant";

import classnames from "classnames";
import {IMultiChoice} from "@/typings/types";
import {checkOtherChoiceState, checkString, findOthers, isOthers, splitOthers, updateOther} from "@/utils/fcheck";
import {ArrowDown, ArrowUp} from "@taroify/icons";
import {useSelector} from "react-redux";
import './index.scss'

export interface IMultiChoicesCard {
  value: IMultiChoice[],
  onChange:any, // call back
  onCancel:any,
  onOtherChange?:any,
  restrict:number, // 限制多选数量
  otherEnable?:boolean, // 包含其他
  otherValue?:string, // 其他的值 暂时只有输入类型
  hasAppend?:boolean,
  appendValue?: any,
}

const MultiChoiceCard = (props: IMultiChoicesCard) => {
  const {global} = useSelector((state) => state)
  const [otherValue,setOtherValue] = useState(props.otherValue?props.otherValue:'')
  const [backDropOpen,setBackDropOpen] = useState(true)
  const [addressPickerOpen,setAddressPickerOpen] = useState(false)

  const {windowHeight} = global.system!
  useEffect(()=>{
    if(props.otherEnable && props.hasAppend){
      setOtherValue(props.otherValue?props.otherValue:'')
    }else if(props.otherEnable){
      const other = findOthers(props.value)
      setOtherValue(other.length >0?splitOthers(other[0].label):'')
    }

  },[props.otherValue,props.hasAppend])

  return (
    <>
      <Backdrop open={backDropOpen} className='backdrop' onClick={
        ()=>{
          setBackDropOpen(false)
          props.onCancel()
        }}
      />

      <View className={classnames('card-body')}>

        <View className='col'>
          <ScrollView className='card-scroll' scrollY scrollWithAnimation style={{maxHeight: `${windowHeight * 0.5}px`}}>
            <View className='check-body'>
              <Cell.Group inset>
                {props.value.map((item, idx) => (
                  !isOthers(item.label) && item.label !=='我要自己选' &&
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
                ))}
              </Cell.Group>
              {
                // 其他为输入选项
                props.otherEnable && !props.hasAppend &&
                <>
                  {checkOtherChoiceState(props.value) ? (
                    // 选了其他
                    <View
                      className='cell-other-input'
                    >
                      <Field className='field'>
                        <Input
                          value={otherValue}
                          placeholder='请输入其他兴趣爱好'
                          onChange={(e) => {
                            // setOtherValue(e.detail.value)
                            if (checkString(e.detail.value) && e.detail.value.length < 10) {
                              setOtherValue(e.detail.value)
                              props.onChange({choice: updateOther(props.value,e.detail.value)})
                            }
                          }
                        }
                        />
                        <Image src={otherValue && otherValue !== '' ? PersonInfoChosenGrey : PersonInfoChosenGreyLight}
                               className='icon'
                               // onClick={() => {
                               //   if (checkString(otherValue)) {
                               //     props.onChange({choice:props.value})
                               //     if(props.onOtherChange){
                               //       props.onOtherChange(otherValue)
                               //     }
                               //   }
                               // }}
                        />
                      </Field>
                    </View>
                  ) : (
                    // 没有选择其他
                    <View
                      className='cell-other'
                      onClick={() => {
                        const updatedValue = updateOther(props.value,'')
                        props.onChange({choice:[...updatedValue]})
                      }}
                    >
                      <Image src={PersonalAddOther} className='icon'/>
                      <View>其他</View>
                    </View>)
                  }
                </>
              }
              {
                // 其他为从提供的选项中进行单选
                props.hasAppend &&
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
                          {props.appendValue && props.appendValue.map((item)=>(
                            <Cell className='cell'
                                  title={item}
                                  onClick={()=>{
                                    setOtherValue(item)
                                    let updatedChoices = props.value.map((it)=>{
                                      if(it.label==='我要自己选') return {label:'我要自己选',selected:true}
                                      else return it
                                    })
                                    props.onChange({choice:[...updatedChoices],other:item})
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
              }

            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );}
export default MultiChoiceCard
