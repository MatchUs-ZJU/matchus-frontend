import {Text, View} from "@tarojs/components";
import "@taroify/core/cell/style"
import {useDispatch, useSelector} from "react-redux";
// import {Arrow, Edit} from "@taroify/icons";
import {useCallback, useEffect, useState} from "react";
import {fetchPersonInfo, submitPersonalInfo} from "@/actions/user";
import {Cell, Image} from "@taroify/core";
import PersonalInfoPopUp, {PopUpProps} from "@/components/personal-info-popup";
import Taro, {useDidShow, useReady} from "@tarojs/taro";
import {
  CHECK_TYPE,
  CONSUMPTION,
  FUTURE_BASE,
  GENDER,
  GRADUATE_INCOME,
  INDUSTRY,
  INPUT_TYPE,
  INTEREST,
  PICKER_TYPE,
  SUBJECT_QUESTION,
  TEMPERAMENT,
  TOAST_SHOW_TIME,
  USER_TYPE
} from "@/utils/constant";
import {
  checkApperanceInfo,
  checkBasicInfo,
  checkHabitInfo,
  checkLoveInfo,
  checkMajorInfo,
  checkMultiChoices,
  checkPhotos,
  checkStatusInfo,
  checkString,
  checkSubjectInfo,
  combineChoices,
  completeChoices, splitOthers
} from "@/utils/fcheck"
import classnames from "classnames";
import MultiChoice, {IMultiChoicePopup} from "@/components/personal-info-modal";
import {getDateFromStamp} from "@/utils/ftime";
import './index.scss';

