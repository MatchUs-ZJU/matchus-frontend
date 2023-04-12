import classnames from "classnames";
import { Text, View } from "@tarojs/components";
import { Cell, Image, Switch } from "@taroify/core"
import { QUESTION_TYPE } from "@/utils/constant";
import MultiChoicePopUp from "@/components/survey-info-item/multi-choice-popup";
import { IDepend, IOptionalItem, ISpecialItem } from "@/typings/types";

import { PersonalInfoTipsIcon, SurveyAddItem } from "@/assets/images";
import { useEffect, useState } from "react";


import { fetchSurveyDetail, modifySurveyDetail, remakeSurveyDetail } from "@/actions/user";
import { useDispatch, useSelector } from "react-redux";


import DragSort from "@/components/survey-info-item/drag-sort";
import Taro from "@tarojs/taro";
import { checkString, combineChoices, generateAnswerString } from "@/utils/fcheck";
import SurveyMultiCell from "@/components/survey-info-item/required-cell";
import { fetchActivityData } from "@/actions/activity";
import './index.scss'

const SurveyInfoEdit = () => {
  const dispatch = useDispatch()
  const { user, activity } = useSelector(state => state)
  const { signUpEndTime, matchResultShowTime , signUpStartTime } = activity
  const { fillForm, match } = useSelector(rootState => rootState.activity.participate)
  const { matchResult } = match
  const [signUpEnd, setSignUpEnd] = useState(false)
  const surveyDetail = user.surveyDetail

  // const matchResultShowTime = new Date().getTime()

  const [changeable, setChangeable] = useState(false)
  const [specialChangeable, setSpecialChangeable] = useState(false)
  const [required, setRequired] = useState<IOptionalItem[]>([])
  const [chosenOptional, setChosenOptional] = useState<IOptionalItem[]>([])
  const [unChosenOptional, setUnchosenOptional] = useState<IOptionalItem[]>([])
  const [specialRequest, setSpecialRequest] = useState<ISpecialItem>()
  const [relaxCheck, setRelaxCheck] = useState<IOptionalItem>({
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
  const [relaxSingle, setRelaxSingle] = useState<IOptionalItem>({
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
  const [popUpOpenId, setPopUpOpenId] = useState(-1)
  const [filledRequired, setFilledRequired] = useState(false)

  useEffect(() => {
    dispatch(fetchSurveyDetail())
    dispatch(fetchActivityData())
  }, [])

  useEffect(() => {
    isFillRequired()
  }, [required])

  useEffect(() => {
    if (surveyDetail) {
      isFillRequired()
      const chosen = surveyDetail.noRequireMatchRequests.filter((item) => item.order).sort((a, b) => {
        return a.order - b.order
      })

      const unChosen = surveyDetail.noRequireMatchRequests.filter((item) => (!item.order) && item.questionType !== QUESTION_TYPE.OPTION_SINGLE && item.questionType !== QUESTION_TYPE.OPTION_CHECK).sort((a, b) => a.questionIndex - b.questionIndex)
      const findRelaxSingle = surveyDetail.noRequireMatchRequests.filter(item => item.questionType === QUESTION_TYPE.OPTION_SINGLE)
      const findRelaxCheck = surveyDetail.noRequireMatchRequests.filter(item => item.questionType === QUESTION_TYPE.OPTION_CHECK)
      if (findRelaxCheck.length > 0) setRelaxCheck({ ...findRelaxCheck[0] })
      if (findRelaxSingle.length > 0) setRelaxSingle({ ...findRelaxSingle[0] })
      if(surveyDetail.specialRequests == null){
        setSpecialRequest(undefined)
      } else {
        let specialRequest = surveyDetail.specialRequests[0]
        if (!specialRequest.answer) specialRequest.answer = ''
        let answer = specialRequest.answer.split('┋')
        specialRequest.choices = specialRequest.choices.map((item) => {
          if (answer && answer.indexOf(`${item.choiceIndex}`) !== -1) {
            return { ...item, checked: true }
          } else {
            return { ...item, checked: false }
          }
        }).sort((a, b) => a.choiceIndex - b.choiceIndex)
        setSpecialRequest({ ...specialRequest })
      }
      setChosenOptional([...chosen])
      setUnchosenOptional([...unChosen])
      setRequired([...surveyDetail.requireMatchRequests])
    }
  }, [surveyDetail])


  useEffect(() => {
    if (matchResultShowTime && signUpEndTime) {
      const now = new Date().getTime()
      setChangeable(now <= signUpEndTime || now >= matchResultShowTime)
    }
    else {
      setChangeable(true)
    }
  }, [activity])

  // useEffect(() => {
  //   if (signUpStartTime && signUpEndTime) {
  //     const now = new Date().getTime()
  //     setSpecialChangeable(now <= signUpEndTime && now >= signUpStartTime)
  //   }
  //   else {
  //     setSpecialChangeable(true)
  //   }
  // }, [activity])


  const checkDepend = (depend: IDepend[] | undefined, allQuestions = [...surveyDetail.requireMatchRequests, ...surveyDetail.noRequireMatchRequests]) => {
    if (depend && depend.length > 0) {
      let unCheck = true
      allQuestions.filter((_item) => {
        if (depend[0].dependQuestionId === _item.questionId) { // TODO: 目前只检查第一个depend项
          unCheck = _item.answer?.split('┋').indexOf(`${depend[0].dependOptionId}`) === -1
          return unCheck
        } else return false
      })

      if (unCheck) {
        return false
      }
    }
    return true // 选择了依赖项或没有依赖
  }

  const isFillRequired = () => {
    const res = required.map((item) => {
      if (item.depends) {
        if (checkDepend(item.depends)) return checkString(item.answer)
        else return true
      }
      return checkString((item.answer))
    })
    setFilledRequired(res.indexOf(false) === -1)
  }

  const onConfirmRelax = (value) => {
    const noRelaxOptional = surveyDetail.noRequireMatchRequests.filter(item => item.questionType !== QUESTION_TYPE.OPTION_CHECK && item.questionType !== QUESTION_TYPE.OPTION_SINGLE)
    dispatch(modifySurveyDetail({ matchRequestInfos: [...noRelaxOptional, ...value] }))
  }


  const onConfirmAll = (value) => {
    dispatch(modifySurveyDetail({ matchRequestInfos: value }))
  }

  const onConfirmOrder = (value) => {
    dispatch(modifySurveyDetail({ matchRequestInfos: [...value, ...unChosenOptional, ...required] }))
  }

  const onRemakeOrder = (value) => {
    //dispatch(remakeSurveyDetail([...value,...unChosenOptional,...required]))
  }

  const onConfirmSpecialRequest = (value) => {
    let answer = value.choices.filter(item => item.checked).map(item => item.choiceIndex).join('┋')
    if (answer === '') answer = null
    value = { ...value, answer: answer }
    dispatch(modifySurveyDetail({ specialInfos: [...[value]] }))
  }
  // const onConfirmSpecial = (value) => {
  //   dispatch(modifySurveyDetail([...value,...required]))
  // }

  const onConfirmSingleSurveyInfo = (value) => {
    const requiredData = [...surveyDetail.requireMatchRequests, ...surveyDetail.noRequireMatchRequests]
    const postData = requiredData.map((item) => {
      if (item.questionId === value.questionId) return value;
      else return item
    })
    console.log(postData)

    dispatch(modifySurveyDetail({ matchRequestInfos: postData}))
  }


  const addOptinal = async (item: IOptionalItem) => {
    if (chosenOptional.length >= surveyDetail.noRequiredMax) {
      await Taro.showToast({ title: `最多选择${surveyDetail.noRequiredMax}项~`, duration: 2000, icon: 'none' })
    }
    else {
      setPopUpOpenId(item.questionId)
    }
  }

  return (
    <View className='container'>
      <View className={classnames('survey-info-divider', { 'survey-info-divider-highlight': !filledRequired })}>
        <Text className='title'>必填条件</Text>
      </View>

      <Cell.Group>
        {
          required && required.map((item) => {
            return (
              item.questionType === QUESTION_TYPE.MULTI_CHOICE && checkDepend(item.depends) ? (
                <SurveyMultiCell
                  type={QUESTION_TYPE.MULTI_CHOICE}
                  title={item.title}
                  answer={combineChoices(item.properAnswer, true)}
                  modifiable={changeable}
                  multiChoices={item.properAnswer ? [...item.properAnswer] : []}
                  multiChoiceLimitRestrict={item.limit}
                  otherType='none'
                  onConfirm={
                    (value) => {
                      if (value.choice) {
                        const allQuestion = [...surveyDetail.requireMatchRequests, ...surveyDetail.noRequireMatchRequests]
                        const tmp = allQuestion.map(_item => {
                          if (item.questionId === _item.questionId) {
                            return { ..._item, answer: generateAnswerString(value.choice, _item.questionType) }
                          }
                          else
                            return _item
                        })
                        const newRequired = tmp.map(_item => {
                          if (!checkDepend(_item.depends, allQuestion)) {
                            return { ..._item, answer: null, order: null }
                          } else
                            return _item
                        })
                        onConfirmAll([...newRequired])
                      }
                    }
                  }
                />
              ) : item.questionType === QUESTION_TYPE.RANGE ? (
                <SurveyMultiCell
                  type={QUESTION_TYPE.RANGE}
                  title={item.title}
                  question={item}
                  answer={combineChoices(item.properAnswer, true)}
                  modifiable={changeable}
                  multiChoices={item.properAnswer ? [...item.properAnswer] : []}
                  multiChoiceLimitRestrict={item.limit}
                  otherType='none'
                  onConfirm={
                    (value) => {
                      if (value.choice) {
                        const allQuestion = [...surveyDetail.requireMatchRequests, ...surveyDetail.noRequireMatchRequests]
                        const tmp = allQuestion.map(_item => {
                          if (item.questionId === _item.questionId) {
                            return { ..._item, answer: generateAnswerString(value.choice, _item.questionType) }
                          }
                          else
                            return _item
                        })
                        const newRequired = tmp.map(_item => {
                          if (!checkDepend(_item.depends, allQuestion)) {
                            return { ..._item, answer: null, order: null }
                          } else
                            return _item
                        })
                        onConfirmAll([...newRequired])
                      }
                    }
                  }
                />
              ) : (
                <></>
              )
            )
          })
        }

      </Cell.Group>
      {specialRequest ? (
        <><View className={classnames('survey-info-divider')}>
          <Text className='title'>{`${specialRequest.title}`}</Text>
        </View>
          <View className="special-list">
            {specialRequest.choices && specialRequest.choices.map((item) => {
              return (
                <View
                  className={item.checked ? "special-text-container-chosen" : "special-text-container-unchosen"}
                  onClick={async () => {
                    if (changeable) {
                      let checkedCount = specialRequest.choices.filter(item => item.checked).length;
                      let res = 0;
                      let newSpecialRequest = {
                        ...specialRequest, choices: specialRequest.choices.map((_item) => {
                          if (_item.choiceIndex !== item.choiceIndex) {
                            return _item;
                          } else {
                            if (!item.checked && checkedCount >= (specialRequest.limit ?? 1000)) {
                              res = 1;
                              return _item;
                            }
                            else
                              return { ..._item, checked: !_item.checked }
                          }
                        })
                      }
                      if(res === 1){
                        await Taro.showToast({
                          title: "最多选择" + specialRequest.limit + "项",
                          duration: 2000,
                          icon: 'none'
                        })
                      }
                      else
                        onConfirmSpecialRequest({ ...newSpecialRequest })
                    } else {
                      await Taro.showToast({
                        title: "该问卷只能在活动期间修改",
                        duration: 2000,
                        icon: 'none'
                      })
                    }
                    // dispatch(modifySurveyDetail(

                  }}
                >
                  <Text className="special-text">{item.choice}</Text>
                </View>
              );
            })}
          </View>
        </>
      ) : (<></>)}




      <View className={classnames('survey-info-divider')}>
        <Text className='title'>{`选填条件（至多${surveyDetail ? surveyDetail.noRequiredMax : 0}个，按住拖动可调顺序，左滑删除）`}</Text>
      </View>
      {chosenOptional && chosenOptional.length === 0 ? (
        <View className='row tip-bar'>
          <Image className='tip-icon' src={PersonalInfoTipsIcon} />
          <Text className='tip-text'>还没有填写选填条件，快去下方添加吧～</Text>
        </View>
      ) : (
        <>
          <DragSort
            isChangeable={changeable}
            dragList={chosenOptional.map((q) => {
              return { question: q, y: 0 }
            })}
            onConfirm={(value) => {
              onConfirmSingleSurveyInfo(value)
            }}
            onConfirmOrder={(value) => {
              onConfirmOrder(value)
            }}
            onRemakeOrder={(value) => {
              onRemakeOrder(value)
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
                <Text className='switch-label'>{relaxCheck.answer === '是' ? '是' : '否'}</Text>
                <Switch
                  className='switch-color'
                  checked={relaxCheck.answer === '是'}
                  onChange={async (value) => {
                    if (changeable) {
                      if (value) {
                        onConfirmRelax([{ ...relaxCheck, answer: '是' }, relaxSingle])
                      } else {
                        onConfirmRelax([{ ...relaxCheck, answer: '否' }, { ...relaxSingle, answer: null }])
                      }
                    }
                    else {
                      await Taro.showToast({
                        title: "该问卷只能在活动期间修改",
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
                    [...new Array(relaxSingle.option.length).keys()].map(x => x + 1).map((item, i) => {
                      return (
                        <>
                          {i !== 0 && <View className='relax-axis' />}
                          <View className={classnames('col relax-radio-item', { 'relax-radio-item-checked': `${item}` === relaxSingle.answer })}
                            onClick={async () => {
                              if (changeable) {
                                onConfirmRelax([relaxCheck, { ...relaxSingle, answer: `${item}` }])
                              }
                              else {
                                await Taro.showToast({
                                  title: "该问卷只能在活动期间修改",
                                  duration: 2000,
                                  icon: 'none'
                                })
                              }
                            }}
                          >
                            <view className='radio-circle' />
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

      {unChosenOptional && unChosenOptional.map((_item) => {
        return (
          checkDepend(_item.depends) ?
            <>
              <View className='row survey-item'>
                <Text className='font'>{_item.title}</Text>
                <Image className='right-btn' src={SurveyAddItem} onClick={async () => {
                  if (changeable) {
                    addOptinal(_item)
                  }
                  else {
                    await Taro.showToast({
                      title: "该问卷只能在活动期间修改",
                      duration: 2000,
                      icon: 'none'
                    })
                  }
                }}
                />
              </View>
              <MultiChoicePopUp
                open={popUpOpenId === _item.questionId}
                title={_item.title}
                modifiable
                multiChoices={_item.properAnswer ? [..._item.properAnswer] : []}
                multiChoiceLimitRestrict={_item.limit}
                rangeQuestion={_item}
                onConfirm={
                  (value) => {
                    if (value.choice) {
                      onConfirmSingleSurveyInfo({ ..._item, order: chosenOptional.length + 1, answer: generateAnswerString(value.choice, _item.questionType) })
                    }
                    setPopUpOpenId(-1)
                  }
                }
                onClose={() => setPopUpOpenId(-1)}
                type={_item.questionType}
              />

            </>
            : <></>
        )
      })}

    </View>
  )
};

export default SurveyInfoEdit;

