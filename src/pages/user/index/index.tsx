import {View} from "@tarojs/components";
import {Cell, Image, Notify} from "@taroify/core"
import {Arrow} from "@taroify/icons"
import {personalinfoIcon, identityIcon, consumeIcon, helpIcon, aboutusIcon, AnonymousImage} from "@/assets/images";
import Taro from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchUserInfo} from "@/actions";

import './index.scss'

const notifyLoginMessage = '您还没有登录哦'
const notifyIdentifyMessage = '请您先完成用户认证'

const User = () => {
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state)
  const {nickName, avatarUrl, school, faculty, identified, login} = user

  // 通知
  const [notifyContent, setNotifyContent] = useState('')
  const [notifyOpen, setNotifyOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  function fetchData() {
    // 如果没有个人信息，先尝试获取
    if (login) {
      dispatch(fetchUserInfo())
    }
  }

  const onClickMainInfo = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      await Taro.navigateTo({url: '/pages/introduction/index'})
    }
  }

  const onClickOpenPersonalInformation = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      setNotifyContent(notifyLoginMessage)
      setNotifyOpen(true)
    } else if (identified !== '已认证') {
      setNotifyContent(notifyIdentifyMessage)
      setNotifyOpen(true)
      await Taro.navigateTo({url: '/pages/introduction/index'})
    } else {
      await Taro.navigateTo({url: '/pages/user/information/index'})
    }
  }

  const onClickOpenPersonalIdentity = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      setNotifyContent(notifyLoginMessage)
      setNotifyOpen(true)
    } else {
      await Taro.showToast({
        title: "程序猿小哥哥正在开发该功能，本期活动采用人工认证～",
        duration: 5000,
        icon: 'none'
      })
    }
  }

  const onClickOpenRecord = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      setNotifyContent(notifyLoginMessage)
      setNotifyOpen(true)
    } else {
      await Taro.showToast({
        title: "程序猿小哥哥正在开发该功能～",
        duration: 5000,
        icon: 'none'
      })
    }
  }

  return (
    <View className='container wrapper'>
      <View className='row header' onClick={onClickMainInfo}>
        <View className='col avatar'>
          {avatarUrl && avatarUrl.length ? (
            <Image
              shape='circle'
              mode='aspectFit'
              lazyLoad
              src={avatarUrl}
              className='avatar-img'
            />
          ) : (
            <Image
              shape='circle'
              mode='aspectFit'
              lazyLoad
              src={AnonymousImage}
              className='avatar-img'
            />
          )}
        </View>
        <View className='col info'>
          {nickName ? (
            <>
              <View className='row nickname'>
                {nickName}
              </View>
              <View className='row faculty' style={{marginTop: '4px'}}>
                学院：{faculty ? faculty : '暂无信息'}
              </View>
            </>
          ) : (
            <View className='login-text'>登录/注册</View>
          )}
        </View>
      </View>

      <View className='main'>
        <Cell.Group inset>
          <Cell
            icon={<Image src={personalinfoIcon} className='left-icon'/>}
            title='个人信息'
            rightIcon={<Arrow size='16'/>}
            clickable
            align='center'
            onClick={onClickOpenPersonalInformation}
          >
            {identified}
          </Cell>
          <Cell
            icon={<Image src={identityIcon} className='left-icon'/>}
            title='身份认证'
            rightIcon={<Arrow size='16'/>}
            align='center'
            clickable
            onClick={onClickOpenPersonalIdentity}
          >
          </Cell>
          <Cell
            icon={<Image src={consumeIcon} className='left-icon'/>}
            title='消费记录'
            rightIcon={<Arrow size='16'/>}
            align='center'
            clickable
            onClick={onClickOpenRecord}
          >
          </Cell>
        </Cell.Group>
      </View>

      <View className='main'>
        <Cell.Group inset>
          <Cell
            icon={<Image src={helpIcon} className='left-icon'/>}
            title='帮助与客服'
            rightIcon={<Arrow size='16'/>}
            align='center'
            clickable
            onClick={async () => {
              await Taro.navigateTo({url: '/pages/user/help/index'});
            }}
          >
          </Cell>
          <Cell
            icon={<Image src={aboutusIcon} className='left-icon'/>}
            title='关于我们'
            rightIcon={<Arrow size='16'/>}
            clickable
            align='center'
            onClick={async () => {
              await Taro.navigateTo({url: '/pages/user/about/index'});
            }}
          >
          </Cell>
        </Cell.Group>
      </View>
      <Notify
        id='notify'
        open={notifyOpen}
        duration={2000}
        color='warning'
        onClose={() => setNotifyOpen(false)}
      >{notifyContent}</Notify>
    </View>

  )
}

export default User

