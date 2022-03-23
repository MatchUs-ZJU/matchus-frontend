import {View} from "@tarojs/components";
import {Cell,Image, Tag} from "@taroify/core"
import { Arrow } from "@taroify/icons"
import {personalinfoIcon, identityIcon, consumeIcon, helpIcon, aboutusIcon} from "../../../assets/images";
import Taro from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";

import './index.scss'
import {LoginModal} from "../../../components";
import {globalSave} from "../../../actions";

const User = () => {
  const dispatch = useDispatch()
  const {user, global} = useSelector((state) => state)
  const {nickName, avatarUrl, school, faculty, identified} = user
  const {showLoginModal} = global
  const identitydict = {0:"审核失败",1:'认证中',2:'审核失败',3:'已认证'}

  const onClickMainInfo = () => {
    if (!nickName) {
      dispatch(globalSave({
        showLoginModal: true
      }))
    }
  }

  const onClickOpenSettings = () => {
    if (!nickName) {
      Taro.atMessage({
        type: 'warning',
        message: '您还没有登录哦！',
        duration: 3000
      })
    } else {
      Taro.navigateTo({url: '/pages/user/information/index'})
    }
  }

  const onClickOpenIdentity = () => {
    if (!nickName) {
      Taro.atMessage({
        type: 'warning',
        message: '您还没有登录哦！',
        duration: 3000
      })
    } else {
      // TODO:身份认证页面
      // Taro.navigateTo({url: '/pages/user/index'})
    }
  }

  const onClickOpenRecord = async () => {
    if (!nickName) {
      Taro.atMessage({
        type: 'warning',
        message: '您还没有登录哦！',
        duration: 3000
      })
    } else {
      await Taro.showToast({
        title: "程序猿小哥哥正在开发该功能～",
        duration: 5000,
        icon: 'none'
      })
    }
  }

  return (
    <View className='container'>
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
      <View className='basic-info'>
        <Cell.Group inset>
          <Cell
            icon={<Image src={personalinfoIcon} style={{ width: "1.5rem", height: "1.5rem" }} />}
            title="&nbsp;&nbsp;个人信息"
            rightIcon={<Arrow size='1.5rem'/>}
            clickable
            onClick={onClickOpenSettings}>
            {identitydict[identified]}
          </Cell>
          <Cell
            icon={<Image src={identityIcon} style={{ width: "1.5rem", height: "1.5rem" }} />}
            title="&nbsp;&nbsp;身份记录"
            rightIcon={<Arrow />}
            clickable
            onClick={onClickOpenIdentity}>
          </Cell>
          <Cell
            icon={<Image src={consumeIcon} style={{ width: "1.5rem", height: "1.5rem" }} />}
            title="&nbsp;&nbsp;消费记录"
            rightIcon={<Arrow />}
            clickable
            onClick={onClickOpenRecord}>
          </Cell>
        </Cell.Group>
      </View>
      <View className='help'>
        <Cell.Group inset>
          <Cell
            icon={<Image src={helpIcon} style={{ width: "1.5rem", height: "1.5rem" }} />}
            title="&nbsp;&nbsp;帮助与客服"
            rightIcon={<Arrow />}
            clickable
            onClick={async () => {
              await Taro.navigateTo({url: '/pages/user/help/index'});
            }}>
          </Cell>
          <Cell
            icon={<Image src={aboutusIcon} style={{ width: "1.5rem", height: "1.5rem" }} />}
            title="&nbsp;&nbsp;关于我们"
            rightIcon={<Arrow />}
            clickable
            onClick={async () => {
              await Taro.navigateTo({url: '/pages/user/about/index'});
            }}>
          </Cell>
        </Cell.Group>
      </View>
      <LoginModal opened={showLoginModal} />
    </View>

  )
}

export default User

