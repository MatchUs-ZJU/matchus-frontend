import {View, Button} from "@tarojs/components";
import {AtModal, AtModalHeader, AtModalContent, AtModalAction} from "taro-ui";
import {useDispatch, useSelector} from "react-redux";
import './index.scss'
import {globalSave, fetchUserProfile} from "../../actions";

const LoginModal = ({opened}) => {
  const dispatch = useDispatch();

  const onConfirmRegister = () => {
    dispatch(fetchUserProfile())
  };

  const onClose = async () => {
    dispatch(globalSave({showLoginModal: false}))
  }

  return (
    <View>
      <AtModal isOpened={opened} onClose={onClose} closeOnClickOverlay={false}>
        <AtModalHeader>您尚未注册</AtModalHeader>
        <AtModalContent>
          <View className='content'>立即注册Match Us！</View>
        </AtModalContent>
        <AtModalAction>
          <Button openType='getUserInfo' onClick={onConfirmRegister} className='button'>
            <View className='text-1'>点击注册</View>
          </Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
};

export default LoginModal;
