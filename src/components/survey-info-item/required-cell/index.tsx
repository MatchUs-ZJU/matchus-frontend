import {useEffect, useState} from "react";
import {Cell, Image, Picker, Popup} from "@taroify/core";
import {ScrollView, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {PersonalInfoUnchosen} from "@/assets/images";
import {useSelector} from "react-redux";
import {QUESTION_TYPE, TOAST_SHOW_TIME, WARNING_NOTE} from "@/utils/constant";
import classnames from "classnames";
import {checkMultiChoices, combineChoices, generateViewString} from "@/utils/fcheck";
import {IOption, IOptionalItem} from "@/typings/types";
import './index.scss'


export interface SurveyMultiCellProps {
  title: string,
  type: QUESTION_TYPE
  question?: IOptionalItem | undefined,
  answer: string | undefined,
  modifiable: boolean,
  multiChoices?: IOption[] | undefined,
  multiChoiceLimitRestrict?: number | undefined,
  otherType?:'input' | 'picker' | 'none',
  otherValue?: string,
  onConfirm: any,
}

const SurveyMultiCell = (props: SurveyMultiCellProps) => {
  const {global} = useSelector((state) => state)
  const {state, filled} = useSelector(rootState => rootState.activity.participate.fillForm)

  const {windowWidth} = global.system!
  const [popupOpen,setPopupOpen] = useState(false)
  const [cellValue,setCellValue] = useState('')
  const [multiChoices, setMultiChoices] = useState<IOption[] | undefined>(props.multiChoices?[...props.multiChoices]:[])
  const [question, setQuestion] = useState<IOptionalItem | undefined>(props.question?props.question:undefined)
  const [range,setRange] = useState<number[]>([])

  const [feedbackValue, setFeedbackValue] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)

  useEffect(()=>{
    if(props.question){
      setQuestion({...props.question})
      const cnt = +props.question.option[1].choice - +props.question.option[0].choice+1
      setRange([...new Array(cnt).keys()].map( (i)=> i+(+ props.question.option[0].choice)))
      if(props.question.answer){
        setCellValue(generateViewString(props.question,props.question.questionType))
        return
      }

    }else if(props.multiChoices){
      setMultiChoices([...props.multiChoices])
      if(checkMultiChoices(props.multiChoices)){
        setCellValue(combineChoices(props.multiChoices,true))
        return
      }
    }
      setCellValue('请选择')
  },[props])

  useEffect(() => {
    if (props.type === QUESTION_TYPE.MULTI_CHOICE ) {
      const thisCheck = checkCanSubmit()
      setCanSubmit(thisCheck)
      if(checkMultiChoices(multiChoices)){
        setFeedbackValue('')
      }
      else {
        setFeedbackValue(WARNING_NOTE.AT_LEAST_ONE)
      }
    }
  }, [multiChoices])

  useEffect(() => {
    if(props.type === QUESTION_TYPE.RANGE){
      const thisCheck = checkCanSubmit()
      setCanSubmit(thisCheck)
      if(question && question.rangeAnswer && question.rangeAnswer[1] < question.rangeAnswer[0]){
        setFeedbackValue(WARNING_NOTE.INVALID_RANGE)
      }else{
        setFeedbackValue('')
      }
    }

  },[question?.rangeAnswer])

  const checkCanSubmit = () => {
    if(props.type === QUESTION_TYPE.RANGE) {
      return question && question.rangeAnswer ? question.rangeAnswer[0] <= question.rangeAnswer[1] : false
    }
    return checkMultiChoices(multiChoices)
  }

  const onCancel = () => {
    setPopupOpen(false)
  }

  const onConfirm = () => {
    if (checkCanSubmit()) {
      if(props.type===QUESTION_TYPE.RANGE && question){
        props.onConfirm({choice: `${question.rangeAnswer ? question.rangeAnswer[0] : +question.option[0].choice}┋${question.rangeAnswer ? question.rangeAnswer[1] : +question.option[1].choice}` })
      }else if(props.type===QUESTION_TYPE.MULTI_CHOICE) {
        props.onConfirm({choice: multiChoices})
      }
      onCancel()
    } else {
      Taro.showToast({title: feedbackValue,duration:2000,icon:'none'})
      setCanSubmit(false)
    }
  }

  return (
    <>
      <Cell
        className='form-cell form-qa-cell'
        title={props.title}
        clickable={props.modifiable}
        align='center'
        onClick={async () => {
          if(props.modifiable){
            setMultiChoices(props.multiChoices?props.multiChoices:[])
            setPopupOpen(true)
            setMultiChoices(props.multiChoices?props.multiChoices:[])
            setPopupOpen(true)

          }else{
            await Taro.showToast({
              title: "活动报名结束-匹配结果公布期间不能修改问卷", duration: 2000, icon: 'none'
            })
          }

        }}
      >
        <View className='value qa-value'>
          {cellValue==='请选择' && <View className='dot'/>}
          <Text>{cellValue}</Text>
        </View>
      </Cell>

      <Popup className='form-popup' open={popupOpen} rounded placement='bottom' onClose={()=>setPopupOpen(false)}>
        <Popup.Backdrop/>
        <View className='popup-title'>
          {props.title}
        </View>
        {props.type === QUESTION_TYPE.MULTI_CHOICE?(
          <View className='check-body'>
            <ScrollView className='card-scroll' showScrollbar={false} enableFlex scrollY scrollWithAnimation style={{width: `${0.9*windowWidth}`}}>
              {multiChoices &&
                <>
                  {multiChoices.map((item, idx) => (

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
                    )
                  )}
                </>}
            </ScrollView>
          </View>
        ):question && props.type === QUESTION_TYPE.RANGE?(
          <View className='col range-picker'>
            <View className='row range-title'>
              <View>最低</View>
              <View>最高</View>
            </View>
            <Picker value={question.rangeAnswer?question.rangeAnswer:[range[0],range[range.length-1]]} onCancel={onCancel} onChange={(value) => setQuestion({...question, rangeAnswer: [...value]})}>
              <Picker.Column>
                {
                  range.map((_item)=>
                    <Picker.Option value={_item}>{_item}</Picker.Option>
                  )
                }
              </Picker.Column>
              <Picker.Column>
                {
                  range.map((_item)=>
                    <Picker.Option value={_item}>{_item}</Picker.Option>
                  )
                }
              </Picker.Column>
            </Picker>
          </View>
        ):(<></>)
        }
        <View className={classnames('confirm-btn', {'confirm-btn-disabled': !canSubmit})} onClick={() => {
          onConfirm()
        }}
        >确认</View>
      </Popup>
    </>
  );
}

export default SurveyMultiCell;
