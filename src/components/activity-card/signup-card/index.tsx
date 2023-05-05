import { Button, View, ViewProps, Text } from "@tarojs/components";
import { Dialog, Image } from "@taroify/core";
import { StepIcon } from "@/assets/images";
import classnames from "classnames";
import {
  preJoinActivity, fetchLatestActivityInfo, preUseVoucherJoinActivity
} from "@/actions";
import { useDispatch, useSelector } from "react-redux";
import { ActiveBtn, DisableBtn, FinishedBtn } from "@/components/activity-card/right-buttons";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import './index.scss'
import {
  useVoucherJoinActivity,
} from "@/services/activity";

interface SignupCardProps extends ViewProps {
  activity: number | string, // 活动ID
  price: number,
  time: string
  bodyPrefix: string
}

interface SignUpNotStartBtnProps {
  time: string
}

const SignUpNotStartBtn = (props: SignUpNotStartBtnProps) => {
  const { time } = props
  return (
    <View className='btn-disable'>
      <View className='date'>{time}</View>
      <View className='desc'>开放报名</View>
    </View>
  )
}

const SignupCard = (props: SignupCardProps) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state)
  const { price, time, activity, bodyPrefix } = props
  const { state, paid, participated } = useSelector(rootState => rootState.activity.participate.signUp)
  const { userType, isComplete, isOldUser } = useSelector(rootState => rootState.user)
  const hasVoucher = useSelector(state => state.activity.hasVoucher);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [redirectDialogOpen, setRedirectDialogOpen] = useState(false)
  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchLatestActivityInfo());
  }, []);

  function goToSignUp() {
    // if(userType === 3){
    //   Taro.showToast({
    //     title: '抱歉，本期活动暂时仅面向三年内毕业生开放',
    //     icon: 'none',
    //     duration: 3000
    //   })
    // }
    if (!isComplete) {
      setRedirectDialogOpen(true)
    }
    else if (hasVoucher) {
      setVoucherDialogOpen(true)
    }
    else {
      setConfirmDialogOpen(true)
    }
  }

  async function redirectToPersonInfo() {
    if (!isComplete && isOldUser) {
      await Taro.navigateTo({ url: '/subPackageB/user/personal-info-modify/index' })
    }
    else {
      await Taro.navigateTo({ url: '/subPackageB/user/personal-info-fill/index' })
    }
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

  function voucherConfirmJoin() {
    // 发起参与活动，购买请求
    const payload = {
      id: activity,
      useVoucher: 1
    }
    dispatch(preUseVoucherJoinActivity
      (payload))
  }

  return (
    <View className='card-container'>
      <View
        className={classnames(
          'row',
          'activity-card',
          { 'activity-card-sheltered': state && state !== 'ACTIVE' }
        )}
      >
        <View className='col left'>
          <View className='id'>1</View>
          <Image lazyLoad src={StepIcon} className='img' />
        </View>
        <View className='col main'>
          <View className='title'>遇见·活动报名</View>
          <View className='detail'>参与活动需支付报名费<Text className='purple'>{price}</Text>元，未匹配到<Text className='purple'>全额退款</Text></View>
          <View className='note' onClick={async () => {
            await Taro.navigateTo({ url: '/pages/activity/rules/index' });
          }}
          >点击查看详细活动规则</View>
        </View>
        <View className='col right'>
          {state === 'NOT_START' ? (
            <SignUpNotStartBtn time={time} />
          ) : state === 'ACTIVE' && !participated ? (
            <ActiveBtn type='signup' onClick={goToSignUp} />
          ) : state === 'ACTIVE' && participated ? (
            <FinishedBtn type='signup' />
          ) : (
            <DisableBtn type='disable' />
          )}
        </View>
      </View>
      <Dialog open={confirmDialogOpen} onClose={setConfirmDialogOpen}>
        <Dialog.Header className='dialog-header'>请确认是否参与活动并支付报名费</Dialog.Header>
        <Dialog.Actions>
          <Button className='dialog-btn' onClick={() => setConfirmDialogOpen(false)}>我再看看</Button>
          <Button className='dialog-btn' onClick={() => {
            setConfirmDialogOpen(false)
            confirmJoin()
          }}
          >确认支付
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog open={redirectDialogOpen} onClose={setRedirectDialogOpen}>
        <Dialog.Header className='dialog-header dialog-header-redirect'>请先完善个人信息</Dialog.Header>
        <Dialog.Actions>
          <Button className='dialog-btn dialog-btn-redirect' onClick={() => {
            setRedirectDialogOpen(false)
            redirectToPersonInfo()
          }}
          >去完善
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog open={voucherDialogOpen} onClose={setVoucherDialogOpen}>
        <Dialog.Header className='dialog-header'>是否使用匹配券参与本次匹配</Dialog.Header>
        <Dialog.Actions>
          <Button className='dialog-btn' onClick={() => {
            setVoucherDialogOpen(false);
            setConfirmDialogOpen(true);
          }}>放弃</Button>

          <Button className='dialog-btn' onClick={async () => {
            setVoucherDialogOpen(false);
            voucherConfirmJoin();
          }}>确认</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}

export default SignupCard
