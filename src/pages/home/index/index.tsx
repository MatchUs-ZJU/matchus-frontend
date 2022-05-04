import {Text, View} from "@tarojs/components";
import {Swiper, Image, Countdown} from "@taroify/core";
import Taro, {useDidShow, usePullDownRefresh, useShareAppMessage} from "@tarojs/taro";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchBanners, fetchRecommends, relogin} from "@/actions";
import {FeedBackImage, HeartsIcon, TrumpetIcon, TwoPeopleIcon} from "@/assets/images";
import {fetchHomeData} from "@/actions/home";
import {fetchResourceImages} from "@/actions/resource";
import {ArticleCard} from "@/components";

import './index.scss'
import {getJWT} from "@/services/jwt";

const Home = () => {
  // store
  const dispatch = useDispatch()
  const {home} = useSelector((state) => state)
  const {articles, banners, data} = home

  const currentTime = new Date().getTime()
  const [, setReady] = useState(false);
  const [activityTime, setActivityTime] = useState('')
  const [countDownTime, setCountDownTime] = useState(0)
  const [countDownType, setCountDownType] = useState<'NOT_START' | 'ACTIVE' | 'FINISHED'>('NOT_START')

  useDidShow(() => {
    setReady(true);
  });

  usePullDownRefresh(() => {
    if(getJWT()) {
      fetchData()
    } else {
      dispatch(relogin(fetchData()))
    }
  })

  useShareAppMessage(_ => {
    return {
      title: 'MatchUs - 每个人都在寻找契合的另一块拼图',
      path: 'pages/home/index/index',
    }
  })

  // invoke once
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // 处理时间字符串
    if (data && data.startTime && data.endTime) {
      const getFormatTime = (time: Date) => {
        return `${time.getMonth() < 9 ? `0${time.getMonth() + 1}` : time.getMonth() + 1}.${time.getDate() < 10 ? `0${time.getDate()}` : time.getDate()}`
      }
      let startTime = new Date(data.startTime)
      let endTime = new Date(data.endTime)
      let start = getFormatTime(startTime)
      let end = getFormatTime(endTime)
      let processed: string = `${start}～${end}`;
      setActivityTime(processed)
    }

    // 处理是否能报名，计算剩余时间
    if (data && data.signUpStartTime && data.signUpEndTime) {
      if (currentTime <= data.signUpStartTime) {
        setCountDownType('NOT_START')
        setCountDownTime(data.signUpStartTime - currentTime)
      } else if (currentTime > data.signUpStartTime && currentTime < data.signUpEndTime) {
        setCountDownType('ACTIVE')
        setCountDownTime(data.signUpEndTime - currentTime)
      } else {
        setCountDownType('FINISHED')
        setCountDownTime(0)
      }
    }
  }, [data])


  function fetchData() {
    dispatch(fetchBanners())
    dispatch(fetchRecommends())
    dispatch(fetchHomeData())
    dispatch(fetchResourceImages())
  }

  async function goToSignUp() {
    await Taro.switchTab({
      url: '/pages/activity/index/index'
    })
  }

  async function goToHelp() {
    await Taro.navigateTo({
      url: '/pages/user/help/index'
    })
  }

  return (
    <View className='container default'>
      <View className='header'>
        <Swiper
          className='banners'
          autoplay={4000}
          lazyRender
        >
          <Swiper.Indicator className='indicator'/>
          {banners &&
            banners
              .filter(banner => banner.shows)
              .map((banner) => (
                <Swiper.Item>
                  <Image
                    src={banner.image}
                    className='img'
                  />
                </Swiper.Item>)
              )
          }
        </Swiper>
      </View>
      <View className='section'>
        <View className='section-name'>MatchUs 在浙里</View>
        <View className='row enroll-card'>
          <View className='row main'>
            <View className='col time'>
              <View className='title'>活动时间</View>
              <View className='content'>{activityTime}</View>
              <View className='note' style={{color: '#918AE3'}}>第{data.currentTerm}期</View>
            </View>
            <View className='divider'/>
            <View className='col data'>
              <View className='title'>
                {countDownType === 'NOT_START' ? '距离报名开始还有' : countDownType === 'ACTIVE' ? '距离报名结束还有' : '活动报名已结束'}
              </View>
              <Countdown
                value={countDownTime}
              >
                {(current) => (
                  <View className='countdown'>
                    <View className='countdown-block'>{current.days < 10 ? `0${current.days}` : current.days}</View>
                    <View className='countdown-colon'>天</View>
                    <View className='countdown-block'>{current.hours < 10 ? `0${current.hours}` : current.hours}</View>
                    <View className='countdown-colon'>时</View>
                    <View className='countdown-block'>{current.minutes < 10 ? `0${current.minutes}` : current.minutes}</View>
                    <View className='countdown-colon'>分</View>
                    <View className='countdown-block'>{current.seconds < 10 ? `0${current.seconds}` : current.seconds}</View>
                    <View className='countdown-colon'>秒</View>
                  </View>
                )}
              </Countdown>
              <View className='note'>已有<Text className='purple'>{data.currentParticipant}+</Text>人报名</View>
            </View>
          </View>
          <View className='col button' onClick={goToSignUp}>
            <Text
              className='button-text'>{countDownType === 'ACTIVE' ? '去报名' : countDownType === 'NOT_START' ? '未开始' : '已结束'}</Text>
          </View>
        </View>
        <View className='row data-section'>
          <View className='col data-card purple'>
            <Image src={TrumpetIcon} shape='circle' className='icon'/>
            <View style={{marginLeft: '12px', position: 'relative', bottom: '2px'}}>
              <View className='title'>
                {!data.totalTerm ? 4 : data.totalTerm}<Text className='title-small'>期</Text>
              </View>
              <View className='content'>已举办配对活动</View>
            </View>
          </View>
          <View className='col data-card yellow'>
            <Image src={TwoPeopleIcon} shape='circle' className='icon'/>
            <View style={{marginLeft: '12px', position: 'relative', bottom: '2px'}}>
              <View className='title'>{!data.matched ? 1800 : data.matched}+</View>
              <View className='content'>配对成功人数</View>
            </View>
          </View>
          <View className='col data-card pink'>
            <Image src={HeartsIcon} shape='circle' className='icon'/>
            <View style={{marginLeft: '12px', position: 'relative', bottom: '2px'}}>
              <View className='title'>{!data.unavailable ? 90 : data.unavailable}+</View>
              <View className='content'>成功脱单人数</View>
            </View>
          </View>
        </View>
      </View>
      <View className='section'>
        <View className='section-name'>
          往期精华
        </View>
        <View className='articles'>
          {
            articles.map((article, index) => (
              <ArticleCard key={index} article={article}/>
            ))
          }
        </View>
      </View>
      <View className='section' style={{margin: 0}}>
        <View className='section-name'>脱单反馈</View>
        <Image
          lazyLoad
          src={FeedBackImage}
          className='feedback'
          mode='aspectFit'
          onClick={goToHelp}
        />
      </View>
    </View>
  )
}

export default Home
