import {Button, View, ViewProps} from "@tarojs/components";
import {Dialog, Image} from "@taroify/core";
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
  const {state, filled,isComplete} = useSelector(rootState => rootState.activity.participate.fillForm)
  const {pushFillForm} = useSelector(rootState => rootState.global)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [surveyDialogOpen,setSurveyDialogOpen] = useState(false)

  useEffect(()=>{
    dispatch(fetchSurveyDetail())
  },[])

  useEffect(() => {
    if(pushFillForm) {
      console.log('提醒用户去提醒问卷')
    }
  }, [pushFillForm])

  function pushGoToFillForm() {
    // dispatch(fillForm({
    //   appId: wjxAppId,
    //   path: wjxPath
    // }))
    dispatch(globalSave({
      pushFillForm: false
    }))
    Taro.navigateTo({url: '/pages/user/survey-info-edit/index'})
  }

  function confirmFinishFillForm() {
    if(surveyDetail && isComplete){
      dispatch(actionFinishFillForm([...surveyDetail.noRequireMatchRequests,...surveyDetail.requireMatchRequests]))
    }
  }

  function finishFillForm() {
    if(isComplete){
      setConfirmDialogOpen(true)
    }else{
      setSurveyDialogOpen(true)
    }
  }

  // 继续填写表单组件
  const FillFormBtn = () => {
    return (
      <View className='fill-form-btn row'>
        <View className='col' onClick={pushGoToFillForm}>
          <View className='icon-container'><Edit size='20px'/></View>
          <View className='text'>继续填写</View>
        </View>
        <View className='col' onClick={finishFillForm} style={{marginLeft: '12px'}}>
          <View className='icon-container'><Success size='20px'/></View>
          <View className='text'>确认提交</View>
        </View>
      </View>
    )
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
          <View className='title'>初知·问卷填写</View>
          <View className='detail'>问卷可覆盖填写，取最后一次作为您的最终问卷结果</View>
          <View className='note'>填问卷大约需10min</View>
        </View>
        <View className='col right'>
          {state === 'NOT_START' ? (
            <NotStartBtn type='notStart'/>
          ) : state === 'ACTIVE' && !filled ? (
            pushFillForm || !isComplete ? (
              <ActiveBtn type='fillForm' onClick={pushGoToFillForm}/>
            ) : (
              <FillFormBtn/>
            )
          ) : state === 'ACTIVE' && filled ? (
            <FinishedBtn type='fillForm' />
          ) :
            <DisableBtn type='disable' />
          }
        </View>
        <Dialog open={confirmDialogOpen} onClose={setConfirmDialogOpen}>
          <Dialog.Header className='dialog-header'>确认完成填写？确认后问卷不可以修改</Dialog.Header>
          <Dialog.Actions>
            <Button className='dialog-btn' onClick={() => setConfirmDialogOpen(false)}>我再看看</Button>
            <Button className='dialog-btn' onClick={() => {
              setConfirmDialogOpen(false)
              confirmFinishFillForm()
            }}
            >确认完成
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog open={surveyDialogOpen} onClose={setSurveyDialogOpen}>
          <Dialog.Header className='dialog-header dialog-header-redirect'>您的匹配要求未完善</Dialog.Header>
          <Dialog.Actions>
            <Button className='dialog-btn dialog-btn-redirect' onClick={() => {
              setSurveyDialogOpen(false)
              Taro.navigateTo({url: '/pages/user/survey-info-edit/index'})
            }}
            >去完善匹配要求
            </Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    </View>
  )
}

export default SurveyCard
