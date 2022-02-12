import {View} from "@tarojs/components";
import {useDidShow} from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";

import './index.scss'
import {saveGlobal} from "../../actions";
import {IdentificationModal, LoginModal} from "../../components";

const Activity = () => {
  const dispatch = useDispatch();
  const { global, user } = useSelector(state => state);
  const { showLoginModal, showIdentifyModal } = global;

  useDidShow(() => {
    const { nickName, identified } = user;
    if (!nickName) {
      dispatch(saveGlobal({showLoginModal: true}));
      return;
    }
    if (!identified) {
      dispatch(saveGlobal({showIdentifyModal: true}));
      return;
    }
  })

  return (
    <View className='container'>
      <LoginModal opened={showLoginModal} />
      <IdentificationModal opened={showIdentifyModal} />
    </View>
  )
}

export default Activity
