import {View} from "@tarojs/components";
import {MatchResultTopImage, CopyIcon, AnonymousImage} from "@/assets/images";
import {Button, Rate, Image} from "@taroify/core"
import {ArrowLeft, Like, LikeOutlined} from '@taroify/icons';
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchMatchResult} from "@/actions";
import Taro from "@tarojs/taro";

import './index.scss';

const test = {
  'boy_name': '吴桐',
  // 'boy_avator':,
  'girl_name': '533',
  // 'girl_avator':,
  'basic_info': [
    {title: '姓名', content: '吴桐'},
    {title: '年龄/年级', content: '20周岁/大三'},
    {title: '家乡', content: '浙江-宁波'},
    {title: '身高', content: '170cm'},
    {title: '校区', content: '紫金港校区'},
    {
      title: '学院及专业', content: '计算机科学与技术学院\n' +
        '数字媒体技术'
    },
  ],
  'character_info': [
    {
      title: '兴趣爱好', content: '球类运动｜电影｜动漫｜宠物（撸猫撸狗）｜\n' +
        '看展（博物艺术）'
    },
    {title: 'Ta如何排解坏情绪', content: '有时会跟最好的朋友吐槽，有时会一个人通过干饭睡觉看视频的方式默默消化掉'},
    {
      title: 'Ta觉得自己单身的原因',
      content: '性格比较内向，社交圈很小且大部分都是女孩子，也不怎么参与社交活动，即使参加了也不会和异性有过多接触。除此之外，比较注重精神灵魂的契合，遇到的异性感觉都不太能谈的起来，虽然不存在滥的可能性但也很认真地宁缺毋滥。'
    },
  ],
  'contact_info': 'BiuBiuBiu533',
  'images': ['', '', '']
}

const Index = () => {
  const dispatch = useDispatch()
  const {match, activity} = useSelector(state => state)
  const {boy_name, girl_name, basic_info, character_info, contact_info, images} = test;
  const basicInfo = () => {
    var res = []
    basic_info.forEach((item, i) => {
      if (i % 2 == 1) {
        res.push(
          <View className='right'>
            <View className='subtitle'>{item.title}</View>
            <View className='subanswer'>{item.content}</View>
          </View>
        )
      } else {
        res.push(
          <View className='left'>
            <View className='subtitle'>{item.title}</View>
            <View className='subanswer'>{item.content}</View>
          </View>
        )
      }

    })
    return res
  }
  var characterInfo = () => {
    var res = []
    character_info.forEach((item) => {
      res.push(
        <View className='left'>
          <View className='subtitle'>{item.title}</View>
          <View className='subanswer'>{item.content}</View>
        </View>
      )
    })
    return res
  }
  var imageInfo = () => {
    var res = []
    images.forEach((item) => {
      res.push(
        <Image src={null} className='img'></Image>
      )
    })
    return res
  }

  const [heartValue, setHeartValue] = useState<number>(40)
  const [isChecked, setChecked] = useState<boolean>(false)

  function onHeartChange(value) {
    setHeartValue(value * 20)
  }

  function submitHeartValue() {
    //  TODO：传第一次的心动值
    setChecked(true)
  }

  useEffect(() => {
    fetchData()
  }, [])

  function fetchData() {
    dispatch(fetchMatchResult(activity.id))
  }

  async function navigateBack() {
    await Taro.navigateBack()
  }

  return (
    <View className='container'>
      <View className='back' onClick={navigateBack}>
        <ArrowLeft size='24px' style={{marginRight: '8px'}}/>
        匹配结果
      </View>
      <View className='header col'>
        <Image src={MatchResultTopImage} className='top-img'/>
        <View className='content'>
          <View className='col male'>
            <View className='male-avatar'>
              <Image
                shape='circle'
                lazyLoad
                src={match.male.avatarUrl && match.male.avatarUrl.length ? match.male.avatarUrl : AnonymousImage}
              />
            </View>
            <View className='nickName'>{match.male.nickName}</View>
          </View>
          <View className='col female'>
            <View className='female-avatar'>
              <Image
                shape='circle'
                mode='aspectFit'
                lazyLoad
                src={match.female.avatarUrl && match.female.avatarUrl.length? match.female.avatarUrl : AnonymousImage}
                className='avatar'
              />
            </View>
            <View className='nickName'>{match.female.nickName}</View>
          </View>
        </View>
      </View>
      <View className='wrapper'>
        <View className='content margin-bottom-16'>
          <View className='wrapper-insider'>
            <View className='divider row'>
              基本信息
              <View className='line'/>
            </View>
            <View className='basic-info margin-bottom-16'>
              {basicInfo()}
            </View>

            <View className='divider row'>
              个性特点
              <View className='line'/>
            </View>
            <View className='character-info margin-bottom-16'>
              {characterInfo()}
            </View>

            <View className='divider row'>
              联系方式
              <View className='line'/>
            </View>
            <View className='contact-info margin-bottom-16'>
              <View className='left'>
                <View className='subtitle'>微信</View>
                <View className='subanswer'>
                  {contact_info}
                  {/*TODO:点击复制微信号到剪切板*/}
                  <Image src={CopyIcon} className='copy-icon' onClick={null}></Image>
                </View>
              </View>
              <View className='text purple'>
                <View>温馨提示</View>
                <View>•主动的人会获得更好的第一印象哦~</View>
                <View>•开放朋友圈吧，展示你的小生活</View>
                <View>•一段真诚的自我个绍可以提起对方的兴趣，解锁更多可聊的话题哦~</View>
              </View>
            </View>

            <View className='divider row'>
              个人照片
              <View className='line'></View>
            </View>
            <View className='image-info margin-bottom-20'>
              <View className='text gray'>记录你对Ta的第一印象，记录完成后可查看照片</View>
              <View className='first-check row'>
                <View className='col center-center'>
                  <View className='heart-value'>{heartValue + "%"}</View>
                  <View className='heart-text'>心动值</View>
                </View>
                <Rate className="custom-color" defaultValue={3} allowHalf size={25} icon={<Like/>}
                      emptyIcon={<LikeOutlined/>} onChange={(value) => onHeartChange(value)}/>
                {isChecked
                  ? <Button className='check-button-clicked' disabled>已确认</Button>
                  : <Button className='check-button' onClick={() => submitHeartValue()}>确认</Button>
                }
              </View>
              {isChecked ?
                <View className='image-show row'>
                  {imageInfo()}
                </View>
                : <></>}
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Index
