import {View, Image} from "@tarojs/components";
import {AtIcon, AtList, AtListItem, AtMessage} from "taro-ui";
import Taro from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";

import './index.scss'
import {LoginModal} from "../../components";
import {saveGlobal} from "../../actions";


const User = () => {
  const dispatch = useDispatch()
  const {user, global} = useSelector((state) => state)
  const {nickName, avatarUrl, school, faculty} = user
  const {showLoginModal} = global

  const onClickOpenSettings = () => {
    if (!nickName) {
      Taro.atMessage({
        type: 'warning',
        message: '您还没有登录哦！',
        duration: 3000
      })
    } else {
      Taro.navigateTo({url: '/pages/user/information'})
    }
  }

  const onClickMainInfo = () => {
    if (!nickName) {
      dispatch(saveGlobal({
        showLoginModal: true
      }))
    }
  }

  return (
    <View className='container'>
      <AtMessage />
      <View className='main-info' onClick={onClickMainInfo}>
        <View className='at-row'>
          <View className='at-col-3'>
            <View className='avatar'>
              {nickName ? (
                <Image
                  src={avatarUrl}
                  className='avatar-img'
                  style={{width: '100%', height: '100%'}}
                />
              ) : (
                <AtIcon value='anonymous' prefixClass='kf' className='avatar-anonymous' />
              )}
            </View>
          </View>
          <View className='at-col-9' style={{display: 'flex', alignItems: 'center'}}>
            {nickName ? (
              <View>
                <View className='nickname'>{nickName}</View>
                <View className='at-row note' style={{marginTop: '4px'}}>
                  <View style={{marginRight: '4px'}}>{school}</View>
                  <View className='at-col-auto'>{faculty}</View>
                </View>
              </View>
            ) : (
              <View className='login-text'>登录/注册</View>
            )}
          </View>
        </View>
      </View>
      <View style={{marginTop: '32px'}}>
        <AtList hasBorder={false}>
          <AtListItem
            className='list-item'
            title='个人信息'
            arrow='right'
            iconInfo={{value: 'settings', size: 18}}
            onClick={onClickOpenSettings}
          />
          <AtListItem
            className='list-item'
            title='关于我们'
            arrow='right'
            iconInfo={{value: 'help', size: 18}}
            onClick={async () => {
              await Taro.navigateTo({url: '/pages/about/index'});
            }}
          />
        </AtList>
      </View>
      <LoginModal opened={showLoginModal} />
    </View>

  )
}

export default User

