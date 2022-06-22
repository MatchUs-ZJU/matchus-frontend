import {View, Text} from "@tarojs/components";
import {Cell, Image, Notify} from "@taroify/core"
import {Arrow} from "@taroify/icons"
import {
  PersonalInfoIcon,
  consumeIcon,
  helpIcon,
  aboutusIcon,
  AnonymousImage,
  SurveyIcon
} from "@/assets/images";
import Taro, {useShareAppMessage} from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchUserInfo} from "@/actions";
import classnames from "classnames";
import {getBadgeInfo, getIdentifiedStatus} from "@/utils/fstring";
import {TOAST_SHOW_TIME} from "@/utils/constant";

import './index.scss'

const notifyLoginMessage = '您还没有登录哦'
const notifyIdentifyMessage = '请您先完成用户认证'

const User = () => {
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state)
  const {nickName, avatarUrl, faculty, identified, login, userType} = user

  // 身份和认证状态
  const badge = getBadgeInfo(identified, userType)
  const identifiedStatus = getIdentifiedStatus(identified)
  // 通知
  const [notifyContent, setNotifyContent] = useState('')
  const [notifyOpen, setNotifyOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useShareAppMessage(_ => {
    return {
      title: 'MatchUs - 每个人都在寻找契合的另一块拼图',
      path: 'pages/home/index/index',
    }
  })

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
    } else if (identified === '未认证') {
      setNotifyContent(notifyIdentifyMessage)
      setNotifyOpen(true)
      await Taro.navigateTo({url: '/pages/introduction/index'})
    } else {
      await Taro.navigateTo({url: '/pages/user/information/index'})
    }
  }

  const onClickOpenSurveyInfo = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      setNotifyContent(notifyLoginMessage)
      setNotifyOpen(true)
    } else if (identified === '未认证') {
      setNotifyContent(notifyIdentifyMessage)
      setNotifyOpen(true)
      await Taro.navigateTo({url: '/pages/introduction/index'})
    } else {
      await Taro.navigateTo({url: '/pages/user/survey-info/index'})
    }
  }

  const onClickOpenRecord = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      setNotifyContent(notifyLoginMessage)
      setNotifyOpen(true)
    } else {
      await Taro.showToast({
        title: "程序猿小哥哥正在开发该功能～",
        duration: TOAST_SHOW_TIME,
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
              src={avatarUrl}
            />
          ) : (
            <Image
              shape='circle'
              mode='aspectFit'
              src={AnonymousImage}
            />
          )}
        </View>
        <View className='col info'>
          {nickName ? (
            <>
              <View className='row nickname'>
                {nickName}
                {
                  identified !== '认证失败' &&
                  <View
                    className={classnames('badge',
                      {'badge-undergraduate': identified === '认证成功' && userType === 1},
                      {'badge-graduated': identified === '认证成功' && userType !== 1},
                      {'badge-checking': identified === '认证中'},
                      {'badge-notallow': identified === '认证失败'},
                      {'badge-notcheck': identified === '未认证'}
                    )}
                  >
                    {badge}
                  </View>
                }
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
            icon={<Image src={PersonalInfoIcon} className='left-icon'/>}
            title='身份认证信息'
            rightIcon={<Arrow size='16'/>}
            clickable
            align='center'
            onClick={onClickOpenPersonalInformation}
          >
            <Text style={identified === '认证失败' ? {color: '#DA3F3F'} : {}}>{identifiedStatus}</Text>
          </Cell>
          <Cell
            icon={<Image src={SurveyIcon} className='left-icon'/>}
            title='问卷匹配信息'
            rightIcon={<Arrow size='16'/>}
            align='center'
            clickable
            onClick={onClickOpenSurveyInfo}
          >
            {/*{*/}
            {/*  identified === '认证成功' &&*/}
            {/*  <View className='badge-container'>*/}
            {/*    <Badge dot className='badge'/>*/}
            {/*  </View>*/}
            {/*}*/}
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

