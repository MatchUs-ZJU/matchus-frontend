import {Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";
import {Field, Form, Image, Input, Radio, Textarea} from "@taroify/core";
import {useEffect, useState} from "react";
import {ArrowDown} from "@taroify/icons";
import classnames from "classnames";
import {fetchFaculties} from "@/actions";
import {PersonalInfoSplit, PersonalInfoTipsIcon, PersonInfoUnchosenPrimary} from '@/assets/images'

import {
  CHECK_TYPE,
  CONSUMPTION,
  FUTURE_BASE,
  GENDER,
  GRADUATE_INCOME,
  INDUSTRY,
  INTEREST,
  PICKER_TYPE,
  SUBJECT_QUESTION,
  TEMPERAMENT,
  TOAST_SHOW_TIME,
  USER_TYPE,
  WARNING_MSG,
  WARNING_NOTE
} from "@/utils/constant";

import {
  checkMultiChoices,
  checkMultiChoicesWithOther,
  checkPhotos,
  checkRadio,
  checkRequired,
  checkString,
  combineOthers,
  completeChoices,
  isOthers,
  splitOthers
} from "@/utils/fcheck"
import PersonalInfoCard from "@/components/personal-info-card";
import {IPersonInfo} from "@/typings/types";
import {floatRegTest, wechatNumberRegTest} from "@/utils/reg";
import {fetchPersonInfo, submitPersonalInfo} from "@/actions/user";
import PhotoBox from "@/components/person-info/photo-box";
import {getDateFromStamp} from "@/utils/ftime";
import './index.scss'

const Index = () => {
  const dispatch = useDispatch()
  const {user, resource} = useSelector(state => state)
  // const {sessionKey} = user
  // const {faculties} = resource

  const [images, setImages] = useState(user.images ? user.images : [])
  const [personForm, setPersonForm] = useState<IPersonInfo>(user.personInfo!)
  const [canSubmit, setCanSubmit] = useState(false)
  const fetchData = () => {
    dispatch(fetchFaculties())
    dispatch(fetchPersonInfo())
  }

  useEffect(() => {
    setPersonForm(user.personInfo!)
  }, [user.personInfo])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setImages(user.images ? user.images : [])
  }, [user.images])

  useEffect(() => {
    setCanSubmit(checkSubmit())
  }, [personForm])

  useEffect(() => {
    setCanSubmit(checkPhotos(images))
  }, [images])

  const [birthPickerOpen, setBirthPickerOpen] = useState(false)
  const [hometownOpen, setHometowmOpen] = useState(false)
  const [physiqueOpen, setPhysiqueOpen] = useState(false)

  const [currentStatusOpen, setCurrentStatusOpen] = useState(false)
  const [oneYearStatusOpen, setOneYearStatusOpen] = useState(false)
  const [schoolGraduateInSepOpen, setScholGraduateInSepOpen] = useState(false)
  const [graduateEducationOpen, setGraduateEducationOpen] = useState(false)
  const [graduateWorkLocationOpen, setGraduateWorkLocationOpen] = useState(false)

  const [currentSchoolGradeOpen, setCurrentSchoolGradeOpen] = useState(false)
  const [currentSchoolCampusOpen, setCurrentSchoolCampusOpen] = useState(false)
  // const [facultyOpen,setFacultyOpen] = useState(false)
  const [industryOpen, setIndustryOpen] = useState(false)
  const [futureBaseOpen, setFutureBaseOpen] = useState(false)
  const [interestOpen, setInterestOpen] = useState(false)

  const [temperamentOpen, setTemperamentOpen] = useState(false)

  const [exerciseFrequencyOpen, setExerciseFrequencyOpen] = useState(false)
  const [stayUpFrequencyOpen, setStayUpFrequencyOpen] = useState(false)
  const [drinkHabitOpen, setDrinkHabitOpen] = useState(false)
  const [smokingHabitOpen, setSmokingHabitOpen] = useState(false)
  const [discoHabitOpen, setDiscoHabitOpen] = useState(false)

  const [takeDesireOpen, setTakeDesireOpen] = useState(false)
  const [loveHistoryOpen, setLoveHistoryOpen] = useState(false)
  const [consumtionOpen, setConsumptionOpen] = useState(false)
  const [graduateIncomeOpen, setGraduateIncomeOpen] = useState(false)
  const [consumptionShareOpen, setConsumptionShareOpen] = useState(false)

  const [showRequired, setShowRequired] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  function onConfirmItem(value) {
    setPersonForm({...personForm, ...value})
  }

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
      fetchData()
      await Taro.redirectTo({
        url: '/pages/activity/index/index'
      })
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
      personInfo: personForm,
      images: {realName: user.realName, studentNumber: user.studentNumber, images: images}
    }))
    fetchData()
  }

  // @ts-ignore
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
            <View className='item'>
              <Text className='label'>真实姓名</Text>
              <Field className='field'>
                <Input
                  placeholder='请输入您的姓名'
                  value={user.realName}
                  readonly
                  // onChange={(e) =>
                  //   setPersonForm({...personForm, realName: e.detail.value})}
                />
              </Field>
            </View>
            <View className='item'>
              <Text className='label'>学号</Text>
              <Field className='field'>
                <Input
                  placeholder='请输入学号' value={user.studentNumber}
                  readonly
                  // onChange={(e) => {
                  //   setPersonForm({
                  //     ...personForm,
                  //     studentNumber: e.detail.value,
                  //   })
                  // }}
                />
              </Field>
            </View>
            <View className='composed-item'>
              <View className='item'>
                <Text className='label'>身高</Text>
                <Field className='field'>
                  <Input
                    type='number'
                    placeholder='cm' value={personForm.height}
                    onChange={(e) => {
                      setPersonForm({
                        ...personForm,
                        height: e.detail.value,
                      })
                    }}
                  />
                </Field>
                {personForm.height && personForm.height != '' && (!floatRegTest(personForm.height)) &&
                  <View className='field-note'>{WARNING_MSG[WARNING_NOTE.INVALID_NUMBER]}</View>}
                {showRequired && (!personForm.height || personForm.height === '') &&
                  <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
              </View>

              <View/>
              <View className='item'>
                <Text className='label'>体重</Text>
                <Field className='field'>
                  <Input
                    placeholder='kg' value={personForm.weight}
                    onChange={(e) => {
                      setPersonForm({
                        ...personForm,
                        weight: e.detail.value,
                      })
                    }}
                  />
                </Field>
                {personForm.weight && personForm.weight != '' && (!floatRegTest(personForm.weight)) &&
                  <View className='field-note'>{WARNING_MSG[WARNING_NOTE.INVALID_NUMBER]}</View>}
                {showRequired && (!personForm.weight || personForm.weight === '') &&
                  <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
              </View>
            </View>

            <View className='item item-folder'>
              <Text className='label'>体型</Text>
              <Field className='field' rightIcon={<ArrowDown onClick={() => setPhysiqueOpen(!physiqueOpen)}/>}>
                <Input readonly placeholder='请选择体型' value={personForm.physique ? personForm.physique : ''}/>
              </Field>
              {showRequired && (!personForm.physique || personForm.physique === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
            {physiqueOpen &&
              <PersonalInfoCard
                up={false}
                type='picker'
                pickerType={PICKER_TYPE.PHYSIQUE}
                cancel={() => {
                  setPhysiqueOpen(false)
                }}
                confirm={onConfirmItem}
              />
            }

            <View className='item item-fold'>
              <Text className='label'>生日</Text>
              <Field className='field' rightIcon={<ArrowDown/>}
                onClick={() => setBirthPickerOpen(true)}
              >
                <Input readonly placeholder='请选择出生日期' value={getDateFromStamp(personForm.birth)}/>
              </Field>
              {showRequired && (!personForm.birth || personForm.birth === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
            {birthPickerOpen &&
              <PersonalInfoCard
                up={false}
                type='picker'
                pickerType={PICKER_TYPE.BIRTH}
                checkType={CHECK_TYPE.INTEREST}
                cancel={() => {
                  setBirthPickerOpen(false)
                }}
                confirm={onConfirmItem}
              />
            }

            <View className='item item-fold'>
              <Text className='label'>家乡</Text>
              <Field className='field' rightIcon={<ArrowDown onClick={() => setHometowmOpen(!hometownOpen)}/>}>
                <Input readonly placeholder='请选择家乡'
                  value={personForm.hometown ? personForm.hometown : ''}
                />
              </Field>
              {showRequired && (!personForm || !checkString(personForm.hometown)) &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
            {hometownOpen &&
              <PersonalInfoCard
                up={false}
                type='picker'
                pickerType={PICKER_TYPE.HOMETOWN}
                cancel={() => {
                  setHometowmOpen(false)
                }}
                confirm={onConfirmItem}
              />
            }

            <View className='item'>
              <Text className='label'>微信</Text>
              <Field className='field'>
                <Input
                  placeholder='请填写微信号' value={personForm.wechatNumber}
                  onChange={(e) => {
                    setPersonForm({
                      ...personForm,
                      wechatNumber: e.detail.value,
                    })
                  }}
                />
              </Field>
              {personForm.wechatNumber && personForm.wechatNumber != '' && (!wechatNumberRegTest(personForm.wechatNumber)) &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.INVALID_WECAHT]}</View>}
              {showRequired && (!personForm.wechatNumber || personForm.wechatNumber === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>

            <View className='item'>
              <Text className='label'>手机号</Text>
              <Field className='field'>
                <Input
                  readonly
                  placeholder='请填写手机号' value={user.phoneNumber}
                  // onChange={(e) => {
                  //   setPersonForm({
                  //     ...personForm,
                  //     phoneNumber: e.detail.value,
                  //   })
                  // }}
                />
                {/*{personForm.phoneNumber != '' && (!phoneNumberRegTest(personForm.phoneNumber)) &&*/}
                {/*  <View className='field-note'>*请填写正确手机号</View>}*/}
              </Field>
            </View>

            <View className='title-bar'>
              <Text className='title-text'>当前状态</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            {user.userType === USER_TYPE.ENROLLED ? (
              <>
                <View className='item item-fold'>
                  <Text className='label'>在校状态</Text>
                  <Field
                    className='field'
                    rightIcon={<ArrowDown/>}
                    onClick={() => setCurrentStatusOpen(!currentStatusOpen)}
                  >
                    <Input
                      readonly
                      placeholder='请选择在校状态'
                      value={personForm.currentSchoolStatus ? personForm.currentSchoolStatus : ''}
                    />
                  </Field>
                  {showRequired && (!personForm || !checkString(personForm.currentSchoolStatus)) &&
                    <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
                </View>
                {currentStatusOpen && <PersonalInfoCard
                  up={false}
                  type='picker'
                  pickerType={PICKER_TYPE.CURRENT_STATUS}
                  cancel={() => {
                    setCurrentStatusOpen(false)
                  }}
                  confirm={onConfirmItem}
                />}

                <View className='item item-fold'>
                  <Text className='label'>1年内状态</Text>
                  <Field
                    className='field'
                    rightIcon={<ArrowDown/>}
                    onClick={() => setOneYearStatusOpen(!oneYearStatusOpen)}
                  >
                    <Input
                      readonly
                      placeholder='请选择1年内状态' value={personForm.oneYearStatus ? personForm.oneYearStatus : ''}
                    />
                  </Field>
                  {showRequired && (!personForm.oneYearStatus || personForm.oneYearStatus === '') &&
                    <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
                </View>
                {oneYearStatusOpen &&
                  <PersonalInfoCard
                    up={false}
                    type='picker'
                    pickerType={PICKER_TYPE.ONE_YEAR_STATUS}
                    cancel={() => {
                      setOneYearStatusOpen(false)
                    }}
                    confirm={onConfirmItem}
                  />
                }

                <View className='item item-fold'>
                  <Text className='label'>是否九月毕业</Text>
                  <Field
                    className='field'
                    rightIcon={<ArrowDown/>}
                    onClick={() => setScholGraduateInSepOpen(!schoolGraduateInSepOpen)}
                  >
                    <Input
                      readonly
                      placeholder='请选择'
                      value={personForm && personForm.schoolGraduateInSep ? personForm.schoolGraduateInSep : ''}
                    />
                  </Field>
                  {showRequired && (!personForm.schoolGraduateInSep || personForm.schoolGraduateInSep === '') &&
                    <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
                </View>
                {schoolGraduateInSepOpen &&
                  <PersonalInfoCard
                    up={false}
                    type='picker'
                    pickerType={PICKER_TYPE.SCHOOL_GRADUATE_IN_SEP}
                    cancel={() => {
                      setScholGraduateInSepOpen(false)
                    }}
                    confirm={onConfirmItem}
                  />
                }

                <View className='item'>
                  <Text className='label'>未来发展地</Text>
                  <Field
                    className='field'
                    rightIcon={<ArrowDown
                      onClick={() => setFutureBaseOpen(!futureBaseOpen)}
                    />}

                  >
                    {(!personForm.futureBase || personForm.futureBase.filter((item) => item.selected).length === 0) &&
                      <Input
                        readonly
                        placeholder='请选择未来发展地'
                        value=''
                      />
                    }
                    <View className='tag-array'>
                      {personForm.futureBase && personForm.futureBase.map((item) => (
                          item.selected &&
                          <View className='tag'>
                            <Text
                              className='tag-text'
                            >
                              {item.label === '其他' ? combineOthers(personForm.selfFutureBase) : item.label}
                            </Text>
                            <Image src={PersonInfoUnchosenPrimary} className='tag-delete'
                              onClick={() => {
                                     if (item.label === '其他' && item.selected) {
                                       setPersonForm({...personForm, selfFutureBase: ''})
                                     }
                                     const obj = personForm.futureBase.map(
                                       (cur) => {
                                         if (cur.label === item.label) {
                                           cur.selected = !cur.selected

                                         }
                                         return cur
                                       })
                                     setPersonForm({...personForm, futureBase: [...obj]})
                                   }}
                            />
                          </View>
                        )
                      )}
                    </View>
                  </Field>
                  {showRequired && (!personForm.futureBase || !checkMultiChoicesWithOther(personForm.futureBase, personForm.selfFutureBase)) &&
                    <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED_OTHER]}</View>}
                </View>
                {futureBaseOpen &&
                  <PersonalInfoCard
                    up={false}
                    type='check'
                    checkType={CHECK_TYPE.FUTURE_BASE}
                    initialValue={completeChoices(personForm.futureBase, FUTURE_BASE)}
                    otherValue={splitOthers(personForm.selfFutureBase)}
                    otherEnable
                    cancel={() => {
                      setFutureBaseOpen(false)
                    }}
                    confirm={onConfirmItem}
                  />
                }
              </>
            ) : (
              <>
                <View className='item item-fold'>
                  <Text className='label'>学历情况</Text>
                  <Field className='field'
                    rightIcon={<ArrowDown onClick={() => setGraduateEducationOpen(!graduateEducationOpen)}/>}
                  >
                    <Input
                      placeholder='请选择当前学历' value={personForm.graduateEducation ? personForm.graduateEducation : ''}
                      readonly
                    />
                  </Field>
                  {showRequired && (!personForm.graduateEducation || personForm.graduateEducation !== '') &&
                    <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
                </View>
                {graduateEducationOpen &&
                  <PersonalInfoCard
                    up={false}
                    type='picker'
                    pickerType={PICKER_TYPE.GRADUATE_EDUCATION}
                    checkType={CHECK_TYPE.INTEREST}
                    cancel={() => {
                      setGraduateEducationOpen(false)
                    }}
                    confirm={onConfirmItem}
                  />
                }

                <View className='item item-fold'>
                  <Text className='label'>工作所在地</Text>
                  <Field className='field'
                    rightIcon={<ArrowDown onClick={() => setGraduateWorkLocationOpen(!graduateEducationOpen)}/>}
                  >
                    <Input
                      placeholder='请选择当前所在地'
                      value={personForm.graduateWorkLocation ? personForm.graduateWorkLocation : ''}
                      readonly
                    />
                  </Field>
                  {showRequired && (!personForm || !checkString(personForm.graduateWorkLocation)) &&
                    <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
                </View>
                {graduateWorkLocationOpen &&
                  <PersonalInfoCard
                    up={false}
                    type='picker'
                    pickerType={PICKER_TYPE.GRADUATE_WORK_LOCATION}
                    cancel={() => {
                      setGraduateWorkLocationOpen(false)
                    }}
                    confirm={onConfirmItem}
                  />
                }

                <View className='item'>
                  <Text className='label'>具体工作岗位</Text>
                  <Field className='field'>
                    <Input
                      placeholder='请填写具体工作岗位'
                      value={personForm.graduateWorkDetail ? personForm.graduateWorkDetail : ''}
                      onChange={(e) => {
                        setPersonForm({
                          ...personForm,
                          graduateWorkDetail: e.detail.value,
                        })
                      }}
                    />
                  </Field>
                  {showRequired && (!personForm.graduateWorkDetail || personForm.graduateWorkDetail !== '') &&
                    <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
                </View>
              </>
            )}

            <View className='title-bar'>
              <Text className='title-text'>专业信息</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            {user.userType === USER_TYPE.ENROLLED ? (
              <>
                <View className='item'>
                  <Text className='label'>年级</Text>
                  <Field className='field'
                    rightIcon={<ArrowDown onClick={() => setCurrentSchoolGradeOpen(!currentSchoolGradeOpen)}/>}
                  >
                    <Input
                      placeholder='请选择年级'
                      value={personForm.currentSchoolGrade ? personForm.currentSchoolGrade : ''}
                      readonly
                    />
                  </Field>
                  {showRequired && (!personForm || !checkString(personForm.currentSchoolGrade)) &&
                    <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
                </View>
                {currentSchoolGradeOpen &&
                  <PersonalInfoCard
                    up={false}
                    type='picker'
                    pickerType={PICKER_TYPE.CURRENT_SCHOOL_GRADE}
                    cancel={() => {
                      setCurrentSchoolGradeOpen(false)
                    }}
                    confirm={onConfirmItem}
                  />
                }

                <View className='item'>
                  <Text className='label'>校区</Text>
                  <Field className='field'
                    rightIcon={<ArrowDown
                      onClick={() => setCurrentSchoolCampusOpen(!currentSchoolCampusOpen)}
                    />}
                  >
                    <Input
                      placeholder='请选择常驻校区'
                      value={personForm.currentSchoolCampus ? personForm.currentSchoolCampus : ''}
                      readonly
                    />
                  </Field>
                  {showRequired && (!personForm || !checkString(personForm.currentSchoolCampus)) &&
                    <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
                </View>
                {currentSchoolCampusOpen &&
                  <PersonalInfoCard
                    up={false}
                    type='picker'
                    pickerType={PICKER_TYPE.CURRENT_SCHOOL_CAMPUS}
                    cancel={() => {
                      setCurrentSchoolCampusOpen(false)
                    }}
                    confirm={onConfirmItem}
                  />
                }
              </>
            ) : (
              <></>
            )}

            <View className='item'>
              <Text className='label'>学院</Text>
              <Field className='field'>
                {/*rightIcon={<ArrowDown onClick={() => setFacultyOpen(!facultyOpen)}/>}*/}
                <Input
                  placeholder='请选择学院'
                  value={user.faculty ? user.faculty : ''}
                  readonly
                />
              </Field>
              {/*{showRequired && (!personForm.currentSchoolCampus || personForm.currentSchoolCampus !== '') && <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}*/}
            </View>

            <View className='item'>
              <Text className='label'>行业选择</Text>
              <Field className='field'
                rightIcon={<ArrowDown onClick={() => setIndustryOpen(!industryOpen)}/>}
              >
                {(!personForm.industry || personForm.industry.filter((item) => item.selected).length === 0) &&
                  <Input
                    readonly
                    placeholder='请选择行业(可多选)'
                  />
                }
                <View className='tag-array'>
                  {personForm.industry && personForm.industry.map((item) => (
                      item.selected &&
                      <View className='tag'>
                        <Text className='tag-text'>{item.label}</Text>
                        <Image src={PersonInfoUnchosenPrimary} className='tag-delete'
                          onClick={() => {
                                 const obj = personForm.industry.map(
                                   (cur) => {
                                     if (cur.label === item.label) {
                                       cur.selected = !cur.selected
                                     }
                                     return cur
                                   })!
                                 setPersonForm({...personForm, industry: [...obj]})
                               }}
                        />
                      </View>
                    )
                  )}
                </View>
              </Field>
              {showRequired && (!personForm.industry || !checkMultiChoices(personForm.industry)) &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
            {industryOpen &&
              <PersonalInfoCard
                up={false}
                type='check'
                checkType={CHECK_TYPE.INDUSTRY}
                cancel={() => {
                  setIndustryOpen(false)
                }}
                initialValue={completeChoices(personForm.industry, INDUSTRY)}
                confirm={onConfirmItem}
              />
            }

            <View className='title-bar'>
              <Text className='title-text'>我的照片</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            <View className='item'>
              <Text className='label'>气质外表（{user.gender === GENDER.MALE ? '男' : '女'}）</Text>
              <Field
                className='field'
                rightIcon={<ArrowDown onClick={() => setTemperamentOpen(!temperamentOpen)}/>}
              >
                {(!personForm.temperament || personForm.temperament.filter((item) => item.selected).length === 0) &&
                  <Input
                    readonly
                    placeholder='请选择描述(可多选)'
                  />
                }
                <View className='tag-array'>
                  {personForm.temperament && personForm.temperament.map((item) => (
                      item.selected &&
                      <View className='tag'>
                        <Text className='tag-text'>{item.label}</Text>
                        <Image src={PersonInfoUnchosenPrimary} className='tag-delete'
                          onClick={() => {
                                 const obj = personForm.temperament.map(
                                   (cur) => {
                                     if (cur.label === item.label) {
                                       cur.selected = !cur.selected
                                     }
                                     return cur
                                   })!
                                 setPersonForm({...personForm, temperament: [...obj]})
                               }}
                        />
                      </View>
                    )
                  )}
                </View>
              </Field>
              {showRequired && (!personForm.interest || !checkMultiChoices(personForm.interest)) &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
            {temperamentOpen && <PersonalInfoCard
              up={false}
              type='check'
              checkType={CHECK_TYPE.TEMPER}
              cancel={() => {
                setTemperamentOpen(false)
              }}
              initialValue={completeChoices(personForm.temperament, user.gender === GENDER.MALE ? TEMPERAMENT.male : TEMPERAMENT.female)}
              confirm={onConfirmItem}
            />}

            <Text className='disp'>照片</Text>
            <PhotoBox images={user.images ? user.images : []} onChange={setImages}/>
            {showRequired && !checkPhotos(images) &&
              <View className='warning-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            <View className='title-bar'>
              <Text className='title-text'>生活爱好</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            <View className='item'>
              <Text className='label'>兴趣爱好</Text>
              <Field
                className='field'
                rightIcon={
                  <ArrowDown
                    onClick={() => setInterestOpen(!interestOpen)}
                  />}
              >
                {(!personForm.interest || personForm.interest.filter((item) => item.selected).length === 0) &&
                  <Input
                    readonly
                    placeholder='请选择兴趣爱好(可多选)'
                  />
                }
                <View className='tag-array'>
                  {personForm.interest && personForm.interest.map((item) => (
                      item.selected &&
                      <View className='tag'>
                        <Text
                          className='tag-text'
                        >
                          {item.label === '其他' ? combineOthers(personForm.selfInterest) : item.label}
                        </Text>
                        <Image src={PersonInfoUnchosenPrimary} className='tag-delete'
                          onClick={() => {
                                 if (item.selected && item.label === '其他') {
                                   setPersonForm({...personForm, selfInterest: ''})
                                 }
                                 const obj = personForm.interest.map(
                                   (cur) => {
                                     if (cur.label === item.label) {
                                       cur.selected = !cur.selected
                                     }
                                     return cur
                                   })!
                                 setPersonForm({...personForm, interest: [...obj]})
                               }}
                        />
                      </View>
                    )
                  )}
                </View>
              </Field>
              {showRequired && !checkMultiChoicesWithOther(personForm.interest, personForm.selfInterest) &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED_OTHER]}</View>}
            </View>
            {interestOpen && <PersonalInfoCard
              up={false}
              otherEnable
              type='check'
              checkType={CHECK_TYPE.INTEREST}
              initialValue={completeChoices(personForm.interest, INTEREST)}
              cancel={() => {
                setInterestOpen(false)
              }}
              confirm={onConfirmItem}
            />}

            <View className='item'>
              <Text className='label'>运动频率</Text>
              <Field
                className='field'
                rightIcon={<ArrowDown onClick={() => setExerciseFrequencyOpen(!exerciseFrequencyOpen)}/>}
              >
                <Input
                  readonly
                  value={personForm.exerciseFrequency ? personForm.exerciseFrequency : ''}
                  placeholder='请选择'
                />
              </Field>
              {showRequired && (!personForm.exerciseFrequency || personForm.exerciseFrequency === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
            {exerciseFrequencyOpen && <PersonalInfoCard
              up={false}
              type='picker'
              pickerType={PICKER_TYPE.EXERICE_HABIT}
              cancel={() => {
                setExerciseFrequencyOpen(false)
              }}
              confirm={onConfirmItem}
            />}

            <View className='item'>
              <Text className='label'>熬夜频率</Text>
              <Field
                className='field'
                rightIcon={<ArrowDown onClick={() => setStayUpFrequencyOpen(!stayUpFrequencyOpen)}/>}
              >
                <Input
                  readonly
                  value={personForm.stayUpFrequency ? personForm.stayUpFrequency : ''}
                  placeholder='请选择'
                />
              </Field>
              {showRequired && (!personForm.stayUpFrequency || personForm.stayUpFrequency === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
            {stayUpFrequencyOpen && <PersonalInfoCard
              up={false}
              type='picker'
              pickerType={PICKER_TYPE.STAYUP_HABIT}
              cancel={() => {
                setStayUpFrequencyOpen(false)
              }}
              confirm={onConfirmItem}
            />}

            <View className='item'>
              <Text className='label'>饮酒习惯</Text>
              <Field
                className='field'
                rightIcon={<ArrowDown onClick={() => setDrinkHabitOpen(!drinkHabitOpen)}/>}
              >
                <Input
                  readonly
                  value={personForm.drinkHabit ? personForm.drinkHabit : ''}
                  placeholder='请选择'
                />
              </Field>
              {showRequired && (!personForm.drinkHabit || personForm.drinkHabit === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
            {drinkHabitOpen && <PersonalInfoCard
              up={false}
              type='picker'
              pickerType={PICKER_TYPE.DRINK_HABIT}
              cancel={() => {
                setDrinkHabitOpen(false)
              }}
              confirm={onConfirmItem}
            />}

            <View className='item'>
              <Text className='label'>抽烟习惯</Text>
              <Field
                className='field'
                rightIcon={<ArrowDown onClick={() => setSmokingHabitOpen(!smokingHabitOpen)}/>}
              >
                <Input
                  readonly
                  value={personForm.smokingHabit ? personForm.smokingHabit : ''}
                  placeholder='请选择'
                />
              </Field>
              {showRequired && (!personForm.smokingHabit || personForm.smokingHabit === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
            {smokingHabitOpen && <PersonalInfoCard
              up={false}
              type='picker'
              pickerType={PICKER_TYPE.SMOKING_HABIT}
              cancel={() => {
                setSmokingHabitOpen(false)
              }}
              confirm={onConfirmItem}
            />}

            <View className='item'>
              <Text className='label'>蹦迪习惯</Text>
              <Field
                className='field'
                rightIcon={<ArrowDown onClick={() => setDiscoHabitOpen(!discoHabitOpen)}/>}
              >
                <Input
                  readonly
                  value={personForm.discoHabit ? personForm.discoHabit : ''}
                  placeholder='请选择'
                />
              </Field>
              {showRequired && (!personForm.discoHabit || personForm.discoHabit === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
            {discoHabitOpen && <PersonalInfoCard
              up={false}
              type='picker'
              pickerType={PICKER_TYPE.DISCO_HABIT}
              cancel={() => {
                setDiscoHabitOpen(false)
              }}
              confirm={onConfirmItem}
            />}

            <View className='title-bar'>
              <Text className='title-text'>恋爱相关</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            {takeDesireOpen && <PersonalInfoCard
              up={false}
              type='picker'
              pickerType={PICKER_TYPE.TAKE_DESIRE}
              cancel={() => {
                setTakeDesireOpen(false)
              }}
              confirm={onConfirmItem}
            />}

            <View className='item'>
              <Text className='label'>恋爱经历（次数）</Text>
              <Field
                className='field'
                rightIcon={<ArrowDown onClick={() => setLoveHistoryOpen(!loveHistoryOpen)}/>}
              >
                <Input
                  readonly
                  placeholder='请选择恋爱次数'
                  value={personForm && personForm.loveHistory ? personForm.loveHistory : ''}
                />
              </Field>
              {showRequired && (!personForm.loveHistory || personForm.loveHistory === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
            {loveHistoryOpen && <PersonalInfoCard
              up={false}
              type='picker'
              pickerType={PICKER_TYPE.LOVE_HISTORY_}
              cancel={() => {
                setLoveHistoryOpen(false)
              }}
              confirm={onConfirmItem}
            />}

            {user.userType === USER_TYPE.ENROLLED ? (
              <>
                <View className='item'>
                  <Text className='label'>月开支</Text>
                  <Field
                    className='field'
                    rightIcon={<ArrowDown onClick={() => setConsumptionOpen(!consumtionOpen)}/>}
                  >
                    {(!personForm.consumption || personForm.consumption.filter((item) => item.selected).length === 0) &&
                      <Input
                        readonly
                        placeholder='请选择月开支(可多选)'
                      />
                    }
                    <View className='tag-array'>
                      {personForm.consumption && personForm.consumption.map((item) => (
                          item.selected &&
                          <View className='tag'>
                            <Text className='tag-text'>{item.label}</Text>
                            <Image src={PersonInfoUnchosenPrimary} className='tag-delete'
                              onClick={() => {
                                     const obj = personForm.consumption.map(
                                       (cur) => {
                                         if (cur.label === item.label) {
                                           cur.selected = !cur.selected
                                         }
                                         return cur
                                       })!
                                     setPersonForm({...personForm, consumption: [...obj]})
                                   }}
                            />
                          </View>
                        )
                      )}
                    </View>
                  </Field>
                  {showRequired && (!personForm.consumption || !checkMultiChoices(personForm.consumption)) &&
                    <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
                </View>
                {consumtionOpen && <PersonalInfoCard
                  up={false}
                  type='check'
                  checkType={CHECK_TYPE.CONSUMPTION}
                  initialValue={completeChoices(personForm.consumption, CONSUMPTION)}
                  cancel={() => {
                    setConsumptionOpen(false)
                  }}
                  confirm={onConfirmItem}
                />}
              </>
            ) : (
              <>
                <View className='item'>
                  <Text className='label'>年收入</Text>
                  <Field
                    className='field'
                    rightIcon={<ArrowDown onClick={() => setGraduateIncomeOpen(!graduateIncomeOpen)}/>}
                  >
                    {(!personForm.graduateIncome || personForm.graduateIncome.filter((item) => item.selected).length === 0) &&
                      <Input
                        readonly
                        placeholder='请选择年收入(可多选)'
                      />
                    }
                    <View className='tag-array'>
                      {personForm.graduateIncome && personForm.graduateIncome.map((item) => (
                          item.selected &&
                          <View className='tag'>
                            <Text className='tag-text'>{item.label}</Text>
                            <Image src={PersonInfoUnchosenPrimary} className='tag-delete'
                              onClick={() => {
                                     const obj = personForm.consumption.map(
                                       (cur) => {
                                         if (cur.label === item.label) {
                                           cur.selected = !cur.selected
                                         }
                                         return cur
                                       })!
                                     setPersonForm({...personForm, consumption: [...obj]})
                                   }}
                            />
                          </View>
                        )
                      )}
                    </View>
                  </Field>
                  {showRequired && (!personForm.graduateIncome || checkMultiChoices(personForm.graduateIncome)) &&
                    <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
                </View>
                {graduateIncomeOpen && <PersonalInfoCard
                  up={false}
                  type='check'
                  checkType={CHECK_TYPE.GRADUATE_INCOME}
                  initialValue={completeChoices(personForm.graduateIncome, GRADUATE_INCOME)}
                  cancel={() => {
                    setGraduateIncomeOpen(false)
                  }}
                  confirm={onConfirmItem}
                />}
              </>
            )}

            <View className='item'>
              <Text className='label'>恋爱支出</Text>
              <Field
                className='field'
                rightIcon={<ArrowDown onClick={() => setConsumptionShareOpen(!consumptionShareOpen)}/>}
              >
                <Input
                  readonly
                  placeholder='请选择'
                  value={personForm && personForm.consumptionShare ? personForm.consumptionShare : ''}
                />
              </Field>
              {showRequired && (!personForm.consumptionShare || personForm.consumptionShare === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
            {consumptionShareOpen && <PersonalInfoCard
              up={false}
              type='picker'
              pickerType={PICKER_TYPE.CONSUMPTION_SHARE}
              cancel={() => {
                setConsumptionShareOpen(false)
              }}
              confirm={onConfirmItem}
            />}

            <View className='item'>
              <Text className='label'>MBTI</Text>
              <Field className='field'>
                <Input
                  placeholder='请输入(可不填)' value={personForm.mbti ? personForm.mbti : ''}
                  onChange={(e) => {
                    setPersonForm({
                      ...personForm,
                      mbti: e.detail.value,
                    })
                  }}
                />
              </Field>
            </View>

            <View className='title-bar'>
              <Text className='title-text'>主观天地</Text>
              <Image src={PersonalInfoSplit} className='title-split'/>
            </View>

            <View className='item item-subject'>
              <Text className='question'>{SUBJECT_QUESTION.super_power}</Text>
              <Field className='field'>
                <Textarea
                  placeholder='请输入'
                  limit={100}
                  value={personForm.superPower ? personForm.superPower : ''}
                  onChange={(e) => {
                    setPersonForm({
                      ...personForm,
                      superPower: e.detail.value,
                    })
                  }}
                />
              </Field>
              {showRequired && (!personForm.superPower || personForm.superPower === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>

            <View className='item item-subject'>
              <Text className='question'>{SUBJECT_QUESTION.emo}</Text>
              <Field className='field'>
                <Textarea
                  placeholder='请输入'
                  limit={100}
                  value={personForm.emo ? personForm.emo : ''}
                  onChange={(e) => {
                    setPersonForm({
                      ...personForm,
                      emo: e.detail.value,
                    })
                  }}
                />
              </Field>
              {showRequired && (!personForm.emo || personForm.emo === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>

            <View className='item item-subject'>
              <Text className='question'>{SUBJECT_QUESTION.say}</Text>
              <Field className='field'>
                <Textarea
                  placeholder='请输入'
                  limit={100}
                  value={personForm.say ? personForm.say : ''}
                  onChange={(e) => {
                    setPersonForm({
                      ...personForm,
                      say: e.detail.value,
                    })
                  }}
                />
              </Field>
              {showRequired && (!personForm.say || personForm.say === '') &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>

            <View className='item item-subject'>
              <Text className='question'>{SUBJECT_QUESTION.wechatFirstTime.question}</Text>
              <Radio.Group
                size={20}
                className='radio-wrapper'
                direction='vertical'
                onChange={(value) => {

                  setPersonForm({...personForm, wechatFirstTime: value})
                }}
                defaultValue={personForm.wechatFirstTime ? SUBJECT_QUESTION.wechatFirstTime.choices.filter((item) => personForm.wechatFirstTime === item).length === 0 ? '其他' : personForm.wechatFirstTime : ''}
              >
                {
                  SUBJECT_QUESTION.wechatFirstTime.choices.map((item) => (
                    <>
                      <Radio name={item}>{item}</Radio>
                    </>
                  ))
                }
              </Radio.Group>
              {isOthers(personForm.wechatFirstTime) &&
                <Field className='field'>
                  <Input
                    placeholder='请输入'
                    maxlength={30}
                    value={splitOthers(personForm.wechatFirstTime)}
                    onChange={(e) => {
                      setPersonForm({
                        ...personForm,
                        wechatFirstTime: combineOthers(e.detail.value),
                      })
                    }}
                  />
                </Field>
              }
              {showRequired && !checkRadio(personForm.wechatFirstTime) &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>

            <View className='item item-subject'>
              <Text className='question'>{SUBJECT_QUESTION.beFriend.question}</Text>
              <Radio.Group
                size={20}
                className='radio-wrapper'
                direction='vertical'
                onChange={(value) => {
                  setPersonForm({...personForm, beFriend: value})
                }}
                defaultValue={personForm.beFriend ? SUBJECT_QUESTION.beFriend.choices.filter((item) => personForm.beFriend === item).length === 0 ? '其他' : personForm.beFriend : ''}
              >
                {
                  SUBJECT_QUESTION.beFriend.choices.map((item) => (
                    <>
                      <Radio name={item}>{item}</Radio>
                    </>
                  ))

                }
              </Radio.Group>
              {isOthers(personForm.beFriend) &&
                <Field className='field'>
                  <Input
                    placeholder='请输入'
                    maxlength={30}
                    value={splitOthers(personForm.beFriend)}
                    onChange={(e) => {
                      setPersonForm({
                        ...personForm,
                        beFriend: combineOthers(e.detail.value),
                      })
                    }}
                  />
                </Field>}
              {showRequired && !checkRadio(personForm.beFriend) &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>

            <View className='item item-subject'>
              <Text className='question'>{SUBJECT_QUESTION.showLove.question}</Text>
              <Radio.Group
                size={20}
                className='radio-wrapper'
                direction='vertical'
                onChange={(value) => {
                  setPersonForm({...personForm, showLove: value})
                }}
                defaultValue={personForm.showLove ? SUBJECT_QUESTION.showLove.choices.filter((item) => personForm.showLove === item).length === 0 ? '其他' : personForm.showLove : ''}
              >
                {
                  SUBJECT_QUESTION.showLove.choices.map((item) => (
                    <>
                      <Radio name={item}>{item}</Radio>
                    </>
                  ))

                }
              </Radio.Group>
              {isOthers(personForm.showLove) &&
                <Field className='field'>
                  <Input
                    placeholder='请输入'
                    maxlength={30}
                    value={splitOthers(personForm.showLove)}
                    onChange={(e) => {
                      setPersonForm({
                        ...personForm,
                        showLove: combineOthers(e.detail.value),
                      })
                    }}
                  />
                </Field>}
              {showRequired && !checkRadio(personForm.showLove) &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>

            <View className='item item-subject'>
              <Text className='question'>{SUBJECT_QUESTION.isLover.question}</Text>
              <Radio.Group
                size={20}
                className='radio-wrapper'
                direction='vertical'
                onChange={(value) => {
                  setPersonForm({...personForm, isLover: value})
                }}
                defaultValue={personForm.isLover ? SUBJECT_QUESTION.isLover.choices.filter((item) => personForm.isLover === item).length === 0 ? '其他' : personForm.isLover : ''}
              >
                {
                  SUBJECT_QUESTION.isLover.choices.map((item) => (
                    <>
                      <Radio name={item}>{item}</Radio>
                    </>
                  ))

                }
              </Radio.Group>
              {isOthers(personForm.isLover) &&
                <Field className='field'>
                  <Input
                    placeholder='请输入'
                    maxlength={30}
                    value={splitOthers(personForm.isLover)}
                    onChange={(e) => {
                      setPersonForm({
                        ...personForm,
                        isLover: combineOthers(e.detail.value),
                      })
                    }}
                  />
                </Field>}
              {showRequired && !checkRadio(personForm.isLover) &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>

            <View className='item item-subject'>
              <Text className='question'>{SUBJECT_QUESTION.isLoveYou.question}</Text>
              <Radio.Group
                size={20}
                className='radio-wrapper'
                direction='vertical'
                onChange={(value) => {
                  setPersonForm({...personForm, isLoveYou: value})
                }}
                defaultValue={personForm.isLoveYou ? SUBJECT_QUESTION.isLoveYou.choices.filter((item) => personForm.isLoveYou === item).length === 0 ? '其他' : personForm.isLoveYou : ''}
              >
                {
                  SUBJECT_QUESTION.isLoveYou.choices.map((item) => (
                    <>
                      <Radio name={item}>{item}</Radio>
                    </>
                  ))

                }
              </Radio.Group>
              {isOthers(personForm.isLoveYou) &&
                <Field className='field'>
                  <Input
                    placeholder='请输入'
                    maxlength={30}
                    value={splitOthers(personForm.isLoveYou)}
                    onChange={(e) => {
                      setPersonForm({
                        ...personForm,
                        isLoveYou: combineOthers(e.detail.value),
                      })
                    }}
                  />
                </Field>}
              {showRequired && !checkRadio(personForm.isLoveYou) &&
                <View className='field-note'>{WARNING_MSG[WARNING_NOTE.REQUIRED]}</View>}
            </View>
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
