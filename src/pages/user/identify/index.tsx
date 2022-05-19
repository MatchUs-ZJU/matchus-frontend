import {Button, Text, View} from "@tarojs/components";
import {useDispatch, useSelector} from "react-redux";
import {Dialog, Field, Form, Image, Input, Picker, Popup, Uploader} from "@taroify/core";
import {AnonymousImage, UploadIcon} from "@/assets/images";
import {useEffect, useState} from "react";
import {ArrowDown} from "@taroify/icons";
import Taro from "@tarojs/taro";
import {fetchFaculties, submitIdentificationInfo} from "@/actions";
import {fetchPhoneNumber} from "@/actions/user";
import {getFormatUserType} from "@/utils/fstring";
import {studentNumberRegTest} from "@/utils/reg";
import classnames from "classnames";
import {TOAST_SHOW_TIME} from "@/utils/constant";
import './index.scss'

const Index = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state)
  const {nickName, avatarUrl, phoneNumber, countryCode, purePhoneNumber, sessionKey} = user

  const [picker, setPicker] = useState({
    open: false,
    type: 'userType'
  })
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const [form, setForm] = useState({
    realName: '',
    studentNumber: '',
    phoneNumber: '',
    userType: 0,
    imageFile: {
      url: '',
    }
  })
  const [canRegister, setCanRegister] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // 校验是否可以提交表单
    if (form.imageFile.url && form.userType && form.realName && form.studentNumber && form.phoneNumber) {
      setCanRegister(true)
    } else {
      setCanRegister(false)
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
        duration: TOAST_SHOW_TIME,
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
    setForm({
      ...form,
      userType: value[0]
    })
    // 关闭选择器
    setPicker({
      ...picker,
      open: false
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
            <View className='text-top'>请填写身份认证信息</View>
            <View className='divider'/>
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
                    placeholder='请输入教务网账号' value={form.studentNumber}
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
                <Text className='label'>证明材料</Text>
                <Uploader
                  className={classnames('col', 'uploader', {'uploader__preview-image': form.imageFile.url})}
                  maxFiles={1}
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
            提交
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
            <Picker.Title>选择当前身份</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            <Picker.Option value={1}>在校生</Picker.Option>
            <Picker.Option value={2}>2019年-2022年从浙大毕业的毕业生</Picker.Option>
            <Picker.Option value={3}>2018年以前（包括2018）从浙大毕业的毕业生</Picker.Option>
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
