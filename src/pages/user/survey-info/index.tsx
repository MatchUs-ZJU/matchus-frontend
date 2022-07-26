import {MovableArea, MovableView, Text, View} from "@tarojs/components";
import "@taroify/core/cell/style"
import {useDispatch, useSelector} from "react-redux";
import {SurveyInfoItem} from "@/components";
import {SurveyUserIcon} from "@/assets/images";
import {Edit} from "@taroify/icons";
import {fillForm} from "@/actions";
import {useEffect} from "react";
import {fetchSurveyInfo} from "@/actions/user";
import {Image} from "@taroify/core";
import './index.scss'

const SurveyInfo = () => {
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
            {surveyInfo.survey && surveyInfo.survey.length &&
              <SurveyInfoItem
                info={surveyInfo.survey[1].info} updateTime={surveyInfo.survey[1].updateTime}
                name={surveyInfo.survey[1].name} images={surveyInfo.images} key={1}
              />
            }
            <MovableView className='movable-btn' direction='all' inertia x={windowWidth - 60} y={windowHeight - 60}>
              <Edit style={{color: '#FFF', fontSize: '30px'}} onClick={goToFillForm}/>
            </MovableView>
          </MovableArea>
          :
          <View className='wrapper'>
            <View className='header'>
              <Image src={SurveyUserIcon} className='icon' style={{width: `22px`, height: `22px`}}/>
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

export default SurveyInfo;
