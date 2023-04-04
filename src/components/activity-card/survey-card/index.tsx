import {Button, View, ViewProps} from "@tarojs/components";
import {Dialog, Image, Progress} from "@taroify/core";
import {StepIcon} from "@/assets/images";
import classnames from "classnames";
import {fillForm, finishFillForm as actionFinishFillForm, globalSave} from "@/actions";
import {useDispatch, useSelector} from "react-redux";
import {ActiveBtn, DisableBtn, FinishedBtn, NotStartBtn} from "@/components/activity-card/right-buttons";
import {useEffect, useState} from "react";
import {Edit, Success} from "@taroify/icons";

import Taro from "@tarojs/taro";
import {fetchSurveyDetail} from "@/actions/user";
import './index.scss';

interface SurveyCardProps extends ViewProps {
  activity: number | string,
  wjxAppId: string,
  wjxPath: string,
}

const SurveyCard = (props: SurveyCardProps) => {
  const dispatch = useDispatch()
  const {wjxAppId, wjxPath, activity} = props
  const {surveyDetail} = useSelector(rootState => rootState.user)
  const {matchResultShowTime,signUpEndTime} = useSelector(rootState => rootState.activity)

  const {state,filled,percent} = useSelector(rootState => rootState.activity.participate.fillForm)
  const {pushFillForm} = useSelector(rootState => rootState.global)

  useEffect(()=>{
    dispatch(fetchSurveyDetail())
  },[])

  useEffect(() => {
    if(pushFillForm) {
      console.log('提醒用户去提醒问卷')
    }
  }, [pushFillForm])

  function redirectToSurvey(){
    Taro.navigateTo({url: '/pages/user/survey-info-edit/index'})
  }

  function getEndDateString(){
    if(signUpEndTime){
      const date = new Date(signUpEndTime)
      return date.getMonth() + '月'+date.getDate() + '日'+ date.getHours()+'点'+date.getMinutes()+'分'
    }
    return ''
  }


  return (
    <View className='card-container'>
      <View
        className={classnames(
          'row',
          'activity-card',
          {'activity-card-sheltered': state && state !== 'ACTIVE'}
        )}
      >
        <View className='col left'>
          <View className='id'>2</View>
          <Image lazyLoad src={StepIcon} className='img'/>
        </View>

          <View className='col main'>
            <View className='title'>初知·要求填写</View>
            {!percent ? (
              <>
                <View className='detail'>问卷可覆盖填写，取最后一次作为您的最终问卷结果</View>
                <View className='note'>填问卷大约需10min</View>
              </>
              ):(
                <>
                  <View className='progress-wrapper'>
                    <Progress className='progress' percent={Math.floor(percent?percent.answer/percent.total * 100:0)} />
                  </View>
                  <View className='detail'>{percent && percent.answer>=percent.total?'已完成':`未完成 请在${getEndDateString()}前完成问卷填写`}</View>
                </>
              )

            }
          </View>


        <View className='col right'>
          {state === 'NOT_START' ? (
            <NotStartBtn type='notStart'/>
          ) : state === 'ACTIVE' && signUpEndTime && signUpEndTime > new Date().getTime() ? (
            <ActiveBtn type={percent && percent.answer < percent.total?'fillForm':'editForm'} onClick={redirectToSurvey}/>
          ) : state === 'ACTIVE' &&  signUpEndTime && signUpEndTime <= new Date().getTime()?(
              <FinishedBtn type={(percent && percent.answer >= percent.total)?'fillForm':'notFill'}/>
            ) :
            <DisableBtn type='disable' />
          }
        </View>

      </View>
    </View>
  )
}

export default SurveyCard