const Index = () => {
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state)
  const {isChangeable} = user
  const [highlight, setHighlight] = useState({
    basic: false,
    status: false,
    major: false,
    apperance: false,
    habit: false,
    love: false,
    subject: false
  })

  const [personInfo, setPersonInfo] = useState(user.personInfo!)
  const [images, setImages] = useState(user.images ? user.images : [])

  const fetchData = () => {
    dispatch(fetchPersonInfo())
  }

  useDidShow(async () => {
    if (user.isChangeable) {await Taro.showToast({title: '点击条目进行修改~', duration: TOAST_SHOW_TIME, icon: 'none'})}
    if(!user.personInfo){
      fetchData()
    }else{
      setPersonInfo(JSON.parse(JSON.stringify(user.personInfo)))
    }
  })

  // useEffect(() => {
  //   if(!user.personInfo){
  //     fetchData()
  //   }},
  //   []
  // )

  useEffect(() => {setPersonInfo(user.personInfo!)}, [user.personInfo])
  useEffect(() => {setImages(user.images ? user.images : [])}, [user.images])
  useEffect(() => {
    setHighlight({
      ...highlight,
      basic: !checkBasicInfo(personInfo),
      status: !checkStatusInfo(personInfo, user.userType),
      major: !checkMajorInfo(personInfo, user.userType),
      apperance: !checkApperanceInfo(personInfo, images),
      habit: !checkHabitInfo(personInfo),
      love: !checkLoveInfo(personInfo, user.userType),
      subject: !checkSubjectInfo(personInfo)
    })
  }, [personInfo])

  // 信息修改
  const onConfirmPersonInfo = (value) => {
    setPersonInfo({...personInfo, ...value})
    dispatch(submitPersonalInfo({personInfo: {...value}, images: null}))
    fetchData()
  }
  const onConfirmImages = (value) => {
    setImages(value)
    dispatch(submitPersonalInfo(
      {
        personInfo: personInfo,
        images: {
          realName: user.realName,
          studentNumber: user.studentNumber,
          images: value
        }
      }))
    fetchData()
  }
  const onPopupCancel = () => {setPopUp({...popup, open: false})}
  const closeCheckPopup = () => {setCheckPopup({...checkPopup, open: false})}

  const [checkPopup, setCheckPopup] = useState<IMultiChoicePopup>({
    open: false,
    type: CHECK_TYPE.INTEREST,
    radioChecked: "",
    radioData: {question: '', choices: []},
    selfChoice: personInfo ? personInfo.selfFutureBase : '',
    onCancel: closeCheckPopup,
    onConfirm: onConfirmPersonInfo
  })
  const [popup, setPopUp] = useState<PopUpProps>({
    title: '修改微信',
    open: false,
    type: 'input',
    inputType: INPUT_TYPE.WECHAT_NUMBER,
    pickerType: PICKER_TYPE.BIRTH,
    checkType: CHECK_TYPE.INTEREST,
    photoUrls: user.images,
    otherEnabled: false,
    otherValue: '',
    checkRestrict: 0,
    cancel: onPopupCancel,
    confirm: onConfirmPersonInfo,
  })

  return (
    <View className='container'>
      {personInfo &&
        <>
          <View className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.basic})}>
            <Text className='title'>基本信息</Text>
          </View>
          <Cell.Group>
            <Cell
              className='cell'
              title='真实姓名'
              clickable={isChangeable}
              align='center'
              onClick={
                async () => {
                  if (isChangeable) {
                    await Taro.showToast({
                      title: "暂不支持修改～",
                      duration: TOAST_SHOW_TIME,
                      icon: 'none'
                    })
                  }
                }
              }
            >
              <Text>{user.realName}</Text>
            </Cell>

            <Cell
              className='cell'
              title='学号'
              clickable={isChangeable}
              align='center'
              onClick={async () => {
                if (isChangeable) {
                  await Taro.showToast({
                    title: "暂不支持修改～",
                    duration: TOAST_SHOW_TIME,
                    icon: 'none'
                  })
                }
              }
              }
            >
              <Text>{user.studentNumber}</Text>
            </Cell>
            <Cell
              className='cell'
              title='身高'
              clickable={user.isChangeable}
              align='center'
              onClick={() => {
                setPopUp({
                  ...popup,
                  title: '修改身高',
                  type: 'input',
                  inputType: INPUT_TYPE.HEIGHT,
                  initialValue: personInfo && personInfo.height ? personInfo.height : '',
                  open: true,
                  confirm: onConfirmPersonInfo
                })
              }}
            >
              <View className='value'>
                {!(personInfo && personInfo.height) && <View className='dot'/>}
                <Text>{personInfo && personInfo.height ? personInfo.height : '请填写'}</Text>
              </View>
            </Cell>
            <Cell
              className='cell'
              title='体重'
              clickable={user.isChangeable}
              align='center'
              onClick={() => {
                setPopUp({
                  ...popup,
                  title: '修改体重',
                  type: 'input',
                  inputType: INPUT_TYPE.WEIGHT,
                  initialValue: personInfo && personInfo.weight ? personInfo.weight : '',
                  open: true,
                  confirm: onConfirmPersonInfo
                })
              }}
            >
              <View className='value'>
                {!(personInfo && personInfo.weight) && <View className='dot'/>}
                <Text>{personInfo && personInfo.weight ? personInfo.weight : '请填写'}</Text>
              </View>
            </Cell>
            <Cell
              className='cell'
              title='体型自评'
              clickable={user.isChangeable}
              align='center'
              onClick={() => {
                setPopUp({
                  ...popup,
                  title: '修改体型',
                  type: 'picker',
                  pickerType: PICKER_TYPE.PHYSIQUE,
                  open: true,
                  confirm: onConfirmPersonInfo
                })
              }}
            >
              <View className='value'>
                {!(personInfo && personInfo.physique) && <View className='dot'/>}
                <Text>{personInfo && personInfo.physique ? personInfo.physique : '请填写'}</Text>
              </View>
            </Cell>
            <Cell
              className='cell'
              title='生日'
              clickable={user.isChangeable}
              align='center'
              onClick={() => {
                setPopUp({
                  ...popup,
                  title: '修改生日',
                  type: 'picker',
                  pickerType: PICKER_TYPE.BIRTH,
                  open: true,
                  confirm: onConfirmPersonInfo
                })
              }}
            >
              <View className='value'>
                {!(personInfo && personInfo.birth) && <View className='dot'/>}
                <Text>{personInfo && personInfo.birth ? getDateFromStamp(personInfo.birth) : '请选择'}</Text>
              </View>
            </Cell>
            <Cell
              className='cell'
              title='家乡'
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改家乡',
                type: 'picker',
                pickerType: PICKER_TYPE.HOMETOWN,
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className='value'>
                {!(personInfo && personInfo.hometown) && <View className='dot'/>}
                <Text>{personInfo && personInfo.hometown ? personInfo.hometown : '请选择'}</Text>
              </View>
            </Cell>
            <Cell
              className='cell'
              title='手机号'
              clickable={isChangeable}
              align='center'
              onClick={async () => {
                if (isChangeable) {
                  await Taro.showToast({
                    title: "暂不支持修改～",
                    duration: TOAST_SHOW_TIME,
                    icon: 'none'
                  })
                }
              }
              }
            >
              <View className='value'>
                {!(user.phoneNumber) && <View className='dot'/>}
                <Text>{user.phoneNumber}</Text>
              </View>

            </Cell>
            <Cell
              className='cell'
              title='微信'
              clickable={user.isChangeable}
              align='center'
              onClick={() => {
                setPopUp({
                  ...popup,
                  title: '修改微信',
                  type: 'input',
                  inputType: INPUT_TYPE.WECHAT_NUMBER,
                  initialValue: personInfo && personInfo.wechatNumber ? personInfo.wechatNumber : '',
                  open: true,
                  confirm: onConfirmPersonInfo
                })
              }}
            >
              <View className='value'>
                {!(personInfo && personInfo.wechatNumber) && <View className='dot'/>}
                <Text>{personInfo && personInfo.wechatNumber ? personInfo.wechatNumber : '去填写'}</Text>
              </View>
            </Cell>
          </Cell.Group>

          <View className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.status})}>
            <Text className='title'>状态信息</Text>
          </View>
          <Cell.Group>
            {
              user.userType === USER_TYPE.STUDENT ? (
                <>
                  <Cell
                    className='cell'
                    title='在校状态'
                    clickable={user.isChangeable}
                    align='center'
                    onClick={() => setPopUp({
                      ...popup,
                      title: '修改在校状态',
                      type: 'picker',
                      pickerType: PICKER_TYPE.CURRENT_STATUS,
                      open: true,
                      confirm: onConfirmPersonInfo
                    })}
                  >
                    <View className='value'>
                      {!(personInfo && personInfo.currentSchoolStatus) && <View className='dot'/>}
                      <Text>{personInfo && personInfo.currentSchoolStatus ? personInfo.currentSchoolStatus : '请选择'}</Text>
                    </View>
                  </Cell>

                  <Cell
                    className='cell'
                    title='接下来一年的状态'
                    clickable={user.isChangeable}
                    align='center'
                    onClick={() => setPopUp({
                      ...popup,
                      title: '修改一年内状态',
                      type: 'picker',
                      pickerType: PICKER_TYPE.ONE_YEAR_STATUS,
                      open: true,
                      confirm: onConfirmPersonInfo
                    })}
                  >
                    <View className='value'>
                      {!(personInfo && personInfo.oneYearStatus) && <View className='dot'/>}
                      <Text>{personInfo && personInfo.oneYearStatus ? personInfo.oneYearStatus : '请选择'}</Text>
                    </View>
                  </Cell>

                  <Cell
                    className='cell'
                    title='是否今年九月前毕业'
                    clickable={user.isChangeable}
                    align='center'
                    onClick={() => {
                      setPopUp({
                        ...popup,
                        title: '修改是否九月前毕业',
                        type: 'picker',
                        pickerType: PICKER_TYPE.SCHOOL_GRADUATE_IN_SEP,
                        open: true,
                        confirm: onConfirmPersonInfo
                      })
                    }}
                  >
                    <View className='value'>
                      {!(personInfo && personInfo.schoolGraduateInSep) && <View className='dot'/>}
                      <Text>{personInfo && personInfo.schoolGraduateInSep ? personInfo.schoolGraduateInSep : '请选择'}</Text>
                    </View>
                  </Cell>

                  <Cell
                    className={classnames('cell', {'qa-cell': checkMultiChoices(personInfo.futureBase)})}
                    title='未来发展地'
                    clickable={user.isChangeable}
                    align='center'
                    onClick={() => setPopUp({
                      ...popup,
                      title: '修改未来发展地',
                      type: 'check',
                      checkType: CHECK_TYPE.FUTURE_BASE,
                      initialValue: personInfo.futureBase,
                      checkRestrict: -1,
                      open: true,
                      otherEnabled: true,
                      otherValue: personInfo && personInfo.selfFutureBase ? personInfo.selfFutureBase : '',
                      confirm: onConfirmPersonInfo
                    })}
                  >
                    <View className={classnames('value', {'qa-value': checkMultiChoices(personInfo.futureBase)})}>
                      {!(personInfo && checkMultiChoices(personInfo.futureBase)) && <View className='dot'/>}
                      <Text>{personInfo && checkMultiChoices(personInfo.futureBase) ? combineChoices(personInfo.futureBase,false,personInfo.selfFutureBase) : '请选择'}</Text>
                    </View>
                  </Cell>
                </>
              ) : (
                <>
                  <Cell
                    className='cell'
                    title='当前学历'
                    clickable={user.isChangeable}
                    align='center'
                    onClick={() => setPopUp({
                      ...popup,
                      title: '修改学历',
                      type: 'picker',
                      pickerType: PICKER_TYPE.GRADUATE_EDUCATION,
                      open: true,
                      confirm: onConfirmPersonInfo
                    })}
                  >
                    <View className='value'>
                      {!(personInfo && personInfo.graduateEducation) && <View className='dot'/>}
                      <Text>{personInfo && personInfo.graduateEducation ? personInfo.graduateEducation : '请选择'}</Text>
                    </View>
                  </Cell>

                  <Cell
                    className='cell'
                    title='当前工作所在地'
                    clickable={user.isChangeable}
                    align='center'
                    onClick={() => setPopUp({
                      ...popup,
                      title: '修改工作所在地',
                      type: 'picker',
                      pickerType: PICKER_TYPE.GRADUATE_WORK_LOCATION,
                      open: true,
                      confirm: onConfirmPersonInfo
                    })}
                  >
                    <View className='value'>
                      {!(personInfo && personInfo.graduateWorkLocation) && <View className='dot'/>}
                      <Text>{personInfo && personInfo.graduateWorkLocation ? personInfo.graduateWorkLocation : '请选择'}</Text>
                    </View>
                  </Cell>

                  <Cell
                    className='cell'
                    title='具体工作岗位'
                    clickable={user.isChangeable}
                    align='center'
                    onClick={() => setPopUp({
                      ...popup,
                      title: '修改工作岗位',
                      type: 'input',
                      inputType: INPUT_TYPE.GRADUATE_WORK_DETAIL,
                      initialValue: personInfo && personInfo.graduateWorkDetail ? personInfo.graduateWorkDetail : '',
                      open: true,
                      confirm: onConfirmPersonInfo
                    })}
                  >
                    <View className='value'>
                      {!(personInfo && personInfo.graduateWorkDetail) && <View className='dot'/>}
                      <Text>{personInfo && personInfo.graduateWorkDetail ? personInfo.graduateWorkDetail : '请选择'}</Text>
                    </View>
                  </Cell>

                  <Cell
                    className='cell'
                    title='年收入水平'
                    clickable={user.isChangeable}
                    align='center'
                    onClick={() => setPopUp({
                      ...popup,
                      title: '修改年收入',
                      type: 'check',
                      checkType: CHECK_TYPE.GRADUATE_INCOME,
                      initialValue: personInfo.graduateIncome,
                      open: true,
                      checkRestrict: 2,
                      confirm: onConfirmPersonInfo
                    })}
                  >
                    <View
                      className='value'
                    >
                      {personInfo && personInfo.graduateIncome && !checkMultiChoices(personInfo.graduateIncome) &&
                        <View className='dot'/>}
                      <Text>{personInfo && checkMultiChoices(personInfo.graduateIncome) ? combineChoices(personInfo.graduateIncome,true) : '请填写'}</Text>
                    </View>
                  </Cell>
                </>
              )
            }

          </Cell.Group>
          <View className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.major})}>
            <Text className='title'>专业信息</Text>
          </View>
          <Cell.Group>
            {user.userType === USER_TYPE.STUDENT &&
              <>
                <Cell
                  className='cell'
                  title='年级'
                  clickable={user.isChangeable}
                  align='center'
                  onClick={() => {
                    setPopUp({
                      ...popup,
                      title: '修改年级',
                      type: 'picker',
                      pickerType: PICKER_TYPE.CURRENT_SCHOOL_GRADE,
                      open: true,
                      confirm: onConfirmPersonInfo
                    })
                  }}
                >
                  <View className='value'>
                    {!(personInfo && personInfo.currentSchoolGrade) && <View className='dot'/>}
                    <Text>{personInfo && personInfo.currentSchoolGrade ? personInfo.currentSchoolGrade : '请修改'}</Text>
                  </View>
                </Cell>

                <Cell
                  className='cell'
                  title='所在校区'
                  clickable={user.isChangeable}
                  align='center'
                  onClick={() => {
                    setPopUp({
                      ...popup,
                      title: '修改校区',
                      type: 'picker',
                      pickerType: PICKER_TYPE.CURRENT_SCHOOL_CAMPUS,
                      open: true,
                      confirm: onConfirmPersonInfo
                    })
                  }}
                >
                  <View className='value'>
                    {!(personInfo && personInfo.currentSchoolCampus) && <View className='dot'/>}
                    <Text>{personInfo && personInfo.currentSchoolCampus ? personInfo.currentSchoolCampus : '请选择'}</Text>
                  </View>
                </Cell>
              </>
            }

            <Cell
              className='cell'
              title='学院'
              clickable={isChangeable}
              align='center'
              onClick={async () => {
                if (isChangeable) {
                  await Taro.showToast({
                    title: "暂不支持修改～",
                    duration: TOAST_SHOW_TIME,
                    icon: 'none'
                  })
                }
              }
              }
            >
              <View className='value'>
                {!(user.faculty) && <View className='dot'/>}
                <Text>{user.faculty}</Text>
              </View>

            </Cell>

            <Cell
              className={classnames('cell', {'qa-cell': personInfo && checkMultiChoices(personInfo.industry)})}
              title='行业'
              clickable={user.isChangeable}
              align='center'
              onClick={() => {
                setPopUp({
                  ...popup,
                  title: '修改行业',
                  type: 'check',
                  checkType: CHECK_TYPE.INDUSTRY,
                  initialValue: personInfo.industry,
                  open: true,
                  checkRestrict: 3,
                  confirm: onConfirmPersonInfo
                })
              }}
            >
              <View
                className={classnames('value', {'qa-value': personInfo && checkMultiChoices(personInfo.industry)})}
              >
                {personInfo && !checkMultiChoices(personInfo.industry) && <View className='dot'/>}
                <Text>{personInfo && personInfo.industry ? combineChoices(personInfo.industry,true) : '去填写'}</Text>
              </View>
            </Cell>
          </Cell.Group>

          <View
            className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.apperance})}
          >
            <Text className='title'>形象信息</Text>
          </View>
          <Cell.Group>
            <Cell
              className={classnames('cell', {'qa-cell': personInfo && checkMultiChoices(personInfo.temperament)})}
              title='气质外表'
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改气质外表',
                type: 'check',
                checkType: CHECK_TYPE.TEMPER,
                initialValue: personInfo.temperament,
                checkRestrict: 2,
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className={classnames('value', {'qa-value': personInfo && personInfo.temperament})}>
                {!(personInfo && personInfo.temperament && personInfo.temperament.length) && <View className='dot'/>}
                <Text>{personInfo && personInfo.temperament ? combineChoices(personInfo.temperament,true) : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className={classnames('cell', {'cell-split-line': images && images.length > 0})}
              title='照片'
              clickable={user.isChangeable}
              onClick={() => {
                setPopUp({
                  ...popup,
                  title: '修改个人照片',
                  type: 'photo',
                  photoUrls: user.images ? user.images : [],
                  open: true,
                  confirm: onConfirmImages
                })
              }}
            >
              <>
                {images && images.length > 0 && <View className='personal-info-img-box'>
                  {images.map((item) => (
                      item.imageUrl && item.imageUrl != '' &&
                      <View className='personal-img-wrapper'>
                        <Image lazyLoad mode='aspectFill' className='personal-img' src={item.imageUrl}/>
                      </View>
                    )
                  )}
                </View>}
                {personInfo && !checkPhotos(images) &&
                  <View className='value qa-value'>
                    <View className='dot'/>
                    <Text> 请选择</Text>
                  </View>}
              </>
            </Cell>
          </Cell.Group>
          <View className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.habit})}>
            <Text className='title'>生活爱好</Text>
          </View>
          <Cell.Group>
            <Cell
              className={classnames('cell', {'qa-cell': personInfo && checkMultiChoices(personInfo.interest)})}
              title='兴趣爱好'
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改兴趣爱好',
                type: 'check',
                checkType: CHECK_TYPE.INTEREST,
                initialValue:personInfo.interest,
                open: true,
                otherEnabled: true,
                checkRestrict: -1,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className={classnames('value', {'qa-value': personInfo && checkMultiChoices(personInfo.interest)})}>
                {personInfo && !checkMultiChoices(personInfo.interest) && <View className='dot'/>}
                <Text>{personInfo && personInfo.interest ? combineChoices(personInfo.interest,true) : '请选择'}</Text>
              </View>
            </Cell>
            <Cell
              className='cell'
              title='运动频率'
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改运动频率',
                type: 'picker',
                pickerType: PICKER_TYPE.EXERICE_HABIT,
                initialValue: personInfo && personInfo.exerciseFrequency ? personInfo.exerciseFrequency : '',
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className='value'>
                {!(personInfo && personInfo.exerciseFrequency && personInfo.exerciseFrequency) &&
                  <View className='dot'/>}
                <Text>{personInfo && personInfo.exerciseFrequency ? personInfo.exerciseFrequency : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className='cell'
              title='熬夜频率'
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改熬夜频率',
                type: 'picker',
                pickerType: PICKER_TYPE.STAYUP_HABIT,
                initialValue: personInfo && personInfo.stayUpFrequency ? personInfo.stayUpFrequency : '',
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className='value'>
                {!(personInfo && personInfo.stayUpFrequency && personInfo.stayUpFrequency) && <View className='dot'/>}
                <Text>{personInfo && personInfo.stayUpFrequency ? personInfo.stayUpFrequency : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className='cell'
              title='喝酒习惯'
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改喝酒习惯',
                type: 'picker',
                pickerType: PICKER_TYPE.DRINK_HABIT,
                initialValue: personInfo && personInfo.drinkHabit ? personInfo.drinkHabit : '',
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className='value'>
                {!(personInfo && personInfo.drinkHabit && personInfo.drinkHabit) && <View className='dot'/>}
                <Text>{personInfo && personInfo.drinkHabit ? personInfo.drinkHabit : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className='cell'
              title='抽烟习惯'
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改抽烟习惯',
                type: 'picker',
                pickerType: PICKER_TYPE.SMOKING_HABIT,
                initialValue: personInfo && personInfo.smokingHabit ? personInfo.smokingHabit : '',
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className='value'>
                {!(personInfo && personInfo.smokingHabit && personInfo.smokingHabit) && <View className='dot'/>}
                <Text>{personInfo && personInfo.smokingHabit ? personInfo.smokingHabit : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className='cell'
              title='蹦迪习惯'
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改蹦迪习惯',
                type: 'picker',
                pickerType: PICKER_TYPE.DISCO_HABIT,
                initialValue: personInfo && personInfo.discoHabit ? personInfo.discoHabit : '',
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className='value'>
                {!(personInfo && personInfo.discoHabit && personInfo.discoHabit) && <View className='dot'/>}
                <Text>{personInfo && personInfo.discoHabit ? personInfo.discoHabit : '请填写'}</Text>
              </View>
            </Cell>
          </Cell.Group>
          <View className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.love})}>
            <Text className='title'>恋爱相关</Text>
          </View>
          <Cell.Group>
            <Cell
              className='cell'
              title='恋爱经历（次数）'
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改恋爱经历（次数）',
                type: 'picker',
                pickerType: PICKER_TYPE.LOVE_HISTORY_,
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className='value'>
                {!(personInfo && personInfo.loveHistory) && <View className='dot'/>}
                <Text>{personInfo && personInfo.loveHistory ? personInfo.loveHistory : '请填写'}</Text>
              </View>
            </Cell>
            {user.userType === USER_TYPE.STUDENT &&
              <Cell
                className='cell'
                title='月支出水平'
                clickable={user.isChangeable}
                align='center'
                onClick={() => setPopUp({
                  ...popup,
                  title: '修改月支出水平',
                  type: 'check',
                  checkType: CHECK_TYPE.CONSUMPTION,
                  initialValue: personInfo.consumption,
                  open: true,
                  checkRestrict: 2,
                  confirm: onConfirmPersonInfo
                })}
              >
                <View className='value'>
                  {!(personInfo && checkMultiChoices(personInfo.consumption)) && <View className='dot'/>}
                  <Text>{personInfo && checkMultiChoices(personInfo.consumption) ? combineChoices(personInfo.consumption,true) : '请填写'}</Text>
                </View>
              </Cell>
            }
            <Cell
              className='cell'
              title='恋爱支出'
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改恋爱支出',
                type: 'picker',
                pickerType: PICKER_TYPE.CONSUMPTION_SHARE,
                initialValue: personInfo && personInfo.consumptionShare ? personInfo.consumptionShare : '',
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className='value'>
                {!(personInfo && personInfo.consumptionShare) && <View className='dot'/>}
                <Text>{personInfo && personInfo.consumptionShare ? personInfo.consumptionShare : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className='cell'
              title='mbti'
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改mbti',
                type: 'input',
                inputType: INPUT_TYPE.MBTI,
                initialValue: personInfo && personInfo.mbti ? personInfo.mbti : '',
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className='value'>
                {/*{!(personInfo && personInfo.mbti) && <View className='dot'/>}*/}
                <Text>{personInfo && personInfo.mbti ? personInfo.mbti : '请填写'}</Text>
              </View>
            </Cell>
          </Cell.Group>

          <View className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.subject})}>
            <Text className='title'>主观天地</Text>
          </View>

          <Cell.Group>
            <Cell
              className={classnames('cell', {'qa-cell': personInfo && personInfo.superPower})}
              title={SUBJECT_QUESTION.super_power}
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改回答',
                type: 'qa-input',
                inputType: INPUT_TYPE.SUPER_POWER,
                initialValue: personInfo && personInfo.superPower ? personInfo.superPower : '',
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className='value qa-value'>
                {!(personInfo && checkString(personInfo.superPower)) && <View className='dot'/>}
                <Text>{personInfo && personInfo.superPower ? personInfo.superPower : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className={classnames('cell', {'qa-cell': personInfo && personInfo.emo})}
              title={SUBJECT_QUESTION.emo}
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改回答',
                type: 'qa-input',
                inputType: INPUT_TYPE.EMO,
                initialValue: personInfo && personInfo.emo ? personInfo.emo : '',
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className='value qa-value'>
                {!(personInfo && checkString(personInfo.emo)) && <View className='dot'/>}
                <Text>{personInfo && personInfo.emo ? personInfo.emo : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className={classnames('cell', {'qa-cell': personInfo && personInfo.say})}
              title={SUBJECT_QUESTION.say}
              clickable={user.isChangeable}
              align='center'
              onClick={() => setPopUp({
                ...popup,
                title: '修改回答',
                type: 'qa-input',
                inputType: INPUT_TYPE.SAY,
                initialValue: personInfo && personInfo.say ? personInfo.say : '',
                open: true,
                confirm: onConfirmPersonInfo
              })}
            >
              <View className='value qa-value'>
                {!(personInfo && checkString(personInfo.say)) && <View className='dot'/>}
                <Text>{personInfo && personInfo.say ? personInfo.say : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className={classnames('cell', {'qa-cell': personInfo && personInfo.wechatFirstTime})}
              title={SUBJECT_QUESTION.wechatFirstTime.question}
              clickable={user.isChangeable}
              align='center'
              onClick={() => {
                setCheckPopup(
                  {
                    ...checkPopup, open: true, type: CHECK_TYPE.WECHAT_FIRST_TIME,
                    radioData: SUBJECT_QUESTION.wechatFirstTime,
                    radioChecked: personInfo ?personInfo.wechatFirstTime: ''
                  })
              }}
            >
              <View className={classnames('value', {'qa-value': personInfo && personInfo.wechatFirstTime})}>
                {!(personInfo && personInfo.wechatFirstTime) && <View className='dot'/>}
                <Text>{personInfo && personInfo.wechatFirstTime ?splitOthers(personInfo.wechatFirstTime) : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className={classnames('cell', {'qa-cell': personInfo && personInfo.beFriend})}
              title={SUBJECT_QUESTION.beFriend.question}
              clickable={user.isChangeable}
              align='center'
              onClick={() => {
                setCheckPopup(
                  {
                    ...checkPopup, open: true, type: CHECK_TYPE.BE_FRIEND,
                    radioData: SUBJECT_QUESTION.beFriend,
                    radioChecked: personInfo ? personInfo.beFriend : ''
                  })
              }}
            >
              <View className='value qa-value'>
                {!(personInfo && personInfo.beFriend) && <View className='dot'/>}
                <Text>{personInfo && personInfo.beFriend ? splitOthers(personInfo.beFriend) : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className={classnames('cell', {'qa-cell': personInfo && personInfo.showLove})}
              title={SUBJECT_QUESTION.showLove.question}
              clickable={user.isChangeable}
              align='center'
              onClick={() => {
                setCheckPopup(
                  {
                    ...checkPopup, open: true, type: CHECK_TYPE.SHOW_LOVE,
                    radioData: SUBJECT_QUESTION.showLove,
                    radioChecked: personInfo ? personInfo.showLove : ''
                  })
              }}
            >
              <View className='value qa-value'>
                {!(personInfo && personInfo.showLove) && <View className='dot'/>}
                <Text>{personInfo && personInfo.showLove ? splitOthers(personInfo.showLove) : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className={classnames('cell', {'qa-cell': personInfo && personInfo.isLover})}
              title={SUBJECT_QUESTION.isLover.question}
              clickable={user.isChangeable}
              align='center'
              onClick={() => {
                setCheckPopup(
                  {
                    ...checkPopup, open: true, type: CHECK_TYPE.IS_LOVER,
                    radioData: SUBJECT_QUESTION.isLover,
                    radioChecked: personInfo ? personInfo.isLover : ''
                  })
              }}
            >
              <View className='value qa-value'>
                {!(personInfo && personInfo.isLover) && <View className='dot'/>}
                <Text>{personInfo && personInfo.isLover ? splitOthers(personInfo.isLover) : '请填写'}</Text>
              </View>
            </Cell>

            <Cell
              className={classnames('cell', {'qa-cell': personInfo && personInfo.isLoveYou})}
              title={SUBJECT_QUESTION.isLoveYou.question}
              clickable={user.isChangeable}
              align='center'
              onClick={() => {
                setCheckPopup(
                  {
                    ...checkPopup, open: true, type: CHECK_TYPE.IS_LOVE_YOU,
                    radioData: SUBJECT_QUESTION.isLoveYou,
                    radioChecked: personInfo ? personInfo.isLoveYou : ''
                  })
              }}
            >
              <View className='value qa-value'>
                {!(personInfo && personInfo.isLoveYou) && <View className='dot'/>}
                <Text>{personInfo && personInfo.isLoveYou ? splitOthers(personInfo.isLoveYou) : '请填写'}</Text>
              </View>
            </Cell>

          </Cell.Group>

          <PersonalInfoPopUp
            title={popup.title}
            open={popup.open && isChangeable}
            cancel={popup.cancel}
            confirm={popup.confirm}
            type={popup.type}
            photoUrls={popup.photoUrls}
            pickerType={popup.pickerType}
            inputType={popup.inputType}
            checkType={popup.checkType}
            initialValue={popup.initialValue}
            otherValue={popup.otherValue}
            otherEnabled={popup.otherEnabled}
            checkRestrict={popup.checkRestrict}
          />
          <MultiChoice
            open={checkPopup.open && isChangeable}
            type={checkPopup.type}
            radioData={checkPopup.radioData}
            radioChecked={checkPopup.radioChecked}
            selfChoice={checkPopup.selfChoice}
            onCancel={checkPopup.onCancel}
            onConfirm={checkPopup.onConfirm}
          />
        </>}
    </View>
  );
}

export default Index;
