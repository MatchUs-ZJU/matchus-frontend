import {View} from "@tarojs/components";
import {MatchResultTopImage, CopyIcon, AnonymousImage, LockedIcon} from "@/assets/images";
import {Button, Rate, Image, Countdown} from "@taroify/core"
import {ArrowLeft, Like, LikeOutlined} from '@taroify/icons';
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchMatchResult, sendSatisfiedFeedback} from "@/actions";
import Taro from "@tarojs/taro";
import {viewImages} from "@/utils/taro-utils";
import {getFormatNickname} from "@/utils/fstring";

import './index.scss';

const Index = () => {
  const dispatch = useDispatch()
  const {match, activity} = useSelector(state => state)
  const {matchInfo, imagesUrl} = match

  const currentTime = new Date().getTime()
  const [heartValue, setHeartValue] = useState(0)
  const [heart, setHeart] = useState(0)
  const [isChecked, setChecked] = useState(false)
  const [isShowed, setShowed] = useState(false)
  const [countDownTime, setCountDownTime] = useState(0)

  function onHeartChange(value) {
    if (isShowed) {
      setHeartValue(value * 20)
      setHeart(value)
    }
  }

  function submitHeartValue() {
    dispatch(sendSatisfiedFeedback({id: activity.id, level: heartValue}))
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (match && match.hasFilled) {
      setHeartValue(match.favor)
      setChecked(true)
      setHeart(match.favor / 20)
    }
  }, [match])

  useEffect(() => {
    if (activity && activity.matchResultShowTime) {
      if (currentTime <= activity.matchResultShowTime + 24 * 60 * 60 * 1000) {
        setShowed(false)
        setCountDownTime(activity.matchResultShowTime + 24 * 60 * 60 * 1000 - currentTime)
      } else {
        setShowed(true)
        setCountDownTime(0)
      }
    }
  }, [activity])

  function fetchData() {
    dispatch(fetchMatchResult(activity.id))
  }

  async function navigateBack() {
    await Taro.navigateBack()
  }

  async function copyWechatNumber() {
    await Taro.setClipboardData({
      data: matchInfo.wechatNumber,
      success: function () {
        console.log('??????????????????????????????????????????')
      },
      fail: function () {
        console.log('??????????????????????????????????????????')
      }
    })
  }

  return (
    <View className='container'>
      <View className='custom-back' onClick={navigateBack}>
        <ArrowLeft size='24px' style={{marginRight: '8px'}}/>
        ????????????
      </View>
      <View className='header col'>
        <Image src={MatchResultTopImage} className='top-img-success'/>
        <View className='content'>
          <View className='col male'>
            <View className='male-avatar'>
              <Image
                shape='circle'
                lazyLoad
                src={match.male && match.male.avatarUrl && match.male.avatarUrl.length ? match.male.avatarUrl : AnonymousImage}
              />
            </View>
            <View className='nickName'>{getFormatNickname(match.male ? match.male.realName : '')}</View>
          </View>
          <View className='col female'>
            <View className='female-avatar'>
              <Image
                shape='circle'
                mode='aspectFit'
                lazyLoad
                src={match.female && match.female.avatarUrl && match.female.avatarUrl.length ? match.female.avatarUrl : AnonymousImage}
                className='avatar'
              />
            </View>
            <View className='nickName'>{getFormatNickname(match.female ? match.female.realName : '')}</View>
          </View>
        </View>
      </View>
      <View className='wrapper'>
        <View className='content margin-bottom-16'>
          <View className='wrapper-insider'>
            <View className='divider row'>
              ????????????
              <View className='line'/>
            </View>
            <View className='basic-info'>
              {matchInfo && matchInfo.basicInfo && matchInfo.basicInfo.length &&
                matchInfo.basicInfo
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
              }
            </View>
            <View className='divider row'>
              ????????????
              <View className='line'/>
            </View>
            <View className='character-info'>
              {matchInfo && matchInfo.characteristics && matchInfo.characteristics.length &&
                matchInfo.characteristics
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
              }
            </View>
            <View className='divider row'>
              ????????????
              <View className='line'/>
            </View>
            <View className='contact-info'>
              <View className='item'>
                <View className='title'>?????????</View>
                <View className='answer row'>
                  {matchInfo.wechatNumber}
                  <Image src={CopyIcon} className='icon' onClick={copyWechatNumber}/>
                </View>
              </View>
              <View className='tips purple'>
                <View>????????????</View>
                <View> ??? ?????????????????????????????????????????????~</View>
                <View> ??? ??????????????????????????????????????????~</View>
                <View> ??? ???????????????????????????????????????????????????????????????????????????????????????~</View>
              </View>
            </View>
            <View className='divider row'>
              ????????????
              <View className='line'/>
            </View>
            <View className='image-info'>
              <View className={isShowed ? 'text' : 'text filter'}>????????????Ta????????????????????????????????????????????????</View>
              <View className={isShowed ? 'first-check row' : 'first-check row filter'}>
                <View className='col center-center' style={{width: '60px'}}>
                  <View className='heart-value'>{heartValue + "%"}</View>
                  <View className='heart-text'>?????????</View>
                </View>
                <Rate
                  className='custom-color'
                  defaultValue={0}
                  value={heart}
                  allowHalf
                  size={24}
                  icon={<Like/>}
                  emptyIcon={<LikeOutlined/>}
                  onChange={(value) => onHeartChange(value)}
                  readonly={(!isShowed) || isChecked}
                />
                {isChecked ?
                  <Button className='check-button-clicked' disabled>?????????</Button> :
                  <Button
                    className='check-button'
                    disabled={!isShowed}
                    onClick={() => {
                      // ????????????????????????
                      if (isShowed) {
                        submitHeartValue()
                      }
                    }}
                  >
                    ??????
                  </Button>
                }
              </View>
              <View className='image-show row'>
                {isChecked ?
                  <>
                    {
                      imagesUrl && imagesUrl.length ?
                        imagesUrl.map((item, _) => {
                          return (
                            <Image
                              src={item}
                              lazyLoad
                              mode='aspectFill'
                              className='img'
                              onClick={() => viewImages(imagesUrl, item)}
                            />
                          )
                        }) :
                        <></>
                    }
                  </>
                  :
                  <>
                    {
                      imagesUrl && imagesUrl.length ?
                        imagesUrl.map(() => {
                          return (
                            <View className='img-placeholder'>??????</View>
                          )
                        }) :
                        <></>
                    }
                  </>
                }
              </View>
            </View>
            {!isShowed ?
              <View className='locked row'>
                <Image src={LockedIcon} className='icon'/>
                <View className='desc col'>
                  <Countdown
                    value={countDownTime}
                  >
                    {(current) => (
                      <View className='countdown'>
                        <View className='countdown-colon'>????????????????????????</View>
                        <View
                          className='countdown-block'
                        >{current.hours < 10 ? `0${current.hours}` : current.hours}</View>
                        <View className='countdown-colon'>???</View>
                        <View
                          className='countdown-block'
                        >{current.minutes < 10 ? `0${current.minutes}` : current.minutes}</View>
                        <View className='countdown-colon'>???</View>
                        <View
                          className='countdown-block'
                        >{current.seconds < 10 ? `0${current.seconds}` : current.seconds}</View>
                        <View className='countdown-colon'>???</View>
                      </View>
                    )}
                  </Countdown>
                  <View className='countdown-colon'>????????????24?????????????????????</View>
                </View>
              </View>
              : <></>
            }
          </View>
        </View>
      </View>
    </View>
  )
}

export default Index
