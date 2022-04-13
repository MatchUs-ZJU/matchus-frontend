import {Button, View, ViewProps} from "@tarojs/components";
import {Dialog, Image} from "@taroify/core";
import {StepIcon} from "@/assets/images";
import classnames from "classnames";
import {fillForm, finishFillForm as actionFinishFillForm} from "@/actions";
import {useDispatch, useSelector} from "react-redux";
import {ActiveBtn, DisableBtn, FinishedBtn, NotStartBtn} from "@/components/activity-card/right-buttons";
import {useEffect, useState} from "react";
import {Edit, Success} from "@taroify/icons";

import './index.scss';

interface SurveyCardProps extends ViewProps {
  activity: number | string,
  wjxAppId: string,
  wjxPath: string,
}

const SurveyCard = (props: SurveyCardProps) => {
  const dispatch = useDispatch()
  const {wjxAppId, wjxPath, activity} = props
  const {state, filled} = useSelector(rootState => rootState.activity.participate.fillForm)
  const {pushFillForm} = useSelector(rootState => rootState.global)
  console.log(state, filled)

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  function goToFillForm() {
    dispatch(fillForm({
      appId: wjxAppId,
      path: wjxPath
    }))
  }

  function confirmFinishFillForm() {
    dispatch(actionFinishFillForm(activity))
  }

  function finishFillForm() {
    setConfirmDialogOpen(true)
  }

  // 继续填写表单组件
  const FillFormBtn = () => {
    return (
      <View className='fill-form-btn row'>
        <View className='col' onClick={goToFillForm}>
          <View className='icon-container'><Edit size='20px'/></View>
          <View className='text'>继续填写</View>
        </View>
        <View className='col' onClick={finishFillForm} style={{marginLeft: '16px'}}>
          <View className='icon-container'><Success size='20px'/></View>
          <View className='text'>确认完成</View>
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
          <View className='detail'>拼图君需要了解你的需求和性格，才能为你找到心仪的Ta</View>
          <View className='note'>填问卷需10min，确认完成后不可修改</View>
        </View>
        <View className='col right'>
          {state === 'NOT_START' ? (
            <NotStartBtn type='notStart'/>
          ) : state === 'ACTIVE' && !filled ? (
            pushFillForm ? (
              <ActiveBtn type='fillForm' onClick={goToFillForm}/>
            ) : (
              <FillFormBtn/>
            )
          ) : state === 'ACTIVE' && filled ? (
            <FinishedBtn type='fillForm'/>
          ) : (
            <DisableBtn type='disable'/>
          )}
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
      </View>
    </View>
  )
}

export default SurveyCard
