import {View, Text} from "@tarojs/components";
import {Cell} from "@taroify/core";
import "@taroify/core/cell/style"
import {useSelector} from "react-redux";
import {getBadgeInfo, getFormatGender} from "@/utils/fstring";
import {Close, MoreOutlined, Passed} from "@taroify/icons";
import classnames from "classnames";
import Taro from "@tarojs/taro";
import PersonalInfoPopUp, {PopUpProps} from "@/components/personal-info-popup";
import {useState} from "react";
import './index.scss'
// import {IUserState} from "@/reducers/user";

const Information = () => {
  const {user} = useSelector((state) => state)
  const {realName, gender, faculty, studentNumber, phoneNumber, identified,userType} = user
  const {currentUserType,setCurrentUserType} = useState(user.userType)

  const onPopupCancel = ()=>{
    setPopUp({...popup,open:false})
  }

  const onConfirmUserType = ()=>{
    // submit
  }

  const [popup,setPopUp] = useState<PopUpProps>({
    title: '当前身份',
    open: false,
    gender: 1,
    type: 'picker',
    cancel: onPopupCancel,
    confirm: onConfirmUserType,
    pickerType: 'currentType',
    photoUrls:[]
  })

  async function refillForm() {
    await Taro.navigateTo({url: '/pages/user/identify/index'})
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
            onClick={()=>setPopUp({...popup,open: true})}
          >{getBadgeInfo(identified, userType)}</Cell>
          <Cell title='学院'>{faculty}</Cell>
          <Cell title='手机号'>{phoneNumber}</Cell>
        </Cell.Group>
      </View>
      <PersonalInfoPopUp
        title={popup.title}
        open={popup.open}
        cancel={popup.cancel}
        confirm={popup.confirm}
        gender={popup.gender}
        type={popup.type}
        photoUrls={popup.photoUrls}
        pickerType={popup.pickerType}
      />
      {
        (identified === '认证失败' || identified === '未认证') && <View className='refill-btn' onClick={refillForm}>重填信息</View>
      }
    </View>
  );
}

export default Information;
