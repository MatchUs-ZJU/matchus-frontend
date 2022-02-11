import { View, Button } from "@tarojs/components";
import {AtModal, AtModalHeader, AtModalContent, AtModalAction} from "taro-ui";
import {useDispatch} from "react-redux";

const LoginModal = ({ opened }) => {
  const dispatch = useDispatch();

  const openLogin = () => {
    // dispatch({ type: 'user/register' });
  };

  const closeModal = () => {
    // dispatch({
    //   type: 'global/save',
    //   payload: { showLoginModal: false },
    // });
  };

  return (
    <View>
      <AtModal isOpened={opened} onClose={closeModal}>
        <AtModalHeader>您尚未登录</AtModalHeader>
        <AtModalContent>
          <View className='content'>立即登录Match Us！</View>
        </AtModalContent>
        <AtModalAction>
          <Button openType='getUserInfo' onGetUserInfo={openLogin} className='button'>
            <View className='text'>点击登录</View>
          </Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
};

export default LoginModal;
