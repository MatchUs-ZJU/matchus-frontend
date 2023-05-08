import { View, Text } from "@tarojs/components";
import { Button, Cell, Image, Notify, Popup } from "@taroify/core"
import { Arrow } from "@taroify/icons"
import { ActivityHelp } from "@/assets/images"
import {
  PersonalInfoIcon,
  consumeIcon,
  helpIcon,
  aboutusIcon,
  AnonymousImage,
  SurveyIcon,
  IdentityIcon, CloverIcon, LoveIcon, DoubleLoveIcon
} from "@/assets/images";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchFaculties, fetchPersonInfo, fetchUserInfo, fetchUserProfile } from "@/actions";
import classnames from "classnames";
import { getBadgeInfo, getIdentifiedStatus } from "@/utils/fstring";
import { TOAST_SHOW_TIME } from "@/utils/constant";
import { fetchUserAvatar, fetchVoucherReadInfo } from "@/actions/user";
import './index.scss'

const notifyLoginMessage = '您还没有登录哦'
const notifyIdentifyMessage = '请您先完成用户认证'

const User = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state)
  const { realName, studentNumber, nickName, avatarUrl, faculty, identified, login, userType, isComplete, isChangeable, isOldUser, lucky, luckyPercent, matchTimes, matchSuccessTimes } = user
  // 身份和认证状态
  const badge = getBadgeInfo(identified, userType)
  const identifiedStatus = getIdentifiedStatus(identified)
  // 通知
  const [notifyContent, setNotifyContent] = useState('')
  const [notifyOpen, setNotifyOpen] = useState(false)
  // 幸运值弹窗
  const [luckyPopupOpen, setLuckyPopupOpen] = useState(false)

  useDidShow(async () => {
    await fetchData()
  })

  useShareAppMessage(_ => {
    return {
      title: 'MatchUs - 每个人都在寻找契合的另一块拼图',
      path: 'pages/home/index/index',
    }
  })

  //匹配券
  useEffect(() => {
    dispatch(fetchVoucherReadInfo());
  }, []);

  const isVoucherUnread = useSelector(
    state => state.activity.isVoucherUnread
  );


  async function fetchData() {
    // 如果没有个人信息，先尝试获取
    if (login) {
      dispatch(fetchUserInfo())
      dispatch(fetchPersonInfo())
      dispatch(fetchFaculties())
    }
  }

  const onClickMainInfo = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      await Taro.navigateTo({ url: '/subPackageA/pages/introduction/index' })
    }
  }

  const onClickOpenIdentityInformation = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      setNotifyContent(notifyLoginMessage)
      setNotifyOpen(true)
    } else if (identified === '未认证') {
      setNotifyContent(notifyIdentifyMessage)
      setNotifyOpen(true)
      await Taro.navigateTo({ url: '/subPackageA/pages/introduction/index' })
    } else {
      await Taro.navigateTo({ url: '/pages/user/information/index' })
    }
  }

  const onClickOpenSurveyInfo = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      setNotifyContent(notifyLoginMessage)
      setNotifyOpen(true)
    } else if (identified === '未认证') {
      setNotifyContent(notifyIdentifyMessage)
      setNotifyOpen(true)
      await Taro.navigateTo({ url: '/subPackageA/pages/introduction/index' })
    } else {
      await Taro.navigateTo({ url: '/pages/user/survey-info-edit/index' })
    }
  }

  const onClickOpenPersonalInfo = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      setNotifyContent(notifyLoginMessage)
      setNotifyOpen(true)
    } else if (identified === '未认证') {
      setNotifyContent(notifyIdentifyMessage)
      setNotifyOpen(true)
      await Taro.navigateTo({ url: '/subPackageA/pages/introduction/index' })
    } else {
      await Taro.navigateTo({ url: '/subPackageB/user/personal-info-modify/index' })
      // if (isComplete || isOldUser) {
      //   // await Taro.navigateTo({url: '/subPackageB/user/personal-info-fill/index'})
      //   await Taro.navigateTo({ url: '/subPackageB/user/personal-info-modify/index' })
      // } else if (!isComplete) {
      //   await Taro.navigateTo({ url: '/subPackageB/user/personal-info-fill/index' })
      // }
    }
  }

  const onClickOpenRecord = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      setNotifyContent(notifyLoginMessage)
      setNotifyOpen(true)
    } else if (identified === '未认证') {
      setNotifyContent(notifyIdentifyMessage)
      setNotifyOpen(true)
      // await Taro.navigateTo({ url: '/subPackageA/pages/introduction/index' })
    }
    else {
      await Taro.navigateTo({ url: '/pages/user/wallet/index' })
      dispatch(fetchVoucherReadInfo());
    }
  }

  function onClickAvatar(e) {
    if (login) {
      dispatch(fetchUserAvatar({ avatarUrl: e.detail.avatarUrl, realName, studentNumber }))
    }
  }


  return (
    <View className='container wrapper'>
      <View className='row header' onClick={onClickMainInfo}>
        <Button
          className='col avatar'
          open-type='chooseAvatar'
          onChooseAvatar={onClickAvatar}
        >
          {avatarUrl && avatarUrl.length ? (
            <Image
              className='img'
              shape='circle'
              mode='aspectFit'
              src={avatarUrl}
            />
          ) : (
            <Image
              className='img'
              shape='circle'
              mode='aspectFit'
              src={AnonymousImage}
            />
          )}
        </Button>
        <View className='col info'>
          {nickName ? (
            <>
              <View className='row nickname'>
                {nickName}
                {
                  identified !== '认证失败' &&
                  <View
                    className={classnames('badge',
                      { 'badge-undergraduate': identified === '认证成功' && userType === 1 },
                      { 'badge-graduated': identified === '认证成功' && userType !== 1 },
                      { 'badge-checking': identified === '认证中' },
                      // {'badge-notallow': identified === '认证失败'},
                      { 'badge-notcheck': identified === '未认证' }
                    )}
                  >
                    {badge}
                  </View>
                }
              </View>
              <View className='row faculty' style={{ marginTop: '4px' }}>
                学院：{faculty ? faculty : '暂无信息'}
              </View>
            </>
          ) : (
            <View className='login-text'>登录/注册</View>
          )}
        </View>
      </View>

      {
        nickName &&
        <View className='lucky center-center row'>
          <View className='item row' onClick={() => { setLuckyPopupOpen(!luckyPopupOpen) }}>
            <Image src={CloverIcon} className='item-icon' />
            <View className='item-text'>
              <View className='value'>{lucky ?? 0}{luckyPercent <= 30 && <Text className='value-lower-text'>前{luckyPercent >> 0}%</Text>}</View>
              <View className='text'>幸运值</View>
              <Popup placement="bottom" rounded open={luckyPopupOpen}>
                <Popup.Close />
                <View className='lucky-popup'>
                  <View className='lucky-popup-title'>关于幸运值🍀</View>
                </View>
                <View className='lucky-popup-content'>
                  <View className='lucky-popup-content-text'>幸运值是影响匹配成功率的重要指标，同等匹配条件下</View>
                  <View className='lucky-popup-content-text'>幸运值高的用户能更优先匹配到对象。</View>
                  <View className='lucky-popup-content-title'>「加分操作」</View>
                  <View className='lucky-popup-content-text'> 💟 注册参加活动</View>
                  <View className='lucky-popup-content-text'> 💟 初次完善并经常更新个人信息 </View>
                  <View className='lucky-popup-content-text'> 💟 迟迟没匹配到那个TA </View>
                  <View className='lucky-popup-content-text'> 💟 参加每日一问和双选等活动环节 </View>
                  <View className='lucky-popup-content-title'>「扣分操作」</View>
                  <View className='lucky-popup-content-text'> ⛔️ 上传不符合要求的照片 </View>
                  <View className='lucky-popup-content-text'> ⛔️ 未完成匹配要求填写</View>
                  <View className='lucky-popup-content-text'> ⛔️ 多次匹配成功的幸运儿</View>
                  <View className='lucky-popup-content-text'> ⛔️ 长期不参加活动的老用户</View>
                </View>
              </Popup>
            </View>
          </View>
          <View className='item row'>
            <Image src={LoveIcon} className='item-icon' />
            <View className='item-text'>
              <View className='value'>{matchTimes ?? 0}<Text className='value-lower-text'>次</Text></View>
              <View className='text'>参与匹配</View>
            </View>
          </View>
          <View className='item row'>
            <Image src={DoubleLoveIcon} className='item-icon' />
            <View className='item-text'>
              <View className='value'>{matchSuccessTimes ?? 0}<Text className='value-lower-text'>次</Text></View>
              <View className='text'>匹配成功</View>
            </View>
          </View>
        </View>
      }

      <View className='main'>
        <Cell.Group inset>
          <Cell
            icon={<Image src={IdentityIcon} className='left-icon' />}
            title='身份认证'
            rightIcon={<Arrow size='16' />}
            clickable
            align='center'
            onClick={onClickOpenIdentityInformation}
          >
            <Text style={identified === '认证失败' ? { color: '#DA3F3F' } : {}}>{identifiedStatus}</Text>
          </Cell>
          <Cell
            icon={<Image src={PersonalInfoIcon} className='left-icon' />}
            title='个人信息'
            rightIcon={<Arrow size='16' />}
            align='center'
            clickable
            onClick={onClickOpenPersonalInfo}
          >
            <View className='badge-container'>
              {(!isComplete) && <View className='dot' />}
              <Text>{!isComplete ? '已更新' : (isChangeable ? '去修改' : '')}</Text>
            </View>
          </Cell>
          <Cell
            icon={<Image src={SurveyIcon} className='left-icon' />}
            title='匹配要求'
            rightIcon={<Arrow size='16' />}
            align='center'
            clickable
            onClick={onClickOpenSurveyInfo}
          >
          </Cell>
          <Cell
            icon={<Image src={consumeIcon} className='left-icon' />}
            title='MU钱包'
            rightIcon={<Arrow size='16' />}
            align='center'
            clickable
            onClick={onClickOpenRecord}
          >
            <View className='badge-container'>
              {isVoucherUnread && <View className='dot' />}
              <Text>{isVoucherUnread ? '已更新' : ''}</Text>
            </View>
          </Cell>
        </Cell.Group>
      </View>

      <View className='main'>
        <Cell.Group inset>
          <Cell
            icon={<Image src={helpIcon} className='left-icon' />}
            title='帮助与客服'
            rightIcon={<Arrow size='16' />}
            align='center'
            clickable
            onClick={async () => {
              await Taro.navigateTo({ url: '/pages/user/help/index' });
            }}
          >
          </Cell>
          <Cell
            icon={<Image src={aboutusIcon} className='left-icon' />}
            title='关于我们'
            rightIcon={<Arrow size='16' />}
            clickable
            align='center'
            onClick={async () => {
              await Taro.navigateTo({ url: '/subPackageA/pages/about/index' });
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

