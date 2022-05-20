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
              name='基本信息'
            />
            <SurveyInfoItem
              icon={surveyMatchIcon} info={surveyInfo.matchInfo.info} updateTime={surveyInfo.matchInfo.updateTime}
              name='匹配信息' withImage images={surveyInfo.images}
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
