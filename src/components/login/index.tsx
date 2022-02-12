import { View, Button } from "@tarojs/components";
import {AtModal, AtModalHeader, AtModalContent, AtModalAction} from "taro-ui";
import {useDispatch, useSelector} from "react-redux";
import './index.scss'
import {saveGlobal} from "../../actions";
import {getJWT} from "../../services/jwt";
import Taro from "@tarojs/taro";

const LoginModal = ({ opened }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state)

  const onConfirmLogin = async () => {
    if (!getJWT()) {
      console.log('用户登录：在获取用户信息时缺乏JWT')
    } else {

    }
  };

  const onCloseModal = () => {
    dispatch(saveGlobal({showLoginModal: false}))
  };

  return (
    <View>
      <AtModal isOpened={opened} onClose={onCloseModal}>
        <AtModalHeader>您尚未登录</AtModalHeader>
        <AtModalContent>
          <View className='content'>立即登录Match Us！</View>
        </AtModalContent>
        <AtModalAction>
          <Button openType='getUserInfo' onGetUserInfo={onConfirmLogin} className='button'>
            <View className='text'>点击登录</View>
          </Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
};

export default LoginModal;
