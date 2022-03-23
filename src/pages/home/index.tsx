import {Swiper, SwiperItem, Text, View} from "@tarojs/components";
import {useDidShow} from "@tarojs/taro";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Progress, Image} from "@taroify/core"
import { Like } from "@taroify/icons"
import {fetchBanners, fetchRecommends} from "@/actions";
import {FeedBackImage, HeartsIcon, PlaceholderIcon, TrumpetIcon, TwoPeopleIcon} from "@/assets/images";

import './index.scss'

const Home = () => {
  // store
  const dispatch = useDispatch()
  const {user, home, global} = useSelector((state) => state)
  const {recommends, banners} = home

  const [ready, setReady] = useState(false);

  useDidShow(() => {
    setReady(true);
  });

  // invoke once
  useEffect(() => {
    dispatch(fetchBanners())
    dispatch(fetchRecommends())
  }, [])

  return (
    <View className='container default'>
      <View>
        <Swiper
          indicatorColor='rgba(255,255,255,0.3）'
          indicatorActiveColor='000'
          indicatorDots
          circular
          autoplay
          className='banners'
        >
          {banners.length ? (
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
              <View className='content'>03.28-04.06</View>
            </View>
            <View style='
              border: 1px solid #D9D9D9;
              width: 0px;
              '
            />
            <View className='col data'>
              <View className='title' style={{marginBottom: '4px'}}>
                已报名
                <Text className='title-big' style={{marginLeft: '8px'}}>89</Text>
                <Text className='title-small'>/700</Text>
              </View>
              <Progress percent={20} label={false} className='progress-color' style={{marginBottom: '4px'}} />
              <View className='note'>报名截止2022.03.25晚23点</View>
            </View>
          </View>
          <View className='col button'>
            <Text className='button-text'>去报名</Text>
          </View>
        </View>
        <View className='row data-section'>
          <View className='col data-card purple'>
            <Image src={TrumpetIcon} shape='circle' className='icon' />
            <View style={{marginLeft: '12px'}}>
              <View className='title'>
                4<Text className='title-small'>期</Text>
              </View>
              <View className='content'>已举办配对活动</View>
            </View>
          </View>
          <View className='col data-card yellow'>
            <Image src={TwoPeopleIcon} shape='circle' className='icon' />
            <View style={{marginLeft: '12px'}}>
              <View className='title'>1800+</View>
              <View className='content'>配对成功人数</View>
            </View>
          </View>
          <View className='col data-card pink'>
            <Image src={HeartsIcon} shape='circle' className='icon' />
            <View style={{marginLeft: '12px'}}>
              <View className='title'>80+</View>
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
          <View className='row article-card'>
            <Image
              lazyLoad
              src={PlaceholderIcon}
              className='img'
              mode='center'
            />
            <View className='col detail'>
              <View className='title'>线下回顾｜遇上对的人，每天都是情人节</View>
              <View className='desc'>一句话描述</View>
              <View className='row' style='align-item: center; width: 100%'>
                <Text className='col tag'>#撒糖</Text>
                <View className='row date'>
                  <Like style={{ color: "#FF6C90", margin: "0 8px 0 0"}} />
                  <Text>2021.12.05</Text>
                </View>
              </View>
            </View>
          </View>
          <View className='row article-card'>
            <Image
              lazyLoad
              src={PlaceholderIcon}
              className='img'
              mode='center'
            />
            <View className='col detail'>
              <View className='title'>线下回顾｜遇上对的人，每天都是情人节</View>
              <View className='desc'>一句话描述</View>
              <View className='row' style='align-item: center; width: 100%'>
                <Text className='col tag'>#撒糖</Text>
                <View className='row date'>
                  <Like style={{ color: "#FF6C90", margin: "0 8px 0 0"}} />
                  <Text>2021.12.05</Text>
                </View>
              </View>
            </View>
          </View>
          <View className='row article-card'>
            <Image
              lazyLoad
              src={PlaceholderIcon}
              className='img'
              mode='center'
            />
            <View className='col detail'>
              <View className='title'>线下回顾｜遇上对的人，每天都是情人节</View>
              <View className='desc'>一句话描述</View>
              <View className='row' style='align-item: center; width: 100%'>
                <Text className='col tag'>#撒糖</Text>
                <View className='row date'>
                  <Like style={{ color: "#FF6C90", margin: "0 8px 0 0"}} />
                  <Text>2021.12.05</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className='section'>
        <View className='section-name'>脱单反馈</View>
        <Image
          lazyLoad
          src={FeedBackImage}
          className='feedback'
          mode='center'
        />
      </View>
    </View>
  )
}

export default Home
