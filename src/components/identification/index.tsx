import {useDispatch} from "react-redux";
import {Button, View} from "@tarojs/components";
import {AtModal, AtModalAction, AtModalContent, AtModalHeader} from "taro-ui";
import Taro from "@tarojs/taro";
import './index.scss'
import {saveGlobal} from "../../actions";

const IdentificationModal = ({opened}) => {
  const dispatch = useDispatch();

  const onConfirmIdentification = () => {
    Taro.navigateTo({url: '/pages/identify/index'});
    dispatch(saveGlobal({showIdentifyModal: false}));
  };

  const onCancel = () => {
    Taro.navigateTo({url: '/pages/home/index'});
    dispatch(saveGlobal({showIdentifyModal: false}))
  }

  return (
    <View>
      <AtModal
        isOpened={opened}
        onConfirm={onConfirmIdentification}
        onCancel={() => dispatch(saveGlobal({showIdentifyModal: false}))}
      >
        <AtModalHeader>您尚未完成身份认证</AtModalHeader>
        <AtModalContent>
          <View className='content'>只有完成身份认证后才可以参加MatchUs的系列活动哦!</View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={onCancel} className='button'>
            <View className='text'>待会再去</View>
          </Button>
          <Button onClick={onConfirmIdentification} className='button'>
            <View className='text'>前往认证</View>
          </Button>
        </AtModalAction>
      </AtModal>
    </View>
  );
};

export default IdentificationModal;
