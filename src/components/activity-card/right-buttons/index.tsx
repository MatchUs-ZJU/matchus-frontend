import {View, ViewProps} from "@tarojs/components";
import {Success} from "@taroify/icons";

import './index.scss'

export const notStartText = '未开始'
export const goToSignUpText = '去报名'
export const goToFillFormText = '去填写'
export const goToSeeResultText = '查看结果'
export const hasSignedUpText = '已报名'
export const hasFilledFormText = '已填写'
export const disabledText = '已结束'
export const defaultText = '默认文案'
export const goToRefundText = '去退款'

interface ActiveBtnProps extends ViewProps {
  type: 'signup' | 'fillForm' | 'seeResult'
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
  type: 'signup' | 'fillForm'
}

export const FinishedBtn = (props: FinishedBtnProps) => {
  const {type} = props

  const content = (type === 'signup' ? hasSignedUpText : type === 'fillForm' ? hasFilledFormText : defaultText)

  return (
    <View className='btn-finished'>
      <Success size='20px' style={{color: '#918AE3', marginRight: '8px'}}/>
      <View>{content}</View>
    </View>
  )
}
