import {Button, View, ViewProps} from "@tarojs/components";
import {Dialog, Image} from "@taroify/core";
import {StepIcon} from "@/assets/images";
import classnames from "classnames";
import {preJoinActivity} from "@/actions";
import {useDispatch} from "react-redux";
import {ActiveBtn, DisableBtn, FinishedBtn} from "@/components/activity-card/right-buttons";
import {useEffect, useState} from "react";
import Taro from "@tarojs/taro";

import './index.scss'

interface SignupCardProps extends ViewProps {
  activity: number | string, // 活动ID
  price: number,

  state: 'NOT_START' | 'ACTIVE' | 'DISABLED',
  paid: boolean,
  participated: boolean

  time: string
  bodyPrefix: string
}

interface SignUpNotStartBtnProps {
  time: string
}

const SignUpNotStartBtn = (props: SignUpNotStartBtnProps) => {
  const {time} = props
  return (
    <View className='btn-disable'>
      <View className='date'>{time}</View>
      <View className='desc'>开放报名</View>
    </View>
  )
}

const SignupCard = (props: SignupCardProps) => {
  const dispatch = useDispatch()
  const {price, state, paid, participated, time, activity, bodyPrefix, ...restProps} = props

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  function goToSignUp() {
    setConfirmDialogOpen(true)
    // confirmJoin()
  }

  function confirmJoin() {
    // 发起参与活动，购买请求
    const payload = {
      id: activity,
      price: price,
      body: `${bodyPrefix}-${new Date().getMilliseconds()}`,
      attach: ''
    }
    dispatch(preJoinActivity(payload))
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
          <View className='id'>1</View>
          <Image lazyLoad src={StepIcon} className='img'/>
        </View>
        <View className='col main'>
          <View className='title'>遇见·活动报名</View>
          <View className='detail'>参与活动需支付报名费{price}元，请珍惜每一次遇见！</View>
          <View className='note' onClick={async () => {
            await Taro.navigateTo({url: '/pages/activity/rules/index'});
          }}
          >点击查看详细活动规则</View>
        </View>
        <View className='col right'>
          {state === 'NOT_START' ? (
            <SignUpNotStartBtn time={time}/>
          ) : state === 'ACTIVE' && !participated ? (
            <ActiveBtn type='signup' onClick={goToSignUp}/>
          ) : state === 'ACTIVE' && participated ? (
            <FinishedBtn type='signup'/>
          ) : (
            <DisableBtn type='disable'/>
          )}
        </View>
      </View>
      <Dialog open={confirmDialogOpen} onClose={setConfirmDialogOpen}>
        <Dialog.Header className='dialog-header'>确认活动规则并参与活动</Dialog.Header>
        <Dialog.Actions>
          <Button className='dialog-btn' onClick={() => setConfirmDialogOpen(false)}>我再看看</Button>
          <Button className='dialog-btn' onClick={() => {
            setConfirmDialogOpen(false)
            confirmJoin()
          }}
          >参加活动
          </Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}

export default SignupCard
