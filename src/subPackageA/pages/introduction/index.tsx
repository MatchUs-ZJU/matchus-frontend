import {View, Text,Button} from "@tarojs/components";
import classnames from 'classnames';
import {Checkbox, Field, Image, Input, Popup} from "@taroify/core"
import {useState} from "react";
import Taro from "@tarojs/taro";
import {AnonymousImage, HeaderImage, SloganImage} from "@/assets/images";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserProfile} from "@/actions";
import {Clear} from "@taroify/icons";
import {TOAST_SHOW_TIME} from "@/utils/constant";

import './index.scss'

const Introduction = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state)
  const [agree, setAgree] = useState<boolean>(false)
  const [popupOpen,setPopupOpen] = useState(false)
  const [nickName,setNickName] = useState('')
  const [avatarUrl,setAvatarUrl] = useState('')

  function onAgreePrivacy(e: boolean) {
    setAgree(e)
  }

  async function navToUserAgreement() {
    await Taro.navigateTo({
      url: '/subPackageA/pages/agreement/index'
    })
  }

  async function navToUserPrivacy() {
    await Taro.navigateTo({
      url: '/subPackageA/pages/privacy/index'
    })
  }

  async function navToHome() {
    await Taro.switchTab({
      url: '/pages/home/index/index'
    })
  }

  async function onClickRegister() {
    if (agree) {
      if (user.nickName && user.avatarUrl) {
        // 用户已经上传基本信息
        await Taro.navigateTo({
          url: '/pages/user/register/index'
        })
      } else {
        setPopupOpen(true)
      }
    } else {
      await Taro.showToast({
        title: '请先阅读并同意相关协议',
        duration: 3000,
        icon: 'none'
      })
    }
  }

  function onChooseAvatar(e){
    setAvatarUrl(e.detail.avatarUrl)
  }

  return (
    <View className='container wrapper'>
      <View className='col layout' style={{marginBottom: '80px'}}>
        <Image
          lazyLoad
          src={HeaderImage}
          className='header'
        />
        <Image
          lazyLoad
          src={SloganImage}
          className='slogan'
        />
      </View>
      <View className='col layout' style={{marginTop: '80px'}}>
        <View
          className={classnames(
            'register-button',
            {
              'register-button-not-agree': !agree,
              'register-button-agree': agree,
            })}
          onClick={onClickRegister}
        >
          立即注册
        </View>
        <View className='text-1' onClick={navToHome}>我先逛逛</View>
        <View className='text-2'>您尚未注册，注册后用户资料将会同步</View>
        <View className='row agree'>
          <Checkbox
            className='radio'
            size={12}
            onChange={onAgreePrivacy}
          />
          <View className='text'>
            我已阅读同意
            <Text className='purple' onClick={navToUserAgreement}>《MatchUs用户协议》</Text>
            和
            <Text className='purple' onClick={navToUserPrivacy}>《MatchUs个人信息保护策略》</Text>
          </View>
        </View>
      </View>
      <Popup className='form-popup' open={popupOpen} rounded placement='bottom' onClose={()=>setPopupOpen(false)}>
        <Popup.Backdrop/>
        <Text className='popup-title'>
          完善头像与昵称
        </Text>
        <Button
          className='popup-avatar'
          open-type='chooseAvatar'
          onChooseAvatar={onChooseAvatar}
        >
          {avatarUrl && avatarUrl.length ? (
            <Image
              className='img'
              shape='circle'
              mode='aspectFit'
              src={avatarUrl}
            />
          ) : (
            <Image
              className='img'
              shape='circle'
              mode='aspectFit'
              src={AnonymousImage}
            />
          )}
        </Button>

        <View className='input-box'>
          <Field
            className='input-field'
          >
            <Input
              autoFocus
              value={nickName}
              type='nickname'

              onChange={(e) => {
                setNickName(e.detail.value)
                if(e.detail.value.length < 20){
                  setNickName(e.detail.value)
                }
              }}
            />
            <View className='corner-icon'>
              <Clear style={{color: "rgba(0, 0, 0, 0.3)",zIndex:10}} onClick={() => setNickName('')}/>
            </View>
          </Field>
        </View>
        <View
          className={classnames('confirm-btn', {'confirm-btn-disabled': !nickName || !avatarUrl})}
          onClick={async () => {
            if(!avatarUrl || !nickName){
              await Taro.showToast({
                icon: 'none',
                title: '头像昵称不完善',
                duration: TOAST_SHOW_TIME,
              });
            }else{
              dispatch(fetchUserProfile({avatarUrl,nickName}))
              setPopupOpen(false)
            }
          }}
        >确认</View>
      </Popup>

    </View>
  )

}

export default Introduction
