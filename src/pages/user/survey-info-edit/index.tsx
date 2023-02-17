import classnames from "classnames";
import {Button, Text, View} from "@tarojs/components";
import {Cell, Dialog, Image, Slider, Switch} from "@taroify/core"
import {QUESTION_TYPE, TOAST_SHOW_TIME} from "@/utils/constant";
import MultiChoicePopUp from "@/components/survey-info-item/multi-choice-popup";
import {IDepend, IOption, IOptionalItem} from "@/typings/types";

import {PersonalInfoTipsIcon, SurveyAddItem} from "@/assets/images";
import {useEffect, useState} from "react";


import {fetchSurveyDetail, modifySurveyDetail} from "@/actions/user";
import {useDispatch, useSelector} from "react-redux";


import DragSort from "@/components/survey-info-item/drag-sort";
import Taro from "@tarojs/taro";
import {checkString, combineChoices, generateAnswerString} from "@/utils/fcheck";
import SurveyMultiCell from "@/components/survey-info-item/required-cell";
import {fetchActivityData, finishFillForm as actionFinishFillForm} from "@/actions/activity";
import './index.scss'

interface ISurveyPopUp{
  type: QUESTION_TYPE,
  multichoices: IOption[] | undefined,
  openId:number,
  title:string,
  limit: number | undefined,
  otherType: 'input' | 'picker' | undefined
}

