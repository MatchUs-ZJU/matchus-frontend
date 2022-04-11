import {Button, Text, View} from "@tarojs/components";
import {useDispatch, useSelector} from "react-redux";
import {Dialog, Field, Form, Image, Input, Picker, Popup, Uploader} from "@taroify/core";
import {AnonymousImage, UploadIcon} from "@/assets/images";
import {useEffect, useState} from "react";
import {ArrowDown, Plus} from "@taroify/icons";
import Taro from "@tarojs/taro";
import {fetchFaculties} from "@/actions";
import {fetchPhoneNumber, submitIdentificationInfo} from "@/actions/user";
import classnames from "classnames";

import './index.scss'

const Index = () => {
  const dispatch = useDispatch()
  const {user, resource} = useSelector(state => state)
  const {nickName, avatarUrl, phoneNumber, countryCode, purePhoneNumber} = user
  const {faculties} = resource

  const [schoolPickerOpen, setSchoolPickerOpen] = useState(false)
  const [facultyPickerOpen, setFacultyPickerOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const [form, setForm] = useState({
    realName: '',
    studentNumber: '',
    school: '浙江大学',
    faculty: '',
    phoneNumber: ''
  })
  const [canRegister, setCanRegister] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // 校验是否可以提交表单
    if (form.realName && form.studentNumber && form.school && selectedFacultyName && form.phoneNumber) {
      setCanRegister(true)
    }
  }, [form])

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
    console.log(form)
    dispatch(submitIdentificationInfo(form))
  }

  async function onGetPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      dispatch(fetchPhoneNumber({
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
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

  async function navToUserAgreement() {
    await Taro.navigateTo({
      url: '/pages/user/agreement/index'
    })
  }

  async function navToUserPrivacy() {
    await Taro.navigateTo({
      url: '/pages/user/privacy/index'
    })
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
                <Text className='label'>真实姓名</Text>
                <Field className='field'>
                  <Input
                    placeholder='请输入真实姓名' value={form.realName}
                    onChange={(e) => setForm({
                      ...form,
                      realName: e.detail.value,
                    })}
                  />
                </Field>
              </View>
              <View className='item'>
                <Text className='label'>学号</Text>
                <Field className='field'>
                  <Input
                    placeholder='请输入学号' value={form.studentNumber}
                    onChange={(e) => {
                      const numRegExp = /^\d+$/
                      if (!numRegExp.test(e.detail.value)) {
                        return
                      }
                      setForm({
                        ...form,
                        studentNumber: e.detail.value,
                      })
                    }}
                  />
                </Field>
              </View>
              <View className='item'>
                <Text className='label'>学校</Text>
                <Field className='field' rightIcon={<ArrowDown/>} onClick={() => setSchoolPickerOpen(true)}>
                  <Input readonly placeholder='请选择学校' value={form.school}/>
                </Field>
              </View>
              <View className='item'>
                <Text className='label'>学院</Text>
                <Field className='field' rightIcon={<ArrowDown/>} onClick={() => setFacultyPickerOpen(true)}>
                  <Input readonly placeholder='请选择学院' value={form.faculty}/>
                </Field>
              </View>
              <View className='item row item-border'>
                <Text className='label'>手机号</Text>
                <Field className='field pnb' rightIcon={<Plus/>}>
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
                <Uploader className='col uploader'>
                  <View className='row center-center'>
                    <Image src={UploadIcon} className='uploader-img'/>
                  </View>
                  <View className='uploader-title'>点击拍照或打开相册</View>
                  <View className='uploader-desc'>信息要与学生证照片保持一致，否则审核不予通过</View>
                  <View className='uploader-note danger'>（该功能本期暂未开放）</View>
                </Uploader>
              </View>
            </Form>
          </View>
        </View>
        <View className='row agree'>
          <View className='text'>
            我已阅读同意
            <Text className='purple' onClick={navToUserAgreement}>《MatchUs用户协议》</Text>
            和
            <Text className='purple' onClick={navToUserPrivacy}>《MatchUs个人信息保护策略》</Text>
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
      <Popup open={schoolPickerOpen} rounded placement='bottom' onClose={setSchoolPickerOpen}>
        <Popup.Backdrop/>
        <Picker
          onCancel={() => setSchoolPickerOpen(false)}
          onConfirm={(value) => {
            setForm({
              ...form,
              school: value[0],
            })
            setSchoolPickerOpen(false)
          }}
          defaultValue='浙江大学'
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Title>选择学校</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            <Picker.Option>浙江大学</Picker.Option>
          </Picker.Column>
        </Picker>
      </Popup>
      <Popup open={facultyPickerOpen} rounded placement='bottom' onClose={setFacultyPickerOpen}>
        <Popup.Backdrop/>
        <Picker
          onCancel={() => setFacultyPickerOpen(false)}
          onConfirm={(value) => {
            setForm({
              ...form,
              faculty: value[0],
            })
            setFacultyPickerOpen(false)
          }}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Title>选择学院</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            {faculties && faculties.length ?
              faculties.map((item) => (
                <Picker.Option>{item.name}</Picker.Option>
              )) : <></>
            }
          </Picker.Column>
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
