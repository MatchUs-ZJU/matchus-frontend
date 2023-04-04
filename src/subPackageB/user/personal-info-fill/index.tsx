import {Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";
import { Form, Image} from "@taroify/core";
import {useEffect, useState} from "react";
import classnames from "classnames";
import {PersonalInfoSplit, PersonalInfoTipsIcon} from '@/assets/images'
import {
  AddressData,
  CONSUMPTION_SHARE, CURRENT_CAMPUS, CURRENT_GRADE, CURRENT_STATUS,
  GENDER, GRADUATE_EDUCATION,
  HABIT_FREQUENCY,
  LOVE_HISTORY, ONE_YEAR_STATUS, PHYSIQUE,
  SCHOOL_GRADUATE_IN_SEP,
  SUBJECT_QUESTION,
  TOAST_SHOW_TIME,
  USER_TYPE,
  WARNING_NOTE
} from "@/utils/constant";

import {
  checkPhotos,
  checkRequired
} from "@/utils/fcheck"
import {IPersonInfo} from "@/typings/types";
import {floatRegTest, wechatNumberRegTest} from "@/utils/reg";
import {fetchPersonInfo, submitPersonalInfo} from "@/actions/user";
import PhotoBox from "@/components/person-info/photo-box";
import {getDateFromStamp} from "@/utils/ftime";
import InputItem from "@/components/person-info/form-fill/input-item";
import PickerItem from "@/components/person-info/form-fill/picker-item";
import MultiChoiceItem from "@/components/person-info/form-fill/multi-choice-item";
import SingleChoiceItem from "@/components/person-info/form-fill/single-choice-item";
import './index.scss'

const Index = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state)

  const [images, setImages] = useState(user.images ? user.images : [])
  const [personForm, setPersonForm] = useState<IPersonInfo>(user.personInfo!)
  const [canSubmit, setCanSubmit] = useState(false)

  const fetchData = () => {
    // dispatch(fetchFaculties())
    dispatch(fetchPersonInfo())
  }

  useEffect(  ()=>{
    if(!user.personInfo){
      fetchData()
    }
  },[])

  useEffect(() => {
    setImages(user.images ? user.images : [])
  }, [user.images])

  useEffect(() => {
    setCanSubmit(checkSubmit())
  }, [personForm])

  useEffect(() => {
    setCanSubmit(checkSubmit())
  }, [images])

  const [showRequired, setShowRequired] = useState(false)

  function checkSubmit() {
    if (!checkRequired(personForm, images, user.userType)) {
      return false
    } else if (floatRegTest(personForm.height) && floatRegTest(personForm.weight) && wechatNumberRegTest(personForm.wechatNumber)) {
      return true
    } else {
      return false
    }
  }

  async function onSubmit() {
    if (checkSubmit()) {
      dispatch(submitPersonalInfo({
        personInfo: personForm,
        images: {realName: user.realName, studentNumber: user.studentNumber, images: images}
      }))
    } else {
      setShowRequired(true)
      await Taro.showToast({
        title: "个人信息未填写完整～",
        duration: TOAST_SHOW_TIME,
        icon: 'none'
      })
    }
  }

  function onSave() {
    setShowRequired(false)
    dispatch(submitPersonalInfo({
      personInfo: {...personForm,height:parseInt(personForm.height)},
      images: {realName: user.realName, studentNumber: user.studentNumber, images: images}
    }))
  }

  return (
    <View className='container'>
      {personForm && <View className='wrapper'>
        <View className='tips'>
          <Image src={PersonalInfoTipsIcon} className='icon'/>
          <Text className='text'>个人信息将用于匹配，请如实填写</Text>
        </View>
        <View className='body'>
          <Form onSubmit={onSubmit} className='form'>
            <View className='title-bar'>
              <Text className='title-text'>基本信息</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            <InputItem label='真实姓名' readonly value={user.realName} placeholder='请输入真实姓名' inputType='string' showMsg={showRequired} onChange={()=>{}}/>
            <InputItem label='学号' readonly value={user.studentNumber} placeholder='请输入学号' inputType='string' showMsg={showRequired} onChange={()=>{}}/>

            <View className='composed-item'>
              <InputItem lowerBound={120} higherBound={220} label='身高' readonly={false} value={personForm.height} placeholder='cm' inputType='number' showMsg={showRequired} onChange={(value)=> {
                  setPersonForm({...personForm, height: value})
              }}
              />
              <InputItem label='体重' readonly={false} value={personForm.weight} placeholder='kg' inputType='number' showMsg={showRequired} onChange={(value)=>setPersonForm({...personForm,weight:value})}/>
            </View>

            <PickerItem
              type='common'
              label='体型'
              readonly={false}
              placeholder='请选择体型'
              showValue={personForm.physique}
              showMsg={showRequired}

              value={PHYSIQUE}
              onConfirm={(value)=>{setPersonForm({...personForm,physique:value})}}
            />

            <PickerItem
              type='date'
              label='生日'
              readonly={false}
              placeholder='请选择生日'
              showValue={getDateFromStamp(personForm.birth)}
              showMsg={showRequired}
              onConfirm={(value)=>{setPersonForm({...personForm,birth:value})}}
            />

            <PickerItem
              type='address'
              label='家乡'
              readonly={false}
              placeholder='请选择家乡'
              showValue={personForm?personForm.hometown:''}
              showMsg={showRequired}
              onConfirm={(value)=>{setPersonForm({...personForm,hometown:value})}}
            />

            <InputItem label='微信' readonly={false} value={personForm.wechatNumber} placeholder='请填写微信号' inputType='wechatnumber' showMsg={showRequired} onChange={(value)=>setPersonForm({...personForm,wechatNumber:value})}/>
            <InputItem label='手机号' readonly value={user.phoneNumber} placeholder='请输入手机号' inputType='string' showMsg={showRequired} onChange={()=>{}}/>

            <View className='title-bar'>
              <Text className='title-text'>当前状态</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            {user.userType === USER_TYPE.STUDENT ? (
              <>
                <PickerItem
                  type='common'
                  label='在校状态'
                  readonly={false}
                  placeholder='请选择在校状态'
                  showValue={personForm?personForm.currentSchoolStatus:''}
                  showMsg={showRequired}

                  value={CURRENT_STATUS}
                  onConfirm={(value)=>{setPersonForm({...personForm,currentSchoolStatus:value})}}
                />

                <PickerItem
                  type='common'
                  label='一年内状态'
                  readonly={false}
                  placeholder='请选择一年内状态'
                  showValue={personForm?personForm.oneYearStatus:''}
                  showMsg={showRequired}

                  value={ONE_YEAR_STATUS}
                  onConfirm={(value)=>{setPersonForm({...personForm,oneYearStatus:value})}}
                />

                <PickerItem
                  type='common'
                  label='是否九月毕业'
                  readonly={false}
                  placeholder='请选择'
                  showValue={personForm?personForm.schoolGraduateInSep:''}
                  showMsg={showRequired}

                  value={SCHOOL_GRADUATE_IN_SEP}
                  onConfirm={(value)=>{setPersonForm({...personForm,schoolGraduateInSep:value})}}
                />

                <MultiChoiceItem
                  label='未来发展地'
                  placeholder='选择未来发展地'
                  showMsg={showRequired}
                  value={personForm?personForm.futureBase:[]}
                  otherType='picker'
                  otherValue={personForm.selfFutureBase}
                  appendValue={AddressData}
                  onChange={(value)=>{setPersonForm({...personForm,futureBase:value.choice,selfFutureBase:value.other})}}
                  restrict={-1}
                />
              </>
            ) : (
              <>
                <PickerItem
                  type='common'
                  label='学历情况'
                  readonly={false}
                  placeholder='请选择当前学历'
                  value={GRADUATE_EDUCATION}
                  showValue={personForm?personForm.graduateEducation:''}
                  showMsg={showRequired}
                  onConfirm={(value)=>{setPersonForm({...personForm,graduateEducation:value})}}
                />

                <PickerItem
                  type='address'
                  label='工作所在地'
                  readonly={false}
                  placeholder='请选择工作所在地'
                  showValue={personForm?personForm.graduateWorkLocation:''}
                  showMsg={showRequired}
                  onConfirm={(value)=>{setPersonForm({...personForm,graduateWorkLocation:value})}}
                />

                <InputItem
                  label='具体工作岗位'
                  value={personForm.graduateWorkDetail}
                  placeholder='请填写具体工作岗位'
                  inputType='string'
                  showMsg={showRequired}
                  onChange={(value)=>setPersonForm({...personForm,graduateWorkDetail:value})}
                  readonly={false}
                />
              </>
            )}

            <View className='title-bar'>
              <Text className='title-text'>专业信息</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            {user.userType === USER_TYPE.STUDENT ? (
              <>
                <PickerItem
                  type='common'
                  label='年级'
                  readonly={false}
                  placeholder='请选择年级'
                  value={CURRENT_GRADE}
                  showValue={personForm?personForm.currentSchoolGrade:''}
                  showMsg={showRequired}
                  onConfirm={(value)=>{setPersonForm({...personForm,currentSchoolGrade:value})}}
                />

                <PickerItem
                  type='common'
                  label='校区'
                  readonly={false}
                  placeholder='请选择校区'
                  value={CURRENT_CAMPUS}
                  showValue={personForm?personForm.currentSchoolCampus:''}
                  showMsg={showRequired}
                  onConfirm={(value)=>{setPersonForm({...personForm,currentSchoolCampus:value})}}
                />
              </>
            ) : (
              <></>
            )}

            <PickerItem
              type='common'
              label='学院'
              readonly
              placeholder='请选择'
              value={[]}
              showValue={user.faculty}
              showMsg={showRequired}
              onConfirm={()=>{}}
            />

            <MultiChoiceItem
              label='行业选择'
              placeholder='选择行业'
              showMsg={showRequired}
              value={personForm?personForm.industry:[]}
              onChange={(value)=>{setPersonForm({...personForm,industry:value.choice})}}
              restrict={3}
            />

            <View className='title-bar'>
              <Text className='title-text'>我的照片</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            <MultiChoiceItem
              label={`气质外表（${user.gender === GENDER.MALE ? '男' : '女'}）`}
              placeholder='请选择气质外表（可多选）'
              showMsg={showRequired}
              value={personForm?personForm.temperament:[]}
              onChange={(value)=>{setPersonForm({...personForm,temperament:value.choice})}}
              restrict={2}
            />

            <Text className='disp'>照片</Text>
            <PhotoBox images={user.images ? user.images : []} onChange={setImages}/>
            {showRequired && !checkPhotos(images) &&
              <View className='warning-note'>{WARNING_NOTE.REQUIRED}</View>}

            <View className='title-bar'>
              <Text className='title-text'>生活爱好</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            <MultiChoiceItem
              label='兴趣爱好'
              placeholder='选择兴趣爱好'
              showMsg={showRequired}
              value={personForm?personForm.interest:[]}
              otherType='input'
              onChange={(value)=>{setPersonForm({...personForm,interest:value.choice})}}
              restrict={-1}
            />

            <PickerItem
              type='common'
              label='运动习惯'
              readonly={false}
              placeholder='请选择'
              value={HABIT_FREQUENCY}
              showValue={personForm?personForm.exerciseFrequency:''}
              showMsg={showRequired}
              onConfirm={(value)=>{setPersonForm({...personForm,exerciseFrequency:value})}}
            />

            <PickerItem
              type='common'
              label='熬夜习惯'
              readonly={false}
              placeholder='请选择'
              value={HABIT_FREQUENCY}
              showValue={personForm?personForm.stayUpFrequency:''}
              showMsg={showRequired}
              onConfirm={(value)=>{setPersonForm({...personForm,stayUpFrequency:value})}}
            />

            <PickerItem
              type='common'
              label='饮酒习惯'
              readonly={false}
              placeholder='请选择'
              value={HABIT_FREQUENCY}
              showValue={personForm?personForm.drinkHabit:''}
              showMsg={showRequired}
              onConfirm={(value)=>{setPersonForm({...personForm,drinkHabit:value})}}
            />

            <PickerItem
              type='common'
              label='抽烟习惯'
              readonly={false}
              placeholder='请选择'
              value={HABIT_FREQUENCY}
              showValue={personForm?personForm.smokingHabit:''}
              showMsg={showRequired}
              onConfirm={(value)=>{setPersonForm({...personForm,smokingHabit:value})}}
            />

            <PickerItem
              type='common'
              label='蹦迪习惯'
              readonly={false}
              placeholder='请选择'
              value={HABIT_FREQUENCY}
              showValue={personForm?personForm.discoHabit:''}
              showMsg={showRequired}
              onConfirm={(value)=>{setPersonForm({...personForm,discoHabit:value})}}
            />

            <View className='title-bar'>
              <Text className='title-text'>恋爱相关</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            <PickerItem
              type='common'
              label='恋爱经历（次数）'
              readonly={false}
              placeholder='请选择'
              value={LOVE_HISTORY}
              showValue={personForm?personForm.loveHistory:''}
              showMsg={showRequired}
              onConfirm={(value)=>{setPersonForm({...personForm,loveHistory:value})}}
            />

            {user.userType === USER_TYPE.STUDENT ? (
              <>

                <MultiChoiceItem
                  label='月开支'
                  placeholder='请选择月开支（可多选）'
                  showMsg={showRequired}
                  value={personForm?personForm.consumption:[]}
                  otherType='none'
                  onChange={(value)=>{setPersonForm({...personForm,consumption:value.choice})}}
                  restrict={2}
                />
              </>
            ) : (
              <>
                <MultiChoiceItem
                  label='年收入'
                  placeholder='请选择年收入(可多选)'
                  showMsg={showRequired}
                  value={personForm?personForm.graduateIncome:[]}
                  otherType='none'
                  onChange={(value)=>{setPersonForm({...personForm,graduateIncome:value.choice})}}
                  restrict={-1}
                />
              </>
            )}

            <PickerItem
              type='common'
              label='恋爱支出'
              readonly={false}
              placeholder='请选择'
              value={CONSUMPTION_SHARE}
              showValue={personForm?personForm.consumptionShare:''}
              showMsg={showRequired}
              onConfirm={(value)=>{setPersonForm({...personForm,consumptionShare:value})}}
            />
            <InputItem
              label='MBTI'
              readonly={false}
              value={personForm?personForm.mbti:''}
              placeholder='请输入(可不填)'
              inputType='string'
              omissible
              showMsg={showRequired}
              onChange={(value)=>setPersonForm({...personForm,mbti:value})}
            />

            <View className='title-bar'>
              <Text className='title-text'>主观天地</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            <InputItem
              label={SUBJECT_QUESTION.super_power}
              value={personForm?personForm.superPower:''}
              placeholder='请输入回答'
              inputType='long-input'
              showMsg={showRequired}
              onChange={(value)=>setPersonForm({...personForm,superPower:value})}
              readonly={false}
            />

            <InputItem
              label={SUBJECT_QUESTION.emo}
              value={personForm?personForm.emo:''}
              placeholder='请输入回答'
              inputType='long-input'
              showMsg={showRequired}
              onChange={(value)=>setPersonForm({...personForm,emo:value})}
              readonly={false}
            />

            <InputItem
              label={SUBJECT_QUESTION.say}
              value={personForm?personForm.say:''}
              placeholder='请输入回答'
              inputType='long-input'
              showMsg={showRequired}
              onChange={(value)=>setPersonForm({...personForm,say:value})}
              readonly={false}
            />

            <SingleChoiceItem
              singleChoice={SUBJECT_QUESTION.wechatFirstTime}
              selectedChoice={personForm?personForm.wechatFirstTime:''}
              showMsg={showRequired}
              onChange={(value) => {
                setPersonForm({...personForm, wechatFirstTime: value})
              }}
            />

            <SingleChoiceItem
              singleChoice={SUBJECT_QUESTION.beFriend}
              selectedChoice={personForm?personForm.beFriend:''}
              showMsg={showRequired}
              onChange={(value) => {
                setPersonForm({...personForm, beFriend: value})
              }}
            />

            <SingleChoiceItem
              singleChoice={SUBJECT_QUESTION.showLove}
              selectedChoice={personForm?personForm.showLove:''}
              showMsg={showRequired}
              onChange={(value) => {
                setPersonForm({...personForm, showLove: value})
              }}
            />

            <SingleChoiceItem
              singleChoice={SUBJECT_QUESTION.isLover}
              selectedChoice={personForm?personForm.isLover:''}
              showMsg={showRequired}
              onChange={(value) => {
                setPersonForm({...personForm, isLover: value})
              }}
            />

            <SingleChoiceItem
              singleChoice={SUBJECT_QUESTION.isLoveYou}
              selectedChoice={personForm?personForm.isLoveYou:''}
              showMsg={showRequired}
              onChange={(value) => {
                setPersonForm({...personForm, isLoveYou: value})
              }}
            />
          </Form>
        </View>
        <View className='row btn-container'>
          <View className='btn-save' onClick={onSave}>
            <Text>保存</Text>
          </View>

          <View className={classnames('btn-confirm', {'btn-confirm-disable': !canSubmit})} onClick={onSubmit}>
            <Text>提交</Text>
          </View>
        </View>
      </View>}
    </View>
  )
}

export default Index;
