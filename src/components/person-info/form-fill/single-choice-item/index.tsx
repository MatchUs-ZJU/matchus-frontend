import {Text, View} from "@tarojs/components";
import {WARNING_NOTE} from "@/utils/constant";
import {Field, Radio, Textarea} from "@taroify/core";
import {checkRadio, combineOthers, isOthers, splitOthers} from "@/utils/fcheck";
import {ISingleChoice} from "@/typings/types";
import './index.scss'

export interface ISingleChoiceProps{
  singleChoice: ISingleChoice,
  selectedChoice: string,
  showMsg:boolean,
  onChange: any
}

const SingleChoiceItem = (props:ISingleChoiceProps)=>{

  return(
    props?(
      <View className='form-item form-item-subject'>
        <Text className='question'>{props.singleChoice.question}</Text>
        <Radio.Group
          size={20}
          className='radio-wrapper'
          direction='vertical'
          onChange={(value) => {
            props.onChange(value)
          }}
          value={isOthers(props.selectedChoice)?'其他':props.selectedChoice}
        >
          {
            props.singleChoice.choices.map((item) => (
              <>
                <Radio name={item}>{item}</Radio>
              </>
            ))
          }
        </Radio.Group>
        {isOthers(props.selectedChoice) &&
          <Field className='field'>
            <Textarea
              placeholder='请输入'
              limit={100}
              style='max-height:100px'
              value={splitOthers(props.selectedChoice)}
              onChange={(e) => {
                if(e.detail.value.length <= 100){
                  props.onChange(combineOthers(e.detail.value))
                }else{
                  props.onChange(combineOthers(e.detail.value).slice(0,100))
                }
              }}
            />
          </Field>
        }
        {props.showMsg && !checkRadio(props.selectedChoice) &&
          <View className='field-note'>{WARNING_NOTE.REQUIRED}</View>}
      </View>
        ):(
      <></>
      )


  )
}
export default SingleChoiceItem;
