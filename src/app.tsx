import {useState} from 'react'
import {Provider} from 'react-redux'
import Taro, {useDidShow} from "@tarojs/taro";
import 'taro-ui/dist/style/index.scss'

import configStore from './store'
import {login, register} from "./services/user";
import {fetchUserInfo, globalSave, userRegister} from "./actions"

import './app.scss'
import {getJWT, setJWT} from "./services/jwt";
import {userSave} from "./actions/user";

const store = configStore()

function App(props) {

  let [sessionValid, setSessionValid] = useState(false)

  function relogin() {
    // TODO logout

    // relogin
    Taro.login()
      .then(async (res) => {
        if (res.code) {
          console.log('用户登录：登录成功 ' + res.code)

          // send code to Server
          try {
            let resp = await login({
              code: res.code
            })

            // store the login state: JWT and user info
            console.log('用户登录：发送登录请求成功，存储登录状态')
            store.dispatch(userSave({...resp, login: true}))
            setJWT(resp.token)

            if (!resp.binded) {
              // if it is a newcomer, get user info by authorizing
              console.log('用户登录：登录用户未绑定信息，授权获取个人信息并注册')
              store.dispatch(userRegister(resp.openid))
            } else {
              // or get the user info from server
              console.log('用户登录：登录用户已经绑定个人信息')
              store.dispatch(fetchUserInfo())
            }
          } catch (e) {
            console.log('用户登录：发送登录请求失败')
          }
        } else {
          console.log('用户登录：登录失败')
          // TODO handle login failure
        }
      })
  }

  async function handleSessionValid() {
    setSessionValid(true)

    // check JWT
    if (!getJWT()) {
      relogin()
    } else {
      // get current user information from server
      store.dispatch(fetchUserInfo())
    }
  }

  useDidShow(async () => {
    try {
      await Taro.checkSession()
      // session not timeout
      console.log('用户登录：Session有效');
      await handleSessionValid()
    } catch (e) {
      if (!sessionValid) {
        // session timeout
        console.log('用户登录：Session无效，发起登录');
        relogin()
      }
    }

    // store system info
    Taro.getSystemInfo().then((systemInfo) => {
      store.dispatch(globalSave({
        system: systemInfo
      }))
    });
  })

  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  );
}

export default App
