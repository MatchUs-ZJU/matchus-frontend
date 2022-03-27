import {Swiper, SwiperItem, Text, View} from "@tarojs/components";
import Taro, {useDidShow, usePullDownRefresh} from "@tarojs/taro";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Progress, Image} from "@taroify/core"
import {fetchBanners, fetchRecommends} from "@/actions";
import {FeedBackImage, HeartsIcon, TrumpetIcon, TwoPeopleIcon} from "@/assets/images";
import {fetchHomeData} from "@/actions/home";
import {ArticleCard} from "@/components";

import './index.scss'

const Home = () => {
  // store
  const dispatch = useDispatch()
  const {home} = useSelector((state) => state)
  const {articles, banners, data} = home

  const [, setReady] = useState(false);
  const [sighUpEndTimeStr, setSighUpEndTimeStr] = useState('')
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())

  useDidShow(() => {
    setReady(true);
  });

  usePullDownRefresh(() => {
    fetchData()
  })

  // invoke once
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // 处理时间字符串
    if (data) {
      setStartTime(new Date(data.startTime))
      setEndTime(new Date(data.endTime))

      let signUpEndTime = new Date(data.signUpEndTime)
      let year = signUpEndTime.getFullYear()
      let month = signUpEndTime.getMonth()
      let day = signUpEndTime.getDate()
      let hour = signUpEndTime.getHours()
      let period

      if (6 <= hour && hour < 12) {
        period = '早上'
      } else if (hour >= 12 && hour < 18) {
        period = '下午'
      } else {
        period = '晚'
      }

      let processed: string = `${year}.${month}.${day}${period}${hour}点`;
      setSighUpEndTimeStr(processed)
    }
  }, [data])



  function fetchData() {
    dispatch(fetchBanners())
    dispatch(fetchRecommends())
    dispatch(fetchHomeData())
  }

  async function goToSignUp() {
    await Taro.switchTab({
      url: '/pages/activity/index/index'
    })
  }

  return (
    <View className='container default'>
      <View>
        <Swiper
          indicatorColor='#FFF'
          indicatorActiveColor='#918AE3'
          indicatorDots
          circular
          autoplay
          className='banners'
        >
          {banners && banners.length ? (
              <>
                {banners.map((banner, index) => (
                  <SwiperItem
                    key={index}
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{backgroundImage: `url("${banner.url}")`}}
                      className='banner'
                    />
                  </SwiperItem>))

                }
              </>
            ) :
            (
              <>
                <SwiperItem
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{backgroundImage: `url("https://img11.360buyimg.com/babel/s700x360_jfs/t1/4776/39/2280/143162/5b9642a5E83bcda10/d93064343eb12276.jpg!q90!cc_350x180")`}}
                    className='banner'
                  />
                </SwiperItem>
                <SwiperItem
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{backgroundImage: `url("https://img11.360buyimg.com/babel/s700x360_jfs/t1/4776/39/2280/143162/5b9642a5E83bcda10/d93064343eb12276.jpg!q90!cc_350x180")`}}
                    className='banner'
                  />
                </SwiperItem>
                <SwiperItem
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{backgroundImage: `url("https://img11.360buyimg.com/babel/s700x360_jfs/t1/4776/39/2280/143162/5b9642a5E83bcda10/d93064343eb12276.jpg!q90!cc_350x180")`}}
                    className='banner'
                  />
                </SwiperItem>
              </>
            )
          }
        </Swiper>
      </View>
      <View className='section'>
        <View className='section-name'>MatchUs 在浙里</View>
        <View className='row enroll-card'>
          <View className='row main'>
            <View className='col time'>
              <View className='title'>本期活动</View>
              <View className='content'>{startTime.getMonth()}.{startTime.getDate()}-{endTime.getMonth()}.{endTime.getDate()}</View>
            </View>
            <View style='
              border: 1px solid #D9D9D9;
              width: 0px;
              '
            />
            <View className='col data'>
              <View className='title' style={{marginBottom: '4px'}}>
                已报名
                <Text className='title-big' style={{marginLeft: '8px'}}>{data.currentParticipant}</Text>
                <Text className='title-small'>/{data.totalParticipant}</Text>
              </View>
              <Progress
                percent={data.totalParticipant === 0 ? 0 : data.currentParticipant / data.totalParticipant * 100}
                label={false}
                className='progress-color'
                style={{marginBottom: '4px'}}
              />
              <View className='note'>报名截止 {sighUpEndTimeStr}</View>
            </View>
          </View>
          <View className='col button' onClick={goToSignUp}>
            <Text className='button-text'>去报名</Text>
          </View>
        </View>
        <View className='row data-section'>
          <View className='col data-card purple'>
            <Image src={TrumpetIcon} shape='circle' className='icon' />
            <View style={{marginLeft: '12px'}}>
              <View className='title'>
                {!data.term ? 4 : data.term}<Text className='title-small'>期</Text>
              </View>
              <View className='content'>已举办配对活动</View>
            </View>
          </View>
          <View className='col data-card yellow'>
            <Image src={TwoPeopleIcon} shape='circle' className='icon' />
            <View style={{marginLeft: '12px'}}>
              <View className='title'>{!data.matched ? 1800 : data.matched}+</View>
              <View className='content'>配对成功人数</View>
            </View>
          </View>
          <View className='col data-card pink'>
            <Image src={HeartsIcon} shape='circle' className='icon' />
            <View style={{marginLeft: '12px'}}>
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
              <ArticleCard key={index} article={article} />
            ))
          }
        </View>
      </View>
      <View className='section'>
        <View className='section-name'>脱单反馈</View>
        <Image
          lazyLoad
          src={FeedBackImage}
          className='feedback'
          mode='aspectFit'
        />
      </View>
    </View>
  )
}

export default Home
