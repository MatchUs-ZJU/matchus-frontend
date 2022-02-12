import {View} from "@tarojs/components";
import {useDidShow} from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";

import './index.scss'
import {saveGlobal} from "../../actions";
import {IdentificationModal, LoginModal} from "../../components";

const Activity = () => {
  const dispatch = useDispatch();
  const { global, user } = useSelector(state => state);
  const { showLoginModal, showIdentifyModal } = global;

  useDidShow(() => {
    const { nickName, identified } = user;
    console.log(user)
    if (!nickName) {
      dispatch(saveGlobal({showLoginModal: true}));
      return;
    }
    if (!identified) {
      dispatch(saveGlobal({showIdentifyModal: true}));
      return;
    }
  })

  useEffect(() => {

  })

  return (
    <View className='container'>
      <LoginModal opened={showLoginModal} />
      <IdentificationModal opened={showIdentifyModal} />
    </View>
  )
}

export default Activity
