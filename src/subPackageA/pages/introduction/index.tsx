import {View, Text} from "@tarojs/components";
import classnames from 'classnames';
import {Checkbox, Image} from "@taroify/core"
import {useState} from "react";
import Taro from "@tarojs/taro";
import {HeaderImage, SloganImage} from "@/assets/images";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserProfile} from "@/actions";
import './index.scss'

const Introduction = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state)
  const [agree, setAgree] = useState<boolean>(false)

  function onAgreePrivacy(e: boolean) {
    setAgree(e)
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
        // 用户未上传基本信息
        dispatch(fetchUserProfile())
      }
    } else {
      await Taro.showToast({
        title: '请先阅读并同意相关协议',
        duration: 3000,
        icon: 'none'
      })
    }
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
    </View>
  )

}

export default Introduction
