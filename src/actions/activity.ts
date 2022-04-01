import Taro from "@tarojs/taro";
import React from "react";
import {ACTIVITY_MATCH_STATE_SAVE, ACTIVITY_SAVE, ACTIVITY_TWC_STATE_SAVE} from "@/constants";
import {
  postFilledForm,
  getLatestActivityInfo,
  postPreJoinActivity,
  getMatchResult,
  postSatisfiedFeedback, getFeedbackContent, postSendTwcResult, getTwcResult, getPaymentResult, postRefundRequest
} from "@/services/activity";
import {globalSave} from "@/actions/global";

export const activitySave = (payload) => {
  return {
    type: ACTIVITY_SAVE,
    payload
  }
}

export const matchStateSave = (payload) => {
  return {
    type: ACTIVITY_MATCH_STATE_SAVE,
    payload
  }
}

export const twcStateSave = (payload) => {
  return {
    type: ACTIVITY_TWC_STATE_SAVE,
    payload
  }
}

export const fetchLatestActivityInfo = () => {
  return async dispatch => {
    console.log("活动页面：获取最新活动信息和用户参与情况")
    try {
      const res = await getLatestActivityInfo()
      if (res && res.code === 0) {
        console.log("活动页面：获取最新活动信息和用户参与情况成功")
        dispatch(activitySave(res.data))
      } else {
        console.log("活动页面：获取最新活动信息和用户参与情况失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const preJoinActivity = ({id, price, body, attach}) => {
  return async dispatch => {
    console.log("活动页面：发起参与活动，进行购买预处理")
    try {
      let preJoinRes = await postPreJoinActivity(id, {
        'price': price,
        'body': body,
        'attach': attach
      })

      if (preJoinRes && preJoinRes.code === 0) {
        console.log("活动页面：发起预处理请求成功，发起支付请求")
        let {orderId, timeStamp, nonceStr, signType, paySign} = preJoinRes.data
        let payRes = await Taro.requestPayment({
          timeStamp,
          nonceStr,
          package: 'prepay_id=' + preJoinRes.data.package,
          signType,
          paySign
        })

        if (payRes && payRes.errMsg === 'requestPayment:ok') {
          console.log(payRes)
          console.log("活动页面：支付成功")

          // 检查是否完成支付
          const res = await getPaymentResult({
            'id': id,
            'orderId': orderId
          })
          if(res && res.code === 0 && res.data.success) {
            console.log("活动页面：查询后台成功，订单已完成")
            await Taro.showModal({
              title: '操作提示',
              content: '支付成功',
              showCancel: false,
              confirmText: '确定'
            })
            // 改变状态，主动让用户填写表单
            dispatch(globalSave({
              pushFillForm: true
            }))
          } else {
            await Taro.showToast({
              title: '网络缓慢，请刷新页面',
              duration: 5000,
              icon: 'loading'
            })
          }
        } else {
          console.log(payRes)
          await Taro.showToast({
            title: '支付失败',
            duration: 5000,
            icon: 'error'
          })
        }
      } else {
        console.log("活动页面：发起预处理请求失败")
      }
    } catch (e) {
      console.log(e)
      await Taro.showToast({
        icon: 'none',
        title: '购买失败',
        duration: 5000,
      });
    }
  }
}

export const actionRequestRefund = () => {
  return async () => {
    console.log("活动页面：用户申请退款")
    try {
      const res = await postRefundRequest({})
      if (res && res.code === 0) {
        console.log("活动页面：用户申请退款成功")
      } else {
        console.log("活动页面：用户申请退款失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fillForm = ({appId, path}) => {
  return async () => {
    console.log("活动页面：用户填写问卷星")
    try {
      await Taro.navigateToMiniProgram({
        appId: appId,
        path: path,
        success: (_) => {
          console.log("活动页面：跳转小程序成功")
        },
      });
    } catch (e) {
      console.log(e)
    }
  }
}

export const finishFillForm = (id) => {
  return async () => {
    console.log("活动页面：用户完成填写问卷")
    try {
      let res = await postFilledForm({
        'id': id
      })

      if (res && res.code === 0) {
        console.log("活动页面：填写问卷结束状态变更成功")
        //TODO 改变状态
      } else {
        console.log("活动页面：填写问卷结束状态变更失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchMatchResult = () => {
  return async dispatch => {
    console.log("活动页面：获取匹配结果")
    try {
      let res = await getMatchResult({})
      if (res && res.code === 0) {
        console.log("活动页面：获取匹配结果成功")
        dispatch(matchStateSave(res.data))
      } else {
        console.log("活动页面：获取匹配结果失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchFeedbackContent = () => {
  return async dispatch => {
    console.log("活动页面：获取反馈信息内容")
    try {
      let res = await getFeedbackContent()
      if (res && res.code === 0) {
        console.log("活动页面：获取反馈信息内容成功")
        dispatch(activitySave({
          feedBackContent: res.data
        }))
      } else {
        console.log("活动页面：获取反馈信息内容失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const sendSatisfiedFeedback = (statisfied, setShowContactModal: React.Dispatch<any>) => {
  return async () => {
    console.log("活动页面：发送满意度调查结果")
    try {
      let res = await postSatisfiedFeedback({
        satisfied: statisfied
      })

      if (res && res.code === 0) {
        console.log("活动页面：发送满意度调查结果成功")
        setShowContactModal(true)
      } else {
        console.log("活动页面：发送满意度调查结果失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchTwcResult = () => {
  return async dispatch => {
    console.log("活动页面：获取双选结果")
    try {
      let res = await getTwcResult()

      if (res && res.code === 0) {
        console.log("活动页面：获取双选结果成功")
        dispatch(twcStateSave(res.data))
      } else {
        console.log("活动页面：获取双选结果失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const sendTwcResult = (value) => {
  return async () => {
    console.log("活动页面：发送双选选择结果")
    try {
      let res = await postSendTwcResult({
        success: value
      })

      if (res && res.code === 0) {
        console.log("活动页面：发送双选选择结果成功")
      } else {
        console.log("活动页面：发送双选选择结果失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}
