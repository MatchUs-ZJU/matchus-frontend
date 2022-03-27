import {Button, Text, View} from "@tarojs/components";
import {useSelector} from "react-redux";
import {Field, Form, Image, Input, Picker, Popup, Uploader} from "@taroify/core";
import {AnonymousImage, UploadIcon} from "@/assets/images";
import {useState} from "react";
import {ArrowDown} from "@taroify/icons";
import Taro from "@tarojs/taro";

import './index.scss'

const Index = () => {

  const {user} = useSelector(state => state)
  const {nickName, avatarUrl} = user

  const [schoolPickerOpen, setSchoolPickerOpen] = useState(false)
  const [facultyPickerOpen, setFacultyPickerOpen] = useState(false)
  const [phoneNumberPrefixPickerOpen, setPhoneNumberPrefixPickerOpen] = useState(false)

  const [realName, setRealName] = useState('')
  const [studentNumber, setStudentNumber] = useState('')
  const [school, setSchool] = useState('浙江大学')
  const [faculty, setFaculty] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  function onSubmitRegisterInfo(e) {

  }

  function onGetPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      console.log(e.detail.errMsg)
    } else {
      console.log(e.detail.errMsg)
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

  function finishRegister() {

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
            <Form onSubmit={onSubmitRegisterInfo} className='form'>
              <View className='item'>
                <View className='label'>真实姓名</View>
                <Field className='field'>
                  <Input placeholder='请输入真实姓名' value={realName} onChange={(e) => setRealName(e.detail.value)}/>
                </Field>
              </View>
              <View className='item'>
                <View className='label'>学号</View>
                <Field className='field'>
                  <Input placeholder='请输入学号' value={studentNumber} onChange={(e) => setStudentNumber(e.detail.value)}/>
                </Field>
              </View>
              <View className='item'>
                <View className='label'>学校</View>
                <Field className='field' rightIcon={<ArrowDown/>} onClick={() => setSchoolPickerOpen(true)}>
                  <Input readonly placeholder='请选择学校' value={school}/>
                </Field>
              </View>
              <View className='item'>
                <View className='label'>学院</View>
                <Field className='field' rightIcon={<ArrowDown/>} onClick={() => setFacultyPickerOpen(true)}>
                  <Input readonly placeholder='请选择学院' value={faculty}/>
                </Field>
              </View>
              <View className='item row item-border'>
                <View className='label'>
                  手机号
                </View>
                <Field className='field pnb' rightIcon={<ArrowDown/>}
                       onClick={() => setPhoneNumberPrefixPickerOpen(true)}>
                  <Input readonly placeholder='+86' value={`+86`}/>
                </Field>
                <View className='btn-container'>
                  <Button
                    openType='getPhoneNumber'
                    onGetPhoneNumber={onGetPhoneNumber}
                    className='btn'
                  >
                    点击自动获取手机号
                  </Button>
                </View>
              </View>
              <View className='item item-border-solid'>
                <View className='label'>学生证照片</View>
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
          <View className='register-btn' onClick={finishRegister}>
            注册
          </View>
        </View>
      </View>
      <Popup open={schoolPickerOpen} rounded placement='bottom' onClose={setSchoolPickerOpen}>
        <Popup.Backdrop/>
        <Picker
          onCancel={() => setSchoolPickerOpen(false)}
          onConfirm={(values) => {
            setSchool(values)
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
          onConfirm={(values) => {
            setFaculty(values)
            setFacultyPickerOpen(false)
          }}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Title>选择学院</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            <Picker.Option>计算机科学与技术学院</Picker.Option>
          </Picker.Column>
        </Picker>
      </Popup>
      <Popup open={phoneNumberPrefixPickerOpen} rounded placement='bottom' onClose={setPhoneNumberPrefixPickerOpen}>
        <Popup.Backdrop/>
        <Picker
          onCancel={() => setPhoneNumberPrefixPickerOpen(false)}
          onConfirm={(values) => {
            set(values)
            setPhoneNumberPrefixPickerOpen(false)
          }}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            <Picker.Option>计算机科学与技术学院</Picker.Option>
          </Picker.Column>
        </Picker>
      </Popup>
    </View>
  )
}

export default Index;
