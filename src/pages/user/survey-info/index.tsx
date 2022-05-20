import {MovableArea, MovableView, Text, View} from "@tarojs/components";
import "@taroify/core/cell/style"
import {useDispatch, useSelector} from "react-redux";
import {SurveyInfoItem} from "@/components";
import {surveyMatchIcon, surveyUserIcon} from "@/assets/images";
import {Edit} from "@taroify/icons";
import {fillForm} from "@/actions";
import {useEffect} from "react";
import {fetchSurveyInfo} from "@/actions/user";
import {Image} from "@taroify/core";
import './index.scss'

const testData = {
  basicInfo: {
    updateTime: new Date().getTime(),
    info: [
      {
        name: '个人信息',
        fields: [
          {key: '真实姓名', value: '陆小曼', index: 0, multipleRow: false},
          {key: '微信', value: 'wx128318241u—sadsacascccdasafaf', index: 1, multipleRow: false},
          {key: '所在校区', value: '玉泉', index: 2, multipleRow: false},
          {key: '手机号', value: '+86 18888910626', index: 3, multipleRow: false},
          {key: '最长的一次恋爱经历持续时间', value: '1年', index: 4, multipleRow: false},
          {key: '兴趣爱好', value: '问题回答，超级喜欢可以取消哦～，如何取消呢？XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', index: 5, multipleRow: true}
        ]
      },
      {
        name: '个人信息',
        fields: [
          {key: '真实姓名', value: '陆小曼', index: 0, multipleRow: false},
          {key: '微信', value: 'wx128318241u—sadsacascccdasafaf', index: 1, multipleRow: false},
          {key: '所在校区', value: '', index: 2, multipleRow: false},
          {key: '手机号', value: '+86 18888910626', index: 3, multipleRow: false},
          {key: '最长的一次恋爱经历持续时间', value: '1年', index: 4, multipleRow: false},
          {key: '兴趣爱好', value: '', index: 5, multipleRow: true}
        ]
      },
      {
        name: '个人信息',
        fields: [
          {key: '真实姓名', value: '陆小曼', index: 0, multipleRow: false},
          {key: '微信', value: 'wx128318241u—sadsacascccdasafaf', index: 1, multipleRow: false},
          {key: '所在校区', value: '玉泉', index: 2, multipleRow: false},
          {key: '手机号', value: '+86 18888910626', index: 3, multipleRow: false},
          {key: '最长的一次恋爱经历持续时间', value: '1年', index: 4, multipleRow: false},
          {key: '兴趣爱好', value: '问题回答，超级喜欢可以取消哦～，如何取消呢？XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', index: 5, multipleRow: true}
        ]
      }
    ]
  },
  matchInfo: {
    updateTime: new Date().getTime(),
    info: [
      {
        name: '个人信息',
        fields: [
          {key: '真实姓名', value: '陆小曼', index: 0, multipleRow: false},
          {key: '微信', value: 'wx128318241u—sadsacascccdasafaf', index: 1, multipleRow: false},
          {key: '所在校区', value: '玉泉', index: 2, multipleRow: false},
          {key: '手机号', value: '+86 18888910626', index: 3, multipleRow: false},
          {key: '最长的一次恋爱经历持续时间', value: '1年', index: 4, multipleRow: false},
          {key: '兴趣爱好', value: '问题回答，超级喜欢可以取消哦～，如何取消呢？XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', index: 5, multipleRow: true}
        ]
      },
      {
        name: '个人照片',
        fields: [
          {key: '真实姓名', value: '陆小曼', index: 0, multipleRow: false},
          {key: '微信', value: 'wx128318241u—sadsacascccdasafaf', index: 1, multipleRow: false},
          {key: '所在校区', value: '玉泉', index: 2, multipleRow: false},
          {key: '手机号', value: '+86 18888910626', index: 3, multipleRow: false},
          {key: '最长的一次恋爱经历持续时间', value: '1年', index: 4, multipleRow: false},
          {key: '兴趣爱好', value: '问题回答，超级喜欢可以取消哦～，如何取消呢？XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', index: 5, multipleRow: true}
        ]
      },
      {
        name: '个人信息',
        fields: [
          {key: '真实姓名', value: '陆小曼', index: 0, multipleRow: false},
          {key: '微信', value: 'wx128318241u—sadsacascccdasafaf', index: 1, multipleRow: false},
          {key: '所在校区', value: '玉泉', index: 2, multipleRow: false},
          {key: '手机号', value: '+86 18888910626', index: 3, multipleRow: false},
          {key: '最长的一次恋爱经历持续时间', value: '1年', index: 4, multipleRow: false},
          {key: '兴趣爱好', value: '问题回答，超级喜欢可以取消哦～，如何取消呢？XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', index: 5, multipleRow: true}
        ]
      }
    ]
  },
  images: ['https://6d61-matchus-backend-dev-8cpqf11d7b0e-1309499644.tcb.qcloud.la/identify/3180106071-rn-1652860866912.png?sign=e112c29c2c0fa48c781b3c41a7f6e3fa&t=1652936080',
    'https://6d61-matchus-backend-dev-8cpqf11d7b0e-1309499644.tcb.qcloud.la/identify/3180106071-rn-1652860866912.png?sign=e112c29c2c0fa48c781b3c41a7f6e3fa&t=1652936080',
  ],
  wjxAppId: 'wxd947200f82267e58',
  wjxPath: 'pages/wjxqList/wjxqList?activityId=PfjBWtQ'
}

const Information = () => {
  const dispatch = useDispatch()
  const {user, global} = useSelector((state) => state)
  const {windowWidth, windowHeight} = global.system!
  const surveyInfo = user.surveyInfo!

  useEffect(() => {
    dispatch(fetchSurveyInfo())
  }, [])

  function goToFillForm() {
    dispatch(fillForm({appId: surveyInfo.wjxAppId, path: surveyInfo.wjxPath}))
  }

  return (
    <View className='container'>
      {
        surveyInfo ?
          <MovableArea className='movable-container'>
            <SurveyInfoItem
              icon={surveyUserIcon} info={surveyInfo.basicInfo.info} updateTime={surveyInfo.basicInfo.updateTime}
              name='基本信息' withImage images={surveyInfo.images}
            />
            <SurveyInfoItem
              icon={surveyMatchIcon} info={surveyInfo.matchInfo.info} updateTime={surveyInfo.matchInfo.updateTime}
              name='匹配信息'
            />
            <MovableView className='movable-btn' direction='all' inertia x={windowWidth - 60} y={windowHeight - 60}>
              <Edit style={{color: '#FFF', fontSize: '30px'}} onClick={goToFillForm}/>
            </MovableView>
          </MovableArea>
          :
          <View className='wrapper'>
            <View className='header'>
              <Image src={surveyUserIcon} className='icon' style={{width: `22px`, height: `22px`}}/>
              <Text className='title'>问卷信息</Text>
            </View>
            <View className='body'>
              您还没有填写过问卷哦!
            </View>
          </View>
      }
    </View>
  );
}

export default Information;
