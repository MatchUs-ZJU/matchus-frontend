import {View, Image} from "@tarojs/components";
import {
  ChooseResultTopImageSuccess,
  ChooseResultFootImageSuccess,
  ChooseResultTopImageFailure,
  ChooseResultFootImageFailure
} from "@/assets/images";
import {Divider} from "@taroify/core";
import {ArrowLeft} from "@taroify/icons";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchTwcResult} from "@/actions";
import {getFormatNickname} from "@/utils/fstring";
import Taro from "@tarojs/taro";
import {viewImages} from "@/utils/taro-utils";
import './index.scss';

interface SuccessPageProps {
  male: {
    realName: string,
    avatarUrl: string
  },
  female: {
    realName: string,
    avatarUrl: string
  },
  message: string,
  info: {
    index: number,
    key: string,
    value: string
  }[]
}

interface FailurePageProps {
  male: {
    realName: string,
    avatarUrl: string
  },
  female: {
    realName: string,
    avatarUrl: string
  },
  message: string,
}

const SuccessPage = (props: SuccessPageProps) => {

  const {male, female, message, info} = props
  const {contactUsUrl} = useSelector(state => state.resource.images)

  return (
    <>
      <View className='background-success col'>
        <Image src={ChooseResultTopImageSuccess} className='top-img-success'/>
        <View className='content-top'>
          <View className='nickName male'>{getFormatNickname(male.realName)} </View>
          <View className='nickName female'>{getFormatNickname(female.realName)}</View>
        </View>
      </View>
      <View className='wrapper col'>
        <View className='content'>
          <Divider style={{color: "#918AE3", borderColor: "#918AE3"}}>Ta的态度</Divider>
          {info && info.length ?
            info
              .sort((o1, o2) => {
                return o1.index - o2.index
              })
              .map((item, _) => {
                return (
                  <View className='item'>
                    <View className='title'>{item.key}</View>
                    <View className='answer'>{item.value}</View>
                  </View>
                )
              })
            : <></>
          }
          <Divider style={{color: "#918AE3", borderColor: "#918AE3"}}>Ta的留言</Divider>
          <View className='item'>
            {(!message || message === '')
              ? (<View className='title'>Ta没有留言...</View>)
              : (<View className='answer'>{message}</View>)}
          </View>
        </View>
        <View className='footer-container-success'>
          <View className='footer-top'>
            <Image src={ChooseResultFootImageSuccess} className='img' />
            <View className='title'>恭喜你们双选成功，听说宝石山的夜景很美，不如一起去看看吧！</View>
          </View>
          <View className='footer-bottom row'>
            <View className='left'>
              <View className='title'>欢迎随时和小助手分享你们的美好回忆～</View>
              <View className='note'>脱单成功记得来找小助手领奖哦!</View>
            </View>
            <View className='right'>
              <Image className='contactus-img' src={contactUsUrl} onClick={() => viewImages([contactUsUrl])}/>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}

const FailurePage = (props: FailurePageProps) => {

  const {male, female, message} = props
  const {contactUsUrl} = useSelector(state => state.resource.images)

  return (
    <>
      <View className='background-fail col'>
        <Image src={ChooseResultTopImageFailure} className='top-img-fail'/>
        <View className='content-top'>
          <View className='nickName male'>{getFormatNickname(male.realName)} </View>
          <View className='nickName female'>{getFormatNickname(female.realName)}</View>
        </View>
      </View>
      <View className='wrapper-fail col'>
        <View className='content'>
          <Divider style={{color: "#918AE3", borderColor: "#918AE3"}} className='divider'>Ta的留言</Divider>
          <View className='item'>
            {(!message || message === '')
              ? (<View className='title'>Ta没有留言...</View>)
              : (<View className='answer'>{message}</View>)}
          </View>
        </View>
        <View className='footer-container-failure'>
          <View className='footer col'>
            <View className='title'>别灰心，继续勇敢的追求爱情，相信缘分一定正在来的路上！</View>
            <View className='note'>欢迎随时来找小助手寻求安慰～</View>
            <View className='contactus col'>
              <Image className='contactus-img' src={contactUsUrl} onClick={() => viewImages([contactUsUrl])} />
              <View className='contactus-note'>小助手微信</View>
            </View>
          </View>
          <Image src={ChooseResultFootImageFailure} className='footer-img' />
        </View>
      </View>
    </>
  )
}

const Index = () => {
  const dispatch = useDispatch()
  const {activity, choose} = useSelector(state => state)

  useEffect(() => {
    fetchData()
  }, [])

  function fetchData() {
    dispatch(fetchTwcResult(activity.id))
  }

  async function navigateBack() {
    await Taro.navigateBack()
  }

  return (
    <View className='container'>
      <View className='custom-back' onClick={navigateBack}>
        <ArrowLeft size='24px' style={{marginRight: '8px'}}/>
        双选结果
      </View>
      {
        choose.success ?
          <SuccessPage
            male={choose.male}
            female={choose.female}
            message={choose.message}
            info={choose.info}
          /> :
          <FailurePage
            male={choose.male}
            female={choose.female}
            message={choose.message}
          />
      }
    </View>
  )
}

export default Index;

