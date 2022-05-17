import {Button, Text, View} from "@tarojs/components";
import {useDispatch, useSelector} from "react-redux";
import {Dialog, Field, Form, Image, Input, Picker, Popup, Uploader} from "@taroify/core";
import {AnonymousImage, UploadIcon} from "@/assets/images";
import {useEffect, useState} from "react";
import {ArrowDown} from "@taroify/icons";
import Taro from "@tarojs/taro";
import {fetchFaculties} from "@/actions";
import {fetchPhoneNumber, submitIdentificationInfo} from "@/actions/user";
import {getFormatGender, getFormatUserType} from "@/utils/fstring";
import {studentNumberRegTest} from "@/utils/reg";
import classnames from "classnames";

import './index.scss'

interface PickerState {
  open: boolean,
  type: 'gender' | 'faculty' | 'userType'
}

const Index = () => {
  const dispatch = useDispatch()
  const {user, resource} = useSelector(state => state)
  const {nickName, avatarUrl, phoneNumber, countryCode, purePhoneNumber, sessionKey} = user
  const {faculties} = resource

  const [picker, setPicker] = useState<PickerState>({
    open: false,
    type: 'gender'
  })
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const [form, setForm] = useState({
    realName: '',
    initStudentNumber: '',
    studentNumber: '',
    school: '浙江大学',
    gender: 0,
    faculty: '',
    facultyId: '',
    phoneNumber: '',
    userType: 0,
    imageFile: {
      url: '',
    }
  })
  const [sameStudentNumber, setSameStudentNumber] = useState(false)
  const [canRegister, setCanRegister] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // 校验是否可以提交表单
    if (form.imageFile.url && form.userType && form.realName && form.studentNumber && form.gender && form.school
      && form.faculty && form.facultyId && form.phoneNumber && sameStudentNumber
    ) {
      setCanRegister(true)
    } else {
      setCanRegister(false)
    }
  }, [form, sameStudentNumber])

  useEffect(() => {
    // 校验表单中学号是否相同
    if (form.studentNumber === form.initStudentNumber) {
      setSameStudentNumber(true)
    } else {
      setSameStudentNumber(false)
    }
  }, [form.initStudentNumber, form.studentNumber])

  useEffect(() => {
    // 修改表单的phoneNumber状态
    if (phoneNumber) {
      setForm({
        ...form,
        phoneNumber: phoneNumber
      })
    }
  }, [phoneNumber])

  const fetchData = () => {
    dispatch(fetchFaculties())
  }

  function onSubmitRegister() {
    if (canRegister) {
      // 调出确认窗口
      setConfirmDialogOpen(true)
    }
  }

  function onConfirmRegister() {
    // 确认并提交表单信息
    dispatch(submitIdentificationInfo(form))
  }

  async function onGetPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      dispatch(fetchPhoneNumber({
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        sessionKey: sessionKey
      }))
    } else {
      console.log(e.detail.errMsg)
      await Taro.showToast({
        icon: 'none',
        title: '获取手机号失败，您将无法参与活动',
        duration: 5000,
      });
    }
  }

  function onUpload() {
    Taro.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
    }).then(({tempFiles}) => {
      console.log(tempFiles)
      setForm({
        ...form,
        imageFile: {
          url: tempFiles[0].path,
        }
      })
    })
  }

  function onPickerConfirm(value) {
    console.log(value)
    if (picker.type === 'gender') {
      setForm({
        ...form,
        gender: value[0],
      })
    } else if (picker.type === 'faculty') {
      setForm({
        ...form,
        faculty: getFacultyName(value[0]),
        facultyId: value[0]
      })
    } else {
      setForm({
        ...form,
        userType: value[0]
      })
    }

    // 关闭选择器
    setPicker({
      ...picker,
      open: false
    })
  }

  function getFacultyName(id: string) {
    for (let i = 0; i < faculties.length; i++) {
      if (faculties[i].id === id) {
        return faculties[i].name
      }
    }
    return ''
  }

  function isSameStudentNumber() {
    return form.initStudentNumber && form.studentNumber && form.initStudentNumber !== form.studentNumber
  }

  return (
    <View className='container'>
      <View className='header'/>
      <View className='main col'>
        <View className='avatar'>
          {avatarUrl && avatarUrl.length ? (
            <Image
              shape='circle'
              lazyLoad
              src={avatarUrl}
              className='avatar-img'
            />
          ) : (
            <Image
              shape='circle'
              lazyLoad
              src={AnonymousImage}
              className='avatar-img'
            />
          )}
        </View>
        <View className='nickname'>
          {nickName ? nickName : '微信用户'}
        </View>
        <View
          className='body col'
        >
          <View className='card col'>
            <View className='text-top'>欢迎来到MatchUs！</View>
            <View className='divider'/>
            <View className='text-bottom'>先介绍一下你自己吧👇</View>
          </View>
          <View className='form-container'>
            <Form onSubmit={onSubmitRegister} className='form'>
              <View className='item'>
                <Text className='label'>姓名</Text>
                <Field className='field'>
                  <Input
                    placeholder='请输入您的姓名' value={form.realName}
                    onChange={(e) => setForm({
                      ...form,
                      realName: e.detail.value,
                    })}
                  />
                </Field>
              </View>
              <View className='item'>
                <Text className='label'>教务网账号</Text>
                <Field className='field'>
                  <Input
                    placeholder='请输入教务网账号' value={form.initStudentNumber}
                    onChange={(e) => {
                      if (studentNumberRegTest(e.detail.value)) {
                        setForm({
                          ...form,
                          initStudentNumber: e.detail.value,
                        })
                      }
                    }}
                  />
                </Field>
              </View>
              <View className='item'>
                <Text className='label'>教务网账号确认</Text>
                <Field className={classnames('field', {'field-warn': isSameStudentNumber()})}>
                  <Input
                    placeholder='请再次输入教务网账号' value={form.studentNumber}
                    onChange={(e) => {
                      if (studentNumberRegTest(e.detail.value)) {
                        setForm({
                          ...form,
                          studentNumber: e.detail.value,
                        })
                      }
                    }}
                  />
                </Field>
                {isSameStudentNumber() && <View className='field-note'>两次输入的学号不一致</View>}
              </View>
              <View className='item'>
                <Text className='label'>性别</Text>
                <Field className='field' rightIcon={<ArrowDown/>}
                       onClick={() => setPicker({open: true, type: 'gender'})}>
                  <Input
                    readonly
                    placeholder='请选择性别'
                    value={getFormatGender(form.gender) === '未选择' ? '' : getFormatGender(form.gender)}
                  />
                </Field>
              </View>
              <View className='item'>
                <Text className='label'>当前身份</Text>
                <Field className='field' rightIcon={<ArrowDown/>}
                       onClick={() => setPicker({open: true, type: 'userType'})}>
                  <Input
                    readonly
                    placeholder='请选择当前身份'
                    value={getFormatUserType(form.userType) === '未选择' ? '' : getFormatUserType(form.userType)}
                  />
                </Field>
              </View>
              <View className='item'>
                <Text className='label'>院系</Text>
                <Field className='field' rightIcon={<ArrowDown/>}
                       onClick={() => setPicker({open: true, type: 'faculty'})}>
                  <Input readonly placeholder='请选择院系' value={form.faculty}/>
                </Field>
              </View>
              <View className='item row item-border'>
                <Text className='label'>手机号</Text>
                <Field className='field pnb'>
                  <Input readonly value={`+${countryCode ? countryCode : 86}`}/>
                </Field>
                <View className='btn-container'>
                  {purePhoneNumber && purePhoneNumber.length ?
                    <Text className='text'>{purePhoneNumber}</Text>
                    :
                    <Button
                      openType='getPhoneNumber'
                      onGetPhoneNumber={onGetPhoneNumber}
                      className='btn'
                    >
                      点击自动获取手机号
                    </Button>
                  }
                </View>
              </View>
              <View className='item item-border-solid' style={{marginBottom: 0}}>
                <Text className='label'>学生证照片</Text>
                <Uploader
                  className={classnames('col', 'uploader', {'uploader__preview-image': form.imageFile.url})} maxFiles={1}
                >
                  {form.imageFile.url ? (
                    <Uploader.Image
                      key={form.imageFile.url}
                      url={form.imageFile.url}
                      onRemove={() => setForm({...form, imageFile: {url: ''}})}
                      className='uploader-preview'
                      // onClick={() => viewImages([form.imageFile.url])}
                    />
                  ) : (
                    <>
                      <View className='row center-center' onClick={onUpload}>
                        <Image src={UploadIcon} className='uploader-img'/>
                      </View>
                      <View className='uploader-title'>点击拍照或打开相册</View>
                      <View className='uploader-desc'>【在校生】校园卡/学生证/学信网学籍证明</View>
                      <View className='uploader-desc'>【毕业生】毕业证/学位证/学信网学籍证明</View>
                    </>
                  )}
                </Uploader>
              </View>
            </Form>
          </View>
        </View>
        <View className='row register-btn-container'>
          <View
            className={classnames(
              'register-btn',
              {'register-btn-submit': canRegister}
            )}
            onClick={onSubmitRegister}>
            注册
          </View>
        </View>
      </View>
      <Popup open={picker.open} rounded placement='bottom' onClose={() => setPicker({...picker, open: false})}>
        <Popup.Backdrop/>
        <Picker
          onCancel={() => setPicker({...picker, open: false})}
          onConfirm={(value) => {
            onPickerConfirm(value)
          }}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Title>选择{picker.type === 'gender' ? '性别' : picker.type === 'faculty' ? '院系' : '当前身份'}</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          {picker.type === 'gender' ? (
            <Picker.Column>
              <Picker.Option value={1}>男</Picker.Option>
              <Picker.Option value={2}>女</Picker.Option>
            </Picker.Column>
          ) : picker.type === 'faculty' ? (
            <Picker.Column>
              {faculties && faculties.length ?
                faculties.map((item) => (
                  <Picker.Option value={item.id}>{item.name}</Picker.Option>
                ))
                : <></>
              }
            </Picker.Column>
          ) : (
            <Picker.Column>
              <Picker.Option value={1}>在校生</Picker.Option>
              <Picker.Option value={2}>2019年-2022年从浙大毕业的毕业生</Picker.Option>
              <Picker.Option value={3}>2018年以前（包括2018）从浙大毕业的毕业生</Picker.Option>
            </Picker.Column>
          )}
        </Picker>
      </Popup>
      <Dialog open={confirmDialogOpen} onClose={setConfirmDialogOpen}>
        <Dialog.Header className='dialog-header'>确认提交</Dialog.Header>
        <Dialog.Actions>
          <Button className='dialog-btn' onClick={() => setConfirmDialogOpen(false)}>我再看看</Button>
          <Button className='dialog-btn' onClick={() => {
            setConfirmDialogOpen(false)
            onConfirmRegister()
          }}
          >确认
          </Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}

export default Index;
