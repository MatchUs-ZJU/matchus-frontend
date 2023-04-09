import {View, Text} from "@tarojs/components";
<<<<<<< HEAD
import {Button,Cell, Image, Notify} from "@taroify/core"
=======
import {Badge, Cell, Image, Notify} from "@taroify/core"
>>>>>>> 4961d387d87eacff51bc75f0ed5b3293c2213e77
import {Arrow} from "@taroify/icons"
import {
  PersonalInfoIcon,
  consumeIcon,
  helpIcon,
  aboutusIcon,
  AnonymousImage,
  SurveyIcon,
  IdentityIcon, LoveExperience, MatchCount
} from "@/assets/images";
import Taro, {useDidShow, useShareAppMessage} from "@tarojs/taro";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
<<<<<<< HEAD
import {fetchFaculties, fetchPersonInfo, fetchUserInfo, fetchUserProfile} from "@/actions";
import classnames from "classnames";
import {getBadgeInfo, getIdentifiedStatus} from "@/utils/fstring";
import {TOAST_SHOW_TIME} from "@/utils/constant";
import {fetchUserAvatar} from "@/actions/user";
=======
import {fetchUserInfo} from "@/actions";
import classnames from "classnames";
import {getBadgeInfo, getIdentifiedStatus} from "@/utils/fstring";
import {TOAST_SHOW_TIME} from "@/utils/constant";
import {fetchPersonInfo} from "@/actions/user";

import {checkRequired} from "@/utils/fcheck";
>>>>>>> 4961d387d87eacff51bc75f0ed5b3293c2213e77
import './index.scss'

const notifyLoginMessage = '您还没有登录哦'
const notifyIdentifyMessage = '请您先完成用户认证'

const User = () => {
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state)
<<<<<<< HEAD
  const {realName,studentNumber,nickName,avatarUrl, faculty, identified, login, userType, isComplete, isChangeable, isOldUser, lucky, luckyPercent, matchTimes, matchSuccessTimes} = user
=======
  const {nickName, avatarUrl, faculty, identified, login, userType, isComplete,isChangeable,isOldUser} = user

>>>>>>> 4961d387d87eacff51bc75f0ed5b3293c2213e77
  // 身份和认证状态
  const badge = getBadgeInfo(identified, userType)
  const identifiedStatus = getIdentifiedStatus(identified)
  // 通知
  const [notifyContent, setNotifyContent] = useState('')
  const [notifyOpen, setNotifyOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useDidShow(async ()=>{
    await fetchData()
  })

  useShareAppMessage(_ => {
    return {
      title: 'MatchUs - 每个人都在寻找契合的另一块拼图',
      path: 'pages/home/index/index',
    }
  })

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
      await Taro.navigateTo({url: '/subPackageA/pages/introduction/index'})
    }
  }

  const onClickOpenIdentityInformation = async () => {
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      setNotifyContent(notifyLoginMessage)
      setNotifyOpen(true)
    } else if (identified === '未认证') {
      setNotifyContent(notifyIdentifyMessage)
      setNotifyOpen(true)
      await Taro.navigateTo({url: '/subPackageA/pages/introduction/index'})
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
      await Taro.navigateTo({url: '/subPackageA/pages/introduction/index'})
    } else {
      await Taro.navigateTo({url: '/pages/user/survey-info-edit/index'})
    }
  }

  const onClickOpenPersonalInfo = async ()=>{
    if (!nickName || !avatarUrl || !avatarUrl.length) {
      setNotifyContent(notifyLoginMessage)
      setNotifyOpen(true)
    } else if (identified === '未认证') {
      setNotifyContent(notifyIdentifyMessage)
      setNotifyOpen(true)
<<<<<<< HEAD
      await Taro.navigateTo({url: '/subPackageA/pages/introduction/index'})
    } else {
      if (isComplete || isOldUser) {
        // await Taro.navigateTo({url: '/subPackageB/user/personal-info-fill/index'})
        await Taro.navigateTo({url: '/subPackageB/user/personal-info-modify/index'})
      } else if (!isComplete) {
        await Taro.navigateTo({url: '/subPackageB/user/personal-info-fill/index'})
=======
      await Taro.navigateTo({url: '/pages/introduction/index'})
    } else{
      if(isComplete || isOldUser){
        await Taro.navigateTo({url: '/pages/user/personal-info-modify/index'})
      }
      else if(!isComplete){
        await Taro.navigateTo({url: '/pages/user/personal-info-fill/index'})
>>>>>>> 4961d387d87eacff51bc75f0ed5b3293c2213e77
      }
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

  function onClickAvatar(e){
    if(login){
      dispatch(fetchUserAvatar({avatarUrl:e.detail.avatarUrl, realName, studentNumber}))
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
            icon={<Image src={IdentityIcon} className='left-icon'/>}
            title='身份认证'
            rightIcon={<Arrow size='16'/>}
            clickable
            align='center'
            onClick={onClickOpenIdentityInformation}
          >
            <Text style={identified === '认证失败' ? {color: '#DA3F3F'} : {}}>{identifiedStatus}</Text>
          </Cell>

          <Cell
            icon={<Image src={PersonalInfoIcon} className='left-icon'/>}
            title='个人信息'
            rightIcon={<Arrow size='16'/>}
            align='center'
            clickable
            onClick={onClickOpenPersonalInfo}
          >
            <View className='badge-container'>
              {(!isComplete) && <View className='dot'/>}
              <Text>{!isComplete?'去填写':(isChangeable?'去修改':'')}</Text>
            </View>
          </Cell>

          <Cell
            icon={<Image src={SurveyIcon} className='left-icon'/>}
            title='匹配要求'
            rightIcon={<Arrow size='16'/>}
            align='center'
            clickable
            onClick={onClickOpenSurveyInfo}
          >
            {/*<View className='value'>*/}
            {/*  /!*<View className='dot'/>*!/*/}
            {/*  <Text>{user.surveyInfo?}去修改</Text>*/}
            {/*</View>*/}

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
              await Taro.navigateTo({url: '/subPackageA/pages/about/index'});
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

