import { View, Button } from "@tarojs/components";
import {AtModal, AtModalHeader, AtModalContent, AtModalAction} from "taro-ui";
import {useDispatch, useSelector} from "react-redux";
import './index.scss'
import {globalSave, userRegister} from "../../actions";
import {getJWT} from "../../services/jwt";

const LoginModal = ({ opened }) => {
  const dispatch = useDispatch();
  const {openid} = useSelector(state => state.user)

  const onConfirmRegister = () => {
    if (!getJWT()) {
      console.log('用户注册：在获取用户信息时缺乏JWT')
    } else {
      dispatch(userRegister(openid))
    }
  };

  return (
    <View>
      <AtModal isOpened={opened} onClose={() => dispatch(globalSave({showLoginModal: false}))}>
        <AtModalHeader>您尚未注册</AtModalHeader>
        <AtModalContent>
          <View className='content'>立即注册Match Us身份信息！</View>
        </AtModalContent>
        <AtModalAction>
          <Button openType='getUserInfo' onGetUserInfo={onConfirmRegister} className='button'>
            <View className='text'>点击注册</View>
          </Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
};

export default LoginModal;
