import {useState} from 'react'
import {Provider} from 'react-redux'
import Taro, {useDidShow} from "@tarojs/taro";
import 'taro-ui/dist/style/index.scss'

import configStore from './store'
import {getUserInfo, login, register} from "./services/user";
import {saveGlobal} from "./actions"

import './app.scss'
import {getJWT, setJWT} from "./services/jwt";
import {saveUserInfo} from "./actions/user";

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
            store.dispatch(saveUserInfo({...resp, login: true}))
            setJWT(resp.token)

            if (!resp.binded) {
              // if it is a newcomer, get user info by authorizing
              console.log('用户登录：登录用户未绑定信息，授权获取个人信息')
              try {
                const {userInfo} = await Taro.getUserInfo()
                console.log(userInfo)
                // store user info
                store.dispatch(saveUserInfo(userInfo))

                // register
                await register({
                  ...userInfo,
                  'openid': resp.openid
                })
              } catch (e) {
                Taro.showToast({
                  icon: 'none',
                  title: '授权失败! 您将无法参加我们的活动',
                  duration: 5000,
                });
              }
            } else {
              // or get the user info from server
              console.log('用户登录：登录用户已经绑定个人信息，从服务器获取个人信息')
              try {
                const userInfo = await getUserInfo()
                console.log(userInfo)
                // restore user info
                store.dispatch(saveUserInfo(userInfo))
              } catch (e) {
                console.log('用户登录：从服务器获取个人信息失败')
              }
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
      console.log('用户登录：从服务器获取用户信息')
      try {
        const userInfo = await getUserInfo()
        console.log('用户登录：获取用户信息成功')
        store.dispatch(saveUserInfo(userInfo))
      } catch (e) {
        console.log('用户登录：从服务器获取个人信息失败')
      }
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
        console.log('用户登录：Sessionw无效，发起登录');
        relogin()
      }
    }

    // store system info
    Taro.getSystemInfo().then((systemInfo) => {
      console.log(systemInfo)
      store.dispatch(saveGlobal(systemInfo))
    });
  })

  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  );
}

export default App
