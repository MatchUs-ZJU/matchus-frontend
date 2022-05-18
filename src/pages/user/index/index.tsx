import {View, Text} from "@tarojs/components";
import {Badge, Cell, Image, Notify} from "@taroify/core"
import {Arrow} from "@taroify/icons"
import {
  personalinfoIcon,
  identityIcon,
  consumeIcon,
  helpIcon,
  aboutusIcon,
  AnonymousImage,
  surveyIcon
} from "@/assets/images";
import Taro, {useShareAppMessage} from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchUserInfo} from "@/actions";
import classnames from "classnames";
import {getBadgeInfo, getIdentifiedStatus} from "@/utils/fstring";

import './index.scss'
import {TOAST_SHOW_TIME} from "@/utils/constant";

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
    //TODO
    // if (!nickName || !avatarUrl || !avatarUrl.length) {
    //   setNotifyContent(notifyLoginMessage)
    //   setNotifyOpen(true)
    // } else if (identified === '未认证') {
    //   setNotifyContent(notifyIdentifyMessage)
    //   setNotifyOpen(true)
    //   await Taro.navigateTo({url: '/pages/introduction/index'})
    // } else {
      await Taro.navigateTo({url: '/pages/user/information/index'})
    // }
  }

  const onClickOpenSurveyInfo = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      setNotifyContent(notifyLoginMessage)
      setNotifyOpen(true)
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
              src={avatarUrl}
              className='avatar-img'
            />
          ) : (
            <Image
              shape='circle'
              mode='aspectFit'
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
                <View className={classnames('badge',
                  {'badge-undergraduate': identified === '认证成功' && userType === 1},
                  {'badge-graduated': identified === '认证成功' && userType !== 1},
                  {'badge-checking': identified === '认证中'},
                  {'badge-notallow': identified === '认证失败'},
                  {'badge-notcheck': identified === '未认证'}
                )}>
                  {badge}
                </View>
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
            <Text style={identified === '认证失败' ? {color: '#DA3F3F'} : {}}>{identifiedStatus}</Text>
          </Cell>
          <Cell
            icon={<Image src={surveyIcon} className='left-icon'/>}
            title='问卷信息'
            rightIcon={<Arrow size='16'/>}
            align='center'
            clickable
            onClick={onClickOpenSurveyInfo}
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

