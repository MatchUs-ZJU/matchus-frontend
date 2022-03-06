import {View} from "@tarojs/components";
import Taro, {useDidShow} from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";

import './index.scss'
import {globalSave} from "../../actions";
import {IdentificationModal, LoginModal} from "../../components";
import Activity from "./activity";

const Index = () => {
  const dispatch = useDispatch();
  const { global, user } = useSelector((state) => state);
  const { showLoginModal, showIdentifyModal } = global;

  useDidShow(() => {
    const { nickName, identified } = user;
    console.log(user)
    if (!nickName) {
      dispatch(globalSave({showLoginModal: true}));
      return;
    }
    if (identified !== 1) {
      dispatch(globalSave({showIdentifyModal: true}));
      return;
    }
  })

  const { identified } = user

  return (
    <View className='container'>
      <LoginModal opened={showLoginModal} />
      <IdentificationModal opened={showIdentifyModal} />
      {
        identified === 1 ? (
          <Activity />
        ) : (
          <View>
            Default
          </View>
        )
      }
    </View>
  )
}

export default Index
