import {useState} from 'react'
import {Provider} from 'react-redux'
import Taro, {useDidShow} from "@tarojs/taro";
// taro-ui
import 'taro-ui/dist/style/index.scss'

import configStore from './store'
import {getUserInfo as fetchUserInfo, login} from "./services/user";
import {saveGlobal} from "./actions"

import './app.scss'
import {getJWT, setJWT} from "./services/jwt";
import {saveInfo} from "./actions/user";

const store = configStore()

function App(props) {

  let [sessionValid, setSessionValid] = useState(false)

  //
  // let getUserInfo = async () => {
  //   // check JWT
  //   if (!getJWT()) {
  //     console.log('JWT missed.')
  //     login()
  //     return
  //   }
  //
  //   // fetch user info
  //   try {
  //     let data = await fetchUserInfo();
  //     dispatch({
  //       type: USER_UPDATE,
  //       payload: data
  //     })
  //   } catch (e) {
  //     console.log("Fetch UserInfo failed.")
  //   }
  // }
  //
  // let login = () => {
  //
  // }

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
            setJWT(resp.token)
            store.dispatch(saveInfo(resp))
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
      let resp = fetchUserInfo()
        .then((res) => {
          console.log('用户登录：获取用户信息成功')
          store.dispatch(saveInfo(res))
          return res
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }

  useDidShow(async () => {
    try {
      await Taro.checkSession()

      // session not timeout
      console.log('用户登录：Session有效');
      handleSessionValid()
    } catch (e) {
      if (!sessionValid) {
        // session timeout
        console.log('用户登录：Session失效 => 发起登录');
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