const SurveyInfoEdit = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(state=>state)
  const {fillForm,match} = useSelector(rootState => rootState.activity.participate)
  const {filled,isComplete} = fillForm
  const {matchResult} = match
  const surveyDetail = user.surveyDetail!

  const [changeable,setChangeable] = useState(false)
  const [required,setRequired] = useState<IOptionalItem[]>([])
  const [chosenOptional,setChosenOptional] = useState<IOptionalItem[]>([])
  const [unChosenOptional,setUnchosenOptional] = useState<IOptionalItem[]>([])
  const [relaxCheck,setRelaxCheck] = useState<IOptionalItem>({
    limit: 0,
    option: [],
    depends: undefined,
    order: 0,
    questionId: 0,
    questionIndex: 0,
    questionType: QUESTION_TYPE.MULTI_CHOICE,
    required: false,
    answer: '否',
    title: "",
  })
  const [relaxSingle,setRelaxSingle] = useState<IOptionalItem>({
    limit: 0,
    option: [],
    depends: undefined,
    order: 0,
    questionId: 0,
    questionIndex: 0,
    questionType: QUESTION_TYPE.MULTI_CHOICE,
    required: false,
    answer: '0',
    title: "",
  })
  const [popUpOpenId,setPopUpOpenId] = useState(-1)
  const [filledRequired,setFilledRequired] = useState(false)
  const [confirmDialogOpen,setConfirmDialogOpen] = useState(false)

  useEffect(()=>{
    dispatch(fetchSurveyDetail())
    dispatch(fetchActivityData())
  },[])

  useEffect(()=>{
    if(surveyDetail){
      isFillRequired()
      const chosen = surveyDetail.noRequireMatchRequests.filter((item)=>item.order).sort((a,b)=> {
          return a.order - b.order
      })

      const unChosen = surveyDetail.noRequireMatchRequests.filter((item)=>(!item.order) && item.questionType !== QUESTION_TYPE.OPTION_SINGLE && item.questionType !== QUESTION_TYPE.OPTION_CHECK).sort((a,b)=>a.questionIndex-b.questionIndex)
      const findRelaxSingle = surveyDetail.noRequireMatchRequests.filter(item => item.questionType === QUESTION_TYPE.OPTION_SINGLE)
      const findRelaxCheck = surveyDetail.noRequireMatchRequests.filter(item => item.questionType === QUESTION_TYPE.OPTION_CHECK)
      if(findRelaxCheck.length > 0) setRelaxCheck({...findRelaxCheck[0]})
      if(findRelaxSingle.length > 0) setRelaxSingle({...findRelaxSingle[0]})

      setChosenOptional([...chosen])
      setUnchosenOptional([...unChosen])
      setRequired([...surveyDetail.requireMatchRequests])
    }
  },[surveyDetail])
  useEffect(()=>{
    if(match.state === 'NOT_START' && filled) setChangeable(false)
    else if(match.state === 'ACTIVE' && matchResult) setChangeable(false)
    else{
      setChangeable(true)
    }
  },[fillForm,match])

  const checkDepend = (depend : IDepend[] | undefined,allQuestions = [...surveyDetail.requireMatchRequests,...surveyDetail.noRequireMatchRequests]) => {
    if(depend && depend.length > 0){
      let unCheck = true
      allQuestions.filter((_item)=>{
        if(depend[0].dependQuestionId === _item.questionId){ // TODO: 目前只检查第一个depend项
          unCheck = _item.answer?.split('┋').indexOf(`${depend[0].dependOptionId}`) ===-1
          return unCheck
        }else return false
      })

      if(unCheck){
        return false
      }
    }
    return true // 选择了依赖项或没有依赖
  }

  const isFillRequired = () => {
    const res = required.map((item)=>{
      if(item.depends){
        if(checkDepend(item.depends)) return checkString(item.answer)
        else return true
      }
      return checkString((item.answer))
    })
    setFilledRequired(res.indexOf(false) === -1)
  }

  const onConfirmRelax = (value)=>{
    const noRelaxOptional = surveyDetail.noRequireMatchRequests.filter(item => item.questionType !== QUESTION_TYPE.OPTION_CHECK && item.questionType !== QUESTION_TYPE.OPTION_SINGLE)
    dispatch(modifySurveyDetail([...noRelaxOptional,...value]))
  }

  const onConfirmRequired = (value) => {
    // value: 需要更新的required request
    dispatch(modifySurveyDetail([...value,...surveyDetail.noRequireMatchRequests]))
  }

  const onConfirmAll = (value) => {
    dispatch(modifySurveyDetail(value))
  }

  const onConfirmOrder = (value) => {
    dispatch(modifySurveyDetail([...value,...unChosenOptional,...required]))
  }

  const onConfirmSingleSurveyInfo = (value)=>{
    const requiredData = [...surveyDetail.requireMatchRequests,...surveyDetail.noRequireMatchRequests]
    const postData = requiredData.map((item)=>{
      if(item.questionId === value.questionId) return value;
      else return item
    })

    dispatch(modifySurveyDetail(postData))
  }

  const onSubmit = ()=>{
    if(fillForm.state === 'ACTIVE' && !filled){
      // 对话框是否确认提交
      setConfirmDialogOpen(true)
    }else{
      // 仅保存信息
      onConfirmAll([...surveyDetail.noRequireMatchRequests,...surveyDetail.requireMatchRequests])
    }
  }

  const confirmSubmit = ()=>{
    if(surveyDetail && isComplete){
      dispatch(actionFinishFillForm([...surveyDetail.noRequireMatchRequests,...surveyDetail.requireMatchRequests]))
    }
  }

  const addOptinal = async (item: IOptionalItem)=>{
    if(chosenOptional.length >= surveyDetail.noRequiredMax){
      await Taro.showToast({title:`最多选择${surveyDetail.noRequiredMax}项~`,duration:2000,icon:'none'})
    }
    else{
      setPopUpOpenId(item.questionId)
    }
  }

  return (
    <View className='container'>
      <View className={classnames('survey-info-divider', {'survey-info-divider-highlight': !filledRequired})}>
        <Text className='title'>必填条件</Text>
      </View>

      <Cell.Group>
        {
          required && required.map((item)=>{
            return (
              item.questionType === QUESTION_TYPE.MULTI_CHOICE && checkDepend(item.depends) ? (
                  <SurveyMultiCell
                    title={item.title}
                    answer={combineChoices(item.properAnswer,true)}
                    modifiable={changeable}
                    multiChoices={item.properAnswer?[...item.properAnswer]:[]}
                    multiChoiceLimitRestrict={item.limit}
                    otherType='none'
                    onConfirm={
                      (value) => {
                        if (value.choice) {
                          const allQuestion = [...surveyDetail.requireMatchRequests,...surveyDetail.noRequireMatchRequests]
                          const tmp = allQuestion.map(_item => {
                            if(item.questionId === _item.questionId){
                              return {..._item,answer:generateAnswerString(value.choice,_item.questionType)}
                            }
                            else
                              return _item
                          })
                          const newRequired = tmp.map(_item => {
                            if(!checkDepend(_item.depends,allQuestion)){
                              return {..._item,answer:null,order:null}
                            }else
                              return _item
                          })
                          onConfirmAll([...newRequired])
                        }
                      }
                    }
                  />
                ):item.questionType===QUESTION_TYPE.RANGE?(
                <View className='col age-cell'>
                  <Text>{item.title}</Text>
                  <Slider
                    className='survey-slider'
                    range
                    defaultValue={[1996,2005]}
                    step={1}
                    min={+item.option[0].choice}
                    max={+item.option[1].choice}
                    size={3}
                    value={item.rangeAnswer}
                    disabled={!changeable}
                    onChange={async (value)=>{
                      if(changeable){
                        setRequired([...required.map((_item)=>{
                          if(_item.questionId === item.questionId) return {..._item,rangeAnswer:[...value],
                            answer:`${value[0]}┋${value[1]}`}
                          else return _item})])
                      }
                      else{
                        await Taro.showToast({
                          title: "您已提交本期活动问卷，暂时不可修改～",
                          duration: 2000,
                          icon: 'none'
                        })
                      }
                      }
                    }
                    onTouchEnd={()=>{
                      if(changeable){
                        onConfirmRequired(required)
                      }
                    }}
                  >
                    <Slider.Thumb><Text className='slider-text'>{item.rangeAnswer?item.rangeAnswer[0]:item.option[0].choice}</Text></Slider.Thumb>
                    <Slider.Thumb><Text className='slider-text'>{item.rangeAnswer?item.rangeAnswer[1]:item.option[1].choice}</Text></Slider.Thumb>
                  </Slider>
                </View>
              ):(
                <></>
              )
            )
          })
        }

      </Cell.Group>

      <View className={classnames('survey-info-divider')}>
        <Text className='title'>{`选填条件（至多${surveyDetail?surveyDetail.noRequiredMax:0}个，按住拖动可调顺序，左滑删除）`}</Text>
      </View>
      {chosenOptional && chosenOptional.length === 0?(
        <View className='row tip-bar'>
          <Image className='tip-icon' src={PersonalInfoTipsIcon}/>
          <Text className='tip-text'>还没有填写选填条件，快去下方添加吧～</Text>
        </View>
      ):(
        <>
          <DragSort
            isChangeable={changeable}
            dragList={chosenOptional.map((q)=> {
              return {question:q, y: 0}
            })}
            onConfirm={(value)=>{
              onConfirmSingleSurveyInfo(value)
            }}
            onConfirmOrder={(value)=>{
              onConfirmOrder(value)
            }}
          />
          <View className='col relax'>
            <View className='row relax-ask'>
              <View className='text-block'>
                <Text>若未能匹配到双向满足要求的匹配对象</Text>
                <View>
                  是否能接受<Text className='text-enhance'>放宽要求进行重新匹配？ </Text>
                </View>
              </View>
              <View className='row switch-block'>
                <Text className='switch-label'>{relaxCheck.answer=== '是'?'是':'否'}</Text>
                <Switch
                  className='switch-color'
                  checked={relaxCheck.answer === '是'}
                  onChange={async (value)=>{
                    if(changeable){
                      if(value){
                        onConfirmRelax([{...relaxCheck,answer:'是'},relaxSingle])
                      }else{
                        onConfirmRelax([{...relaxCheck,answer:'否'},{...relaxSingle,answer:null}])
                      }
                    }
                  else{
                      await Taro.showToast({
                        title: "您已提交本期活动问卷，暂时不可修改～",
                        duration: 2000,
                        icon: 'none'
                      })
                    }
                  }
                }
                />
              </View>
            </View>

            {relaxCheck.answer === '是' && <View className='col relax-count'>
              <Text>您最多接受放弃几个条件？按以上排序从后往前舍去</Text>
              <View className='col relax-radio'>
                <View className='row relax-group'>
                  {
                    [...new Array(relaxSingle.option.length).keys()].map(x => x+1).map((item,i)=>{
                      return (
                        <>
                          {i !== 0 && <View className='relax-axis'/>}
                          <View className={classnames('col relax-radio-item',{'relax-radio-item-checked':`${item}` === relaxSingle.answer})}
                            onClick={async ()=>{
                              if(changeable) {
                                onConfirmRelax([relaxCheck, {...relaxSingle, answer: `${item}`}])
                              }
                              else{
                                await Taro.showToast({
                                  title: "您已提交本期活动问卷，暂时不可修改～",
                                  duration: 2000,
                                  icon: 'none'
                                })
                              }
                            }}
                          >
                            <view className='radio-circle'/>
                            <View className='radio-label'>{item}个</View>

                          </View>
                        </>
                      )
                    })
                  }
                </View>

              </View>
            </View>}
          </View>
        </>
      )}

      {unChosenOptional && unChosenOptional.map((_item)=>{
        return (
          checkDepend(_item.depends)?<>
            <View className='row survey-item'>
              <Text className='font'>{_item.title}</Text>
              <Image className='right-btn' src={SurveyAddItem} onClick={async ()=>{
                if(changeable){
                  addOptinal(_item)
                }
                else{
                  await Taro.showToast({
                    title: "您已提交本期活动问卷，暂时不可修改～",
                    duration: 2000,
                    icon: 'none'
                  })
                }
              }}
              />
            </View>
              <MultiChoicePopUp
                open={popUpOpenId===_item.questionId}
                title={_item.title}
                modifiable
                multiChoices={_item.properAnswer?[..._item.properAnswer]:[]}
                multiChoiceLimitRestrict={_item.limit}
                rangeQuestion={_item}
                onConfirm={
                  (value) => {
                    if (value.choice) {
                      onConfirmSingleSurveyInfo({..._item,order:chosenOptional.length+1,answer:generateAnswerString(value.choice,_item.questionType)})
                    }
                    setPopUpOpenId(-1)
                  }
                }
                onClose={()=>setPopUpOpenId(-1)}
                type={_item.questionType}
              />

          </>
            :<></>
        )
      })}

      {fillForm.state === 'ACTIVE' && match.state !== 'ACTIVE' && !filled && <View className='row btn-wrapper'>
        <View className={classnames('confirm-btn', {'confirm-btn-disabled': !isComplete})}
          onClick={
          async () => {
            if(isComplete){
              onSubmit()
            }else{
              await Taro.showToast({title:'您还有问卷内容未完善～',duration:2000,icon:'none'})
            }

          }}
        >提交本期活动问卷</View>
      </View>}

      <Dialog open={confirmDialogOpen} onClose={setConfirmDialogOpen}>
        <Dialog.Header className='dialog-header'>确认提交问卷？确认后匹配问卷不可修改</Dialog.Header>
        <Dialog.Actions>
          <Button className='dialog-btn' onClick={() => setConfirmDialogOpen(false)}>我再看看</Button>
          <Button className='dialog-btn' onClick={() => {
            setConfirmDialogOpen(false)
            confirmSubmit()
          }}
          >确认提交
          </Button>
        </Dialog.Actions>
      </Dialog>

    </View>
  )
};

export default SurveyInfoEdit;

