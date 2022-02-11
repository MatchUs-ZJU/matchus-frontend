import {useDispatch} from "react-redux";
import {View} from "@tarojs/components";
import {AtModal} from "taro-ui";

const IndentificationModal = ({opened}) => {
  const dispatch = useDispatch();

  const goToIdentify = () => {
    // Taro.navigateTo({ url: '/pages/user/identity' });
    // dispatch({
    //   type: 'global/save',
    //   payload: { showIdentifyModal: false },
    // });
  };
  const closeModal = () => {
    // dispatch({
    //   type: 'global/save',
    //   payload: { showIdentifyModal: false },
    // });
  };

  return (
    <View>
      <AtModal
        isOpened={opened}
        title='您尚未完成身份认证'
        content='只有完成身份认证后才可以参加MatchUs的系列活动哦!'
        confirmText='前往认证'
        onConfirm={goToIdentify}
        cancelText='待会再去'
        onCancel={closeModal}
        onClose={closeModal}
      />
    </View>
  );
};

export default IndentificationModal;
