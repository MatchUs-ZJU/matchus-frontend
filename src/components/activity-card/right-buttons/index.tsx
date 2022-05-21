import {Text, View, ViewProps} from "@tarojs/components";
import {Success} from "@taroify/icons";
import classnames from "classnames";
import Taro from "@tarojs/taro";

import './index.scss'

export const notStartText = '未开始'
export const goToSignUpText = '去报名'
export const goToFillFormText = '去填写'
export const goToSeeResultText = '查看结果'
export const hasSignedUpText = '已报名'
export const hasFilledFormText = '已填写'
export const disabledText = '已结束'
export const defaultText = '默认文案'
export const inRefundText = '退款中'
export const hasRefundedText = '已退款'

interface ActiveBtnProps extends ViewProps {
  type: 'signup' | 'fillForm' | 'seeResult' | 'fillFormAgain'
}

export const ActiveBtn = (props: ActiveBtnProps) => {
  const {type, onClick} = props

  const content = (type === 'signup' ? goToSignUpText : type === 'fillForm' ? goToFillFormText : type === 'seeResult' ? goToSeeResultText : defaultText)

  return (
    <View className='btn-active' onClick={onClick}>
      {content}
    </View>
  )
}

interface DisableBtnProps {
  type: 'disable' | 'notStart'
}

export const DisableBtn = (props: DisableBtnProps) => {
  const {type} = props

  const content = (type === 'disable' ? disabledText : type === 'notStart' ? notStartText : defaultText)

  return (
    <View className='btn-disable'>
      {content}
    </View>
  )
}

export const NotStartBtn = DisableBtn

interface FinishedBtnProps {
  type: 'signup' | 'fillForm' | 'hasRefund' | 'inRefund'
}

export const FinishedBtn = (props: FinishedBtnProps) => {
  const {type} = props

  const content = (type === 'signup' ? hasSignedUpText : type === 'fillForm' ? hasFilledFormText : type === 'hasRefund'? hasRefundedText : type==='inRefund'? inRefundText : defaultText)
  const fail = (type === 'hasRefund' || type === 'inRefund')

  async function onClickBtn() {
    if(type === 'inRefund') {
      await Taro.showToast({
        icon: 'none',
        title: '退款将在3个工作日内到账，有问题请联系小助手',
        duration: 3000
      })
    }
  }

  return (
    <View
      className={classnames(
        'btn-finished',
        {'btn-finished-failed': fail}
      )}
      onClick={onClickBtn}
    >
      {(type !== 'inRefund') &&
        <Success size='20px' style={{marginRight: '8px'}}/>}

      <View>{content}</View>
    </View>
  )
}
