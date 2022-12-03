import {Text, View} from "@tarojs/components";
import "@taroify/core/cell/style"
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchPersonInfo, submitPersonalInfo} from "@/actions/user";
import {Cell} from "@taroify/core";
import Taro, {useReady} from "@tarojs/taro";
import {
  CONSUMPTION_SHARE,
  CURRENT_CAMPUS,
  CURRENT_GRADE,
  CURRENT_STATUS,
  GRADUATE_EDUCATION,
  HABIT_FREQUENCY,
  INPUT_TYPE,
  LOVE_HISTORY,
  ONE_YEAR_STATUS,
  PHYSIQUE,
  PICKER_TYPE,
  SCHOOL_GRADUATE_IN_SEP,
  SUBJECT_QUESTION,
  TOAST_SHOW_TIME,
  USER_TYPE
} from "@/utils/constant";
import {
  checkApperanceInfo,
  checkBasicInfo,
  checkHabitInfo,
  checkLoveInfo,
  checkMajorInfo,
  checkStatusInfo,
  checkSubjectInfo,
} from "@/utils/fcheck"
import classnames from "classnames";
import PickerCell from "@/components/person-info/form-modify/picker-cell";
import InputCell from "@/components/person-info/form-modify/input-cell";
import SingleChoiceCell from "@/components/person-info/form-modify/single-choice-cell";
import MultiChoiceCell from "@/components/person-info/form-modify/multi-choice-cell";
import PhotoCell from "@/components/person-info/form-modify/photo-cell";
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

  useReady(async () => {
    if (user.isChangeable) {await Taro.showToast({title: '点击条目进行修改~', duration: 2000, icon: 'none'})}
  })

  useEffect(() => {
    if(!user.personInfo){
      fetchData()
    }

    if(user.personInfo){
      setPersonInfo(JSON.parse(JSON.stringify(user.personInfo)))
    }},
    [])

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
    console.log('onConfirm',value)
    setPersonInfo({...personInfo, ...value})
    dispatch(submitPersonalInfo({personInfo: {...value}, images: null}))
    // fetchData()
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

  return (
    <View className='container'>
      {personInfo &&
        <>
          <View className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.basic})}>
            <Text className='title'>基本信息</Text>
          </View>
          <Cell.Group>
            <InputCell
              title='真实姓名'
              modifiable={false}
              cellValue={user.realName}
              inputType={INPUT_TYPE.REQUIRED}
              onConfirm={() => {}}
            />

            <InputCell
              title='学号'
              modifiable={false}
              cellValue={user.studentNumber}
              inputType={INPUT_TYPE.STUDENT_NUMBER}
              onConfirm={() => {}}
            />

            <InputCell
              title='身高'
              modifiable
              cellValue={personInfo ? personInfo.height : undefined}
              inputType={INPUT_TYPE.NUMBER}
              rightText='cm'
              onConfirm={(value) => onConfirmPersonInfo({height: value})}
            />

            <InputCell
              title='体重'
              modifiable
              cellValue={personInfo ? personInfo.weight : undefined}
              inputType={INPUT_TYPE.NUMBER}
              rightText='kg'
              onConfirm={(value) => onConfirmPersonInfo({weight: value})}
            />

            <PickerCell
              title='体型'
              modifiable
              cellValue={personInfo ? personInfo.physique : undefined}
              pickerType={PICKER_TYPE.COMMON}
              pickerContent={PHYSIQUE}
              onConfirm={(value) => onConfirmPersonInfo({physique: value})}
            />

            <PickerCell
              title='生日'
              modifiable
              cellValue={personInfo ? personInfo.birth : undefined}
              pickerType={PICKER_TYPE.DATE}
              onConfirm={(value) => onConfirmPersonInfo({birth: value})}
            />

            <PickerCell
              title='家乡'
              modifiable
              cellValue={personInfo ? personInfo.hometown : undefined}
              pickerType={PICKER_TYPE.ADDRESS}
              onConfirm={(value) => onConfirmPersonInfo({hometown: value})}
            />

            <InputCell
              title='手机号'
              modifiable={false}
              cellValue={user.phoneNumber}
              inputType={INPUT_TYPE.PHONE_NUMBER}
              onConfirm={() => {}}
            />

            <InputCell
              title='微信'
              modifiable
              cellValue={personInfo ? personInfo.wechatNumber : undefined}
              inputType={INPUT_TYPE.WECHAT_NUMBER}
              onConfirm={(value) => onConfirmPersonInfo({wechatNumber: value})}
            />

          </Cell.Group>

          <View className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.status})}>
            <Text className='title'>状态信息</Text>
          </View>
          <Cell.Group>
            {
              user.userType === USER_TYPE.STUDENT ? (
                <>
                  <PickerCell
                    title='在校状态'
                    modifiable
                    cellValue={personInfo ? personInfo.currentSchoolStatus : undefined}
                    pickerType={PICKER_TYPE.COMMON}
                    pickerContent={CURRENT_STATUS}
                    onConfirm={(value) => onConfirmPersonInfo({currentSchoolStatus: value})}
                  />

                  <PickerCell
                    title='一年内状态'
                    modifiable
                    cellValue={personInfo ? personInfo.oneYearStatus : undefined}
                    pickerType={PICKER_TYPE.COMMON}
                    pickerContent={ONE_YEAR_STATUS}
                    onConfirm={(value) => onConfirmPersonInfo({oneYearStatus: value})}
                  />

                  <PickerCell
                    title='是否九月前毕业'
                    modifiable
                    cellValue={personInfo ? personInfo.schoolGraduateInSep : undefined}
                    pickerType={PICKER_TYPE.COMMON}
                    pickerContent={SCHOOL_GRADUATE_IN_SEP}
                    onConfirm={(value) => onConfirmPersonInfo({schoolGraduateInSep: value})}
                  />

                  <MultiChoiceCell
                    title='未来发展地'
                    modifiable
                    multiChoices={personInfo?personInfo.futureBase:[]}
                    multiChoiceLimitRestrict={-1}
                    otherType='picker'
                    otherValue={personInfo?personInfo.selfFutureBase:''}
                    onConfirm={
                      (value)=>{
                        if(value.choice) {onConfirmPersonInfo({futureBase:[...value.choice],selfFutureBase:value.other})}
                      }
                    }
                  />
                </>
              ) : (
                <>
                  <PickerCell
                    title='当前学历'
                    modifiable
                    cellValue={personInfo ? personInfo.graduateEducation : undefined}
                    pickerType={PICKER_TYPE.COMMON}
                    pickerContent={GRADUATE_EDUCATION}
                    onConfirm={(value) => onConfirmPersonInfo({graduateEducation: value})}
                  />

                  <PickerCell
                    title='当前工作所在地'
                    modifiable
                    cellValue={personInfo ? personInfo.graduateWorkLocation : undefined}
                    pickerType={PICKER_TYPE.ADDRESS}
                    onConfirm={(value) => onConfirmPersonInfo({graduateWorkLocation: value})}
                  />

                  <InputCell
                    title='具体工作岗位'
                    modifiable
                    cellValue={personInfo ? personInfo.graduateWorkDetail : undefined}
                    inputType={INPUT_TYPE.REQUIRED}
                    onConfirm={(value) => onConfirmPersonInfo({graduateWorkDetail: value})}
                  />

                  <MultiChoiceCell
                    title='年收入'
                    modifiable
                    multiChoices={personInfo?personInfo.graduateIncome:[]}
                    multiChoiceLimitRestrict={2}
                    otherType='none'
                    onConfirm={
                      (value)=>{
                        if(value.choice) {
                          onConfirmPersonInfo({graduateIncome:[...value.choice]})
                        }
                      }
                    }
                  />
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
                <PickerCell
                  title='年级'
                  modifiable
                  cellValue={personInfo ? personInfo.currentSchoolGrade : undefined}
                  pickerType={PICKER_TYPE.COMMON}
                  pickerContent={CURRENT_GRADE}
                  onConfirm={(value) => onConfirmPersonInfo({currentSchoolGrade: value})}
                />

                <PickerCell
                  title='所在校区'
                  modifiable
                  cellValue={personInfo ? personInfo.currentSchoolCampus : undefined}
                  pickerType={PICKER_TYPE.COMMON}
                  pickerContent={CURRENT_CAMPUS}
                  onConfirm={(value) => onConfirmPersonInfo({currentSchoolCampus: value})}
                />
              </>
            }

            <PickerCell
              title='学院'
              modifiable={false}
              cellValue={user.faculty}
              pickerType={PICKER_TYPE.COMMON}
              pickerContent={[]}
              onConfirm={() => {}}
            />

            <MultiChoiceCell
              title='行业'
              modifiable
              multiChoices={personInfo?personInfo.industry:[]}
              multiChoiceLimitRestrict={3}
              otherType='none'
              onConfirm={
                (value)=>{
                  if(value.choice) {
                    onConfirmPersonInfo({industry:[...value.choice]})
                  }
                }
              }
            />
          </Cell.Group>

          <View
            className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.apperance})}
          >
            <Text className='title'>形象信息</Text>
          </View>
          <Cell.Group>

            <MultiChoiceCell
              title='气质外表'
              modifiable
              multiChoices={personInfo?personInfo.temperament:[]}
              multiChoiceLimitRestrict={2}
              otherType='none'
              onConfirm={
                (value)=>{
                  if(value.choice) {
                    onConfirmPersonInfo({temperament:[...value.choice]})
                  }
                }
              }
            />

            <PhotoCell
              title='照片'
              photoUrls={user.images}
              onConfirm={(value)=>onConfirmImages(value)}
            />
          </Cell.Group>
          <View className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.habit})}>
            <Text className='title'>生活爱好</Text>
          </View>
          <Cell.Group>
            <MultiChoiceCell
              title='兴趣爱好'
              modifiable
              multiChoices={personInfo?personInfo.interest:[]}
              multiChoiceLimitRestrict={-1}
              otherType='input'
              onConfirm={
                (value)=>{
                  if(value.choice) {
                    onConfirmPersonInfo({interest:[...value.choice]})
                  }
                }
              }
            />

            <PickerCell
              title='运动习惯'
              modifiable
              cellValue={personInfo ? personInfo.exerciseFrequency : undefined}
              pickerType={PICKER_TYPE.COMMON}
              pickerContent={HABIT_FREQUENCY}
              onConfirm={(value) => onConfirmPersonInfo({exerciseFrequency: value})}
            />

            <PickerCell
              title='熬夜习惯'
              modifiable
              cellValue={personInfo ? personInfo.stayUpFrequency : undefined}
              pickerType={PICKER_TYPE.COMMON}
              pickerContent={HABIT_FREQUENCY}
              onConfirm={(value) => onConfirmPersonInfo({stayUpFrequency: value})}
            />

            <PickerCell
              title='喝酒习惯'
              modifiable
              cellValue={personInfo ? personInfo.drinkHabit : undefined}
              pickerType={PICKER_TYPE.COMMON}
              pickerContent={HABIT_FREQUENCY}
              onConfirm={(value) => onConfirmPersonInfo({drinkHabit: value})}
            />

            <PickerCell
              title='抽烟习惯'
              modifiable
              cellValue={personInfo ? personInfo.smokingHabit : undefined}
              pickerType={PICKER_TYPE.COMMON}
              pickerContent={HABIT_FREQUENCY}
              onConfirm={(value) => onConfirmPersonInfo({smokingHabit: value})}
            />

            <PickerCell
              title='蹦迪习惯'
              modifiable
              cellValue={personInfo ? personInfo.discoHabit : undefined}
              pickerType={PICKER_TYPE.COMMON}
              pickerContent={HABIT_FREQUENCY}
              onConfirm={(value) => onConfirmPersonInfo({discoHabit: value})}
            />
          </Cell.Group>
          <View className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.love})}>
            <Text className='title'>恋爱相关</Text>
          </View>
          <Cell.Group>
            <PickerCell
              title='恋爱经历（次数）'
              modifiable
              cellValue={personInfo ? personInfo.loveHistory : undefined}
              pickerType={PICKER_TYPE.COMMON}
              pickerContent={LOVE_HISTORY}
              onConfirm={(value) => onConfirmPersonInfo({loveHistory: value})}
            />

            {user.userType === USER_TYPE.STUDENT &&
              <MultiChoiceCell
                title='月支出'
                modifiable
                multiChoices={personInfo?personInfo.consumption:[]}
                multiChoiceLimitRestrict={2}
                otherType='none'
                onConfirm={
                  (value)=>{
                    if(value.choice) {
                      onConfirmPersonInfo({consumption:[...value.choice]})
                    }
                  }
                }
              />
            }

            <PickerCell
              title='恋爱支出'
              modifiable
              cellValue={personInfo ? personInfo.consumptionShare : undefined}
              pickerType={PICKER_TYPE.COMMON}
              pickerContent={CONSUMPTION_SHARE}
              onConfirm={(value) => onConfirmPersonInfo({consumptionShare: value})}
            />

            <InputCell
              title='mbti'
              modifiable
              cellValue={personInfo ? personInfo.mbti : undefined}
              inputType={INPUT_TYPE.NOT_REQUIRED}
              onConfirm={(value) => onConfirmPersonInfo({mbti: value})}
            />
          </Cell.Group>

          <View className={classnames('personal-info-divider', {'personal-info-divider-highlight': highlight.subject})}>
            <Text className='title'>主观天地</Text>
          </View>

          <Cell.Group>
            <InputCell
              title={SUBJECT_QUESTION.super_power}
              modifiable
              cellValue={personInfo ? personInfo.superPower : undefined}
              inputType={INPUT_TYPE.LONG_INPUT}
              onConfirm={(value) => onConfirmPersonInfo({superPower: value})}
            />

            <InputCell
              title={SUBJECT_QUESTION.emo}
              modifiable
              cellValue={personInfo ? personInfo.emo : undefined}
              inputType={INPUT_TYPE.LONG_INPUT}
              onConfirm={(value) => onConfirmPersonInfo({emo: value})}
            />

            <InputCell
              title={SUBJECT_QUESTION.say}
              modifiable
              cellValue={personInfo ? personInfo.say : undefined}
              inputType={INPUT_TYPE.LONG_INPUT}
              onConfirm={(value) => onConfirmPersonInfo({say: value})}
            />

            <SingleChoiceCell
              title={SUBJECT_QUESTION.wechatFirstTime.question}
              singleChoice={SUBJECT_QUESTION.wechatFirstTime}
              selectedChoice={personInfo ?personInfo.wechatFirstTime :undefined}
              onConfirm={(value) => onConfirmPersonInfo({wechatFirstTime: value})}
            />

            <SingleChoiceCell
              title={SUBJECT_QUESTION.beFriend.question}
              singleChoice={SUBJECT_QUESTION.beFriend}
              selectedChoice={personInfo ?personInfo.beFriend :undefined}
              onConfirm={(value) => onConfirmPersonInfo({beFriend: value})}
            />

            <SingleChoiceCell
              title={SUBJECT_QUESTION.showLove.question}
              singleChoice={SUBJECT_QUESTION.showLove}
              selectedChoice={personInfo ?personInfo.showLove :undefined}
              onConfirm={(value) => onConfirmPersonInfo({showLove: value})}
            />

            <SingleChoiceCell
              title={SUBJECT_QUESTION.isLover.question}
              singleChoice={SUBJECT_QUESTION.isLover}
              selectedChoice={personInfo ?personInfo.isLover :undefined}
              onConfirm={(value) => onConfirmPersonInfo({isLover: value})}
            />

            <SingleChoiceCell
              title={SUBJECT_QUESTION.isLoveYou.question}
              singleChoice={SUBJECT_QUESTION.isLoveYou}
              selectedChoice={personInfo ?personInfo.isLoveYou :undefined}
              onConfirm={(value) => onConfirmPersonInfo({isLoveYou: value})}
            />

          </Cell.Group>

        </>}
    </View>
  )
}

export default Index;
