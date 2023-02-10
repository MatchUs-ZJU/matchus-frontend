import {Text, View} from "@tarojs/components";
import {Cell, Image, Picker, Popup, Uploader} from "@taroify/core";
import "@taroify/core/cell/style"
import {useDispatch, useSelector} from "react-redux";
import {getBadgeInfo, getFormatGender} from "@/utils/fstring";
import {Close, MoreOutlined, Passed} from "@taroify/icons";
import classnames from "classnames";
import Taro from "@tarojs/taro";
import {useEffect, useState} from "react";
import {TOAST_SHOW_TIME, USER_TYPE, USER_TYPE_STEPS, USER_TYPE_STRING} from "@/utils/constant";

import {UploadIcon} from "@/assets/images";
import {fetchFaculties, submitIdentificationInfo} from "@/actions";
import {notifySubscribe} from "@/actions/activity";
import {submitUserFaculty} from "@/actions/user";
import './index.scss'

const Information = () => {
  const {user,resource} = useSelector((state) => state)
  const {realName, gender, faculty, studentNumber, phoneNumber, identified,userType,isComplete,isOldUser,material,needUpdate,isChangeable} = user
  const {faculties} = resource
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(fetchFaculties())
  },[])

  const findFacultyId = (name) => {
    if(!faculty) return 0
    const target = faculties.filter((item)=>item.name===name)
    return target.length>0?target[0].id:0
  }

  const [form, setForm] = useState({
    realName,
    studentNumber,
    school: '浙江大学',
    gender,
    faculty,
    phoneNumber,
    userType,
    imageFile: {url: material}
  })

  const [userTypeStep,setUserTypeStep] = useState(USER_TYPE_STEPS.CLOSE)
  const [userFacultyOpen,setUserFacultyOpen] = useState(false)
  const [pickerValue,setPickerValue] = useState(0)
  const [facultyPicker,setFacultyPicker] = useState(0)

  async function refillForm() {
    await Taro.navigateTo({url: '/pages/user/identify/index'})
  }

  function onUpload() {
    Taro.chooseImage({
      count: 1, sizeType: ["original", "compressed"], sourceType: ["album", "camera"],
    }).then(({tempFiles}) => {
      setForm({
        ...form, imageFile: {
          url: tempFiles[0].path,
        }
      })
    })
  }

  return (
    <View className='container wrapper'>
      <View className={classnames('notice',
        {'notice-checked': identified === '认证成功'},
        {'notice-notallow': identified === '认证失败' || identified === '未认证'},
        {'notice-checking': identified === '认证中'}
      )}
      >
        {identified === '认证成功' ? <Passed className='notice-icon'/> : identified === '认证失败' || identified === '未认证' ? <Close className='notice-icon'/> : <MoreOutlined className='notice-icon'/>}
        <Text className='notice-text'>
          {identified === '认证成功' ? '个人信息审核通过' : identified === '认证失败' || identified === '未认证' ? '个人信息审核不通过，请重新提交个人资料' : '个人信息正在审核中，请耐心等待'}
        </Text>
      </View>
      <View className='info'>
        <Cell.Group inset>
          <Cell title='真实姓名'>{realName}</Cell>
          <Cell title='性别'>{getFormatGender(gender)}</Cell>
          <Cell title='学号'>{studentNumber}</Cell>
          <Cell title='当前身份'
            onClick={
            async ()=> {
              if(isChangeable){
                setUserTypeStep(USER_TYPE_STEPS.CHOOSE)
              }else{
                await Taro.showToast({
                  title: "您已成功报名，暂时不可修改～",
                  duration: TOAST_SHOW_TIME,
                  icon: 'none'
                })
              }
            }
          }
          >
            <View className='badge-container'>
              {/*{identified && needUpdate && <View className='dot'/>}*/}
              <Text>{getBadgeInfo(identified, userType)}</Text>
            </View>
          </Cell>
          <Cell title='学院'
            onClick={async ()=> {
              if(isChangeable){
                setUserFacultyOpen(true)
              }else{
                await Taro.showToast({
                  title: "您已成功报名，暂时不可修改～",
                  duration: 2000,
                  icon: 'none'
                })
              }
            }}
          >
            {faculty}
            {/*<View className='badge-container'>*/}
            {/*  {needUpdate && <View className='dot'/>}*/}
            {/*  <Text>{needUpdate?'待完善':{faculty}</Text>*/}
            {/*</View>*/}
          </Cell>
          <Cell title='手机号'>{phoneNumber}</Cell>
        </Cell.Group>
      </View>

      <Popup className='form-popup' open={userFacultyOpen} rounded placement='bottom' onClose={()=>setUserFacultyOpen(false)}>
        <Popup.Backdrop/>
        <Text className='popup-title'>
          选择学院
        </Text>
        <Picker siblingCount={3} onChange={(value) => setFacultyPicker(value)}>
          <Picker.Column>
            {
              faculties.map((item,idx)=>
                <Picker.Option value={idx}>{item.name}</Picker.Option>
              )
            }
          </Picker.Column>
        </Picker>
        <View className='confirm-btn' onClick={() => {
          // dispatch(notifySubscribe(['FGLXTk3ch9W5f8aUTiBddnhS0mlngL_0QFYe8l0FEuw']))
          dispatch(submitUserFaculty({facultyId: faculties[facultyPicker].id,faculty:faculties[facultyPicker].name}))
          setUserFacultyOpen(false)
        }}
        >确定</View>
      </Popup>

      <Popup className='form-popup' open={userTypeStep===USER_TYPE_STEPS.CHOOSE} rounded placement='bottom'
        onClose={()=> {setUserTypeStep(USER_TYPE_STEPS.CLOSE)}}
      >
        <Popup.Backdrop/>
        <Text className='popup-title'>
          选择当前身份
        </Text>
          <Picker
            siblingCount={3}
            onCancel={()=>setUserTypeStep(USER_TYPE_STEPS.CLOSE)}
            onChange={(value) => {
              setPickerValue(value)
            }}
          >
              <Picker.Column>
                <Picker.Option value={USER_TYPE.STUDENT}>在校生</Picker.Option>
                <Picker.Option value={USER_TYPE.GRADUATE}>毕业生</Picker.Option>
              </Picker.Column>
              )
          </Picker>
        <View className='confirm-btn' onClick={() => {
          if(pickerValue === USER_TYPE.STUDENT && needUpdate || !form.imageFile.url){
            setUserTypeStep(USER_TYPE_STEPS.UPLOAD)
            setForm({...form,userType: pickerValue})
          }
          else{
            dispatch(submitIdentificationInfo({...form,userType: pickerValue,facultyId: findFacultyId(faculty)},false,false))
            setUserTypeStep(USER_TYPE_STEPS.FINISH)
           }
          }
        }
        >{needUpdate?'下一步':'确定'}</View>
      </Popup>

      <Popup className='form-popup' open={userTypeStep===USER_TYPE_STEPS.UPLOAD} rounded placement='bottom' onClose={()=>setUserTypeStep(USER_TYPE_STEPS.CLOSE)}>
        <Popup.Backdrop/>
        <Text className='popup-title'>
          请上传证明材料
        </Text>
        <Uploader
          className={classnames('col', 'material-uploader', {'uploader__preview-image': form.imageFile.url})}
          maxFiles={1}
        >
          {form.imageFile.url ? (<Uploader.Image
            key={form.imageFile.url}
            url={form.imageFile.url}
            onRemove={() => setForm({...form, imageFile: {url: ''}})}
            className='uploader-preview'
            // onClick={() => viewImages([form.imageFile.url])}
          />) : (<View onClick={onUpload}>
            <View className='row center-center'>
              <Image src={UploadIcon} className='uploader-img'/>
            </View>
            <View className='uploader-title'>点击拍照或打开相册</View>
            <View className='uploader-desc'>校园卡/学生证/学信网学籍证明/蓝码截图</View>
          </View>)}
        </Uploader>
        <View className='confirm-btn' onClick={() => {
          dispatch(notifySubscribe(['FGLXTk3ch9W5f8aUTiBddnhS0mlngL_0QFYe8l0FEuw']))
          dispatch(submitIdentificationInfo({...form,facultyId:findFacultyId(faculty)},true,false))
          setUserTypeStep(USER_TYPE_STEPS.FINISH)}}
        >下一步</View>
      </Popup>

      <Popup className='form-popup' open={userTypeStep===USER_TYPE_STEPS.FINISH} rounded placement='bottom'>
        <View className='col popup-memo'>
          <Text className='memo-text'>已完成身份信息修改～</Text>
          <Text className='memo-text'>请及时完善个人信息</Text>
        </View>

        <View className='confirm-btn' onClick={async () => {
          setUserTypeStep(USER_TYPE_STEPS.CLOSE)
          if(isComplete || isOldUser){
            await Taro.redirectTo({url: '/subPackageB/user/personal-info-modify/index'})
          }
          else if(!isComplete){
            await Taro.redirectTo({url: '/subPackageB/user/personal-info-fill/index'})
          }
        }}
        >去完善</View>
      </Popup>

      {
        (identified === '认证失败' || identified === '未认证') && <View className='refill-btn' onClick={refillForm}>重填信息</View>
      }
    </View>
  );
}

export default Information;
