import { View, Button } from "@tarojs/components";
import {AtModal, AtModalHeader, AtModalContent, AtModalAction} from "taro-ui";
import Taro from "@tarojs/taro";
import {useDispatch} from "react-redux";
import './index.scss'
import {saveGlobal} from "../../actions";
import {getJWT} from "../../services/jwt";
import {saveUserInfo} from "../../actions/user";
import {register} from "../../services/user";

const LoginModal = ({ opened }) => {
  const dispatch = useDispatch();

  const onConfirmRegister = async (e) => {
    console.log(e.detail)

    if (!getJWT()) {
      console.log('用户注册：在获取用户信息时缺乏JWT')
    } else {
      try {
        console.log('用户注册：授权获取用户信息')
        const {userInfo} = await Taro.getUserInfo()
        // store user info
        dispatch(saveUserInfo(userInfo))
        // register
        console.log(userInfo)
        await register(userInfo)
      } catch (_) {
        await Taro.showToast({
          icon: 'none',
          title: '授权失败! 您将无法参加我们的活动',
          duration: 5000,
        });
      }
    }
  };

  return (
    <View>
      <AtModal isOpened={opened} onClose={() => dispatch(saveGlobal({showLoginModal: false}))}>
        <AtModalHeader>您尚未登录</AtModalHeader>
        <AtModalContent>
          <View className='content'>立即登录Match Us！</View>
        </AtModalContent>
        <AtModalAction>
          <Button openType='getUserInfo' onGetUserInfo={onConfirmRegister} className='button'>
            <View className='text'>点击登录</View>
          </Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
};

export default LoginModal;
