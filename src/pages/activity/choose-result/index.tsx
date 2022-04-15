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
import './index.scss';

interface SuccessPageProps {
  male: {
    nickName: string,
    avatarUrl: string
  },
  female: {
    nickName: string,
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
    nickName: string,
    avatarUrl: string
  },
  female: {
    nickName: string,
    avatarUrl: string
  },
  message: string,
}

const SuccessPage = (props: SuccessPageProps) => {

  const {male, female, message, sanguan} = props

  return (
    <>
      <View className='background-success col'>
        <Image src={ChooseResultTopImageSuccess} className='top-img-success'/>
        <View className='content-top'>
          <View className='nickName male'>{getFormatNickname(male.nickName)} </View>
          <View className='nickName female'>{getFormatNickname(female.nickName)}</View>
        </View>
      </View>
      <View className='wrapper col'>
        <View className='content'>
          <Divider style={{color: "#918AE3", borderColor: "#918AE3"}}>Ta的三观</Divider>
          {sanguan && sanguan.length ?
            sanguan
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
        <View className='footer'>
          <Image src={ChooseResultFootImageSuccess} className='footer-img' mode='aspectFit'/>
        </View>
      </View>
    </>
  )
}

const FailurePage = (props: FailurePageProps) => {

  const {male, female, message} = props

  return (
    <>
      <View className='background-fail col'>
        <Image src={ChooseResultTopImageFailure} className='top-img-fail'/>
        <View className='content-top'>
          <View className='nickName male'>{getFormatNickname(male.nickName)} </View>
          <View className='nickName female'>{getFormatNickname(female.nickName)}</View>
        </View>
      </View>
      <View className='wrapper-fail col'>
        <View className='content'>
          <Divider style={{color: "#918AE3", borderColor: "#918AE3"}}>Ta的留言</Divider>
          <View className='item'>
            {(!message || message === '')
              ? (<View className='title'>Ta没有留言...</View>)
              : (<View className='answer'>{message}</View>)}
          </View>
        </View>
        <View className='footer'>
          <Image src={ChooseResultFootImageFailure} className='footer-img' mode='aspectFit' />
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

