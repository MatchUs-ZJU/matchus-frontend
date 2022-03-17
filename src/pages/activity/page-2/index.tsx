import {useDispatch, useSelector} from "react-redux";
import {View} from "@tarojs/components";
import { AtButton, AtActionSheetItem, AtActionSheet } from "taro-ui";
import {useEffect, useState} from "react";
import {actionFilledOverSurvey, actionFillSurvey, fetchMatchResult, fetchFeedbackContent, sendSatisfiedFeedback} from "../../../actions";

const Index = () => {
  const dispatch = useDispatch();
  const {activity, user} = useSelector(state => state)
  const currentTime = new Date();

  const [canFill, setCanFill] = useState(false)
  const [hasFilledSurvey, setHasFilledSurvey] = useState(false)
  const [canViewMatchResult, setCanViewMatchResult] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showSatisfiedInvestigate, setShowSatisfiedInvestigate] = useState(false)
  const [satisfied, setSatisfied] = useState('')

  useEffect(() => {
    const auth = () => {
      // TODO auth
    }
    const checkFillSurveyState = () => {
      // 根据时间和是否完成支付、是否填写了表单，查看是否能够填写问卷
      if (activity.participate.paid
        && currentTime < activity.signUpEndTime! && currentTime > activity.signUpStartTime!
        && !activity.participate.filledSurvey) {
        setCanFill(true)
      } else {
        setCanFill(false)
      }

      if (activity.participate.filledSurvey) {
        setHasFilledSurvey(true)
      } else {
        setHasFilledSurvey(false)
      }
    }

    const checkMatchResultState = () => {
      // 根据时间和是否填写表单，获取匹配结果和其他内容
      if (currentTime > activity.matchResultShowTime! && activity.participate.filledSurvey) {
        dispatch(fetchMatchResult())
        dispatch(fetchFeedbackContent())
      }
    }

    // 由于该页面可能通过问卷星跳转，所以需要检查是否有当前页面权限
    auth()
    checkFillSurveyState()
    checkMatchResultState()
  }, [])

  useEffect(() => {
    if(satisfied !== '') {
      dispatch(sendSatisfiedFeedback(satisfied, setShowContactModal))
    }
  }, [satisfied])

  function onGotoFillSurvey() {
    dispatch(actionFillSurvey({
      appId: activity.wjxAppId,
      path: activity.wjxPath
    }))
  }

  function onFilledSurvey() {
    dispatch(actionFilledOverSurvey(user.openid, activity.id))
  }

  function onViewContacts() {
    if (!activity.participate.filledSatisfiedFeedback) {
      setShowSatisfiedInvestigate(true)
    } else {
      setShowContactModal(true)
    }
  }

  return (
    <View className='container'>
      <AtActionSheet isOpened={showSatisfiedInvestigate} cancelText='取消' title='您对本次匹配的结果满意吗？'>
        <AtActionSheetItem onClick={(_) => { setSatisfied('非常满意')}}>
          非常满意
        </AtActionSheetItem>
        <AtActionSheetItem onClick={(_) => { setSatisfied('还可以')}}>
          还可以
        </AtActionSheetItem>
        <AtActionSheetItem onClick={(_) => { setSatisfied('不满意')}}>
          不满意
        </AtActionSheetItem>
      </AtActionSheet>
      <View>
        填写问卷
      </View>
      <View>
        <AtButton type='primary' size='normal' circle disabled={!canFill} onClick={onGotoFillSurvey}>
          点击填写问卷
        </AtButton>
        <AtButton type='primary' size='normal' circle disabled={hasFilledSurvey} onClick={onFilledSurvey}>
          我已经填完问卷了！
        </AtButton>
      </View>
      <View>
        匹配结果查看
        <AtButton type='primary' size='normal' circle onClick={onViewContacts}>
          点击查看联系方式
        </AtButton>
      </View>
    </View>
  )
}

export default Index
