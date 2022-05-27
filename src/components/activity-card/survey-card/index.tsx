import {Button, View, ViewProps} from "@tarojs/components";
import {Dialog, Image} from "@taroify/core";
import {StepIcon} from "@/assets/images";
import classnames from "classnames";
import {fillForm, finishFillForm as actionFinishFillForm, globalSave} from "@/actions";
import {useDispatch, useSelector} from "react-redux";
import {ActiveBtn, DisableBtn, FinishedBtn, NotStartBtn} from "@/components/activity-card/right-buttons";
import {useState} from "react";
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
            <ActiveBtn type='fillForm' onClick={goToFillForm}/>
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
      </View>
    </View>
  )
}

export default SurveyCard
