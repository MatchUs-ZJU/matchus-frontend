import {Swiper, SwiperItem, View, Image} from "@tarojs/components";
import {useDidShow} from "@tarojs/taro";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import './index.scss'
import {sugarIcon} from '../../assets/images'
import {fetchBanners, fetchRecommends} from "../../actions";

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
    <View className='container'>
      <View className='background'/>
      <View className='wrapper'>
        <View className='header' style={{height: '100px'}}>
          {/* header */}
          {/*<View*/}
          {/*  style={{*/}
          {/*    marginTop: '50px',*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Image src={headerLogo} className='logo'/>*/}
          {/*</View>*/}
          <View/>
        </View>
        <View className='default'>
          {/* swiper */}
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
          {/* activity */}
          <View>
            <View className='section-name'>活动进行中</View>
          </View>
          {/* recommend contents */}
          <View>
            <View className='section-name'>往期精华</View>
            <View className='contents'>
              <View className='content'>
                <Image src={sugarIcon} className='content-img'/>
                <View className='content-title'>撒糖专栏｜我喜欢你，纸短情长</View>
                <View className='content-date'>2021/12/29</View>
              </View>
              <View className='content'>
                <Image src={sugarIcon} className='content-img'/>
                <View
                  className='content-title'>撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长v撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长</View>
                <View className='content-date'>2021/12/29</View>
              </View>
              <View className='content'>
                <Image src={sugarIcon} className='content-img'/>
                <View
                  className='content-title'>撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长</View>
                <View className='content-date'>2021/12/29</View>
              </View>
              <View className='content'>
                <Image src={sugarIcon} className='content-img'/>
                <View
                  className='content-title'>撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长撒糖专栏｜我喜欢你，纸短情长</View>
                <View className='content-date'>2021/12/29</View>
              </View>
            </View>
          </View>
        </View>
      </View>

    </View>
  )
}

export default Home

