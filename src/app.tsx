import {useEffect, useState} from 'react'
import {Provider, useSelector} from 'react-redux'
import Taro, {useDidShow} from "@tarojs/taro";
import {fetchUserInfo, globalSave, relogin, userSave} from "./actions"

import './app.scss'
import {getJWT} from "./services/jwt";
import {store} from "./store";

function App(props) {

  const [sessionValid, setSessionValid] = useState(false)
  const {sessionKey, } = store.getState().user

  async function handleSessionValid() {
    setSessionValid(true)

    // check JWT
    if (!getJWT() || !sessionKey) {
      console.log('用户登录：JWT或SessionKey不存在，重新登录');
      store.dispatch(relogin())
    } else {
      // 获取个人信息
      console.log('用户登录：JWT和SessionKey存在，获取用户信息');
      store.dispatch(userSave({login: true}))
      store.dispatch(fetchUserInfo())
    }
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        await Taro.checkSession()
        // session not timeout
        console.log('用户登录：Session有效');
        await handleSessionValid()
      } catch (e) {
        if (!sessionValid) {
          // session timeout
          console.log('用户登录：Session无效，发起登录');
          store.dispatch(relogin())
        }
      }
    }

    checkSession()
    // store system info
    Taro.getSystemInfo().then((systemInfo) => {
      store.dispatch(globalSave({
        system: systemInfo
      }))
    });
  }, [])

  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  );
}

export default App
