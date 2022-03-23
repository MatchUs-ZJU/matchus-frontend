import {View, Text} from "@tarojs/components";
import {useSelector} from "react-redux";
import {Checkbox, Image} from "@taroify/core"
import {useState} from "react";
import Taro from "@tarojs/taro";
import {HeaderImage, SloganImage} from "@/assets/images";
import './index.scss'

const Introduction = () => {

  const {showLoginModal} = useSelector(state => state.global)
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

  return(
    <View className='container wrapper'>
      {/*<LoginModal opened={showLoginModal} />*/}
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
        <View className='register-button'>
          立即注册
        </View>
        <View className='text-1'>我先逛逛</View>
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
