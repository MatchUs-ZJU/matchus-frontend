import Taro from "@tarojs/taro";
import React from "react";
import {ACTIVITY_SAVE} from "../constants";
import {postFilledOverSurvey, getLatestActivityInfo, postPreJoinActivity} from "../services/activity";

export const activitySave = (payload) => {
  return {
    type: ACTIVITY_SAVE,
    payload
  }
}

export const fetchLatestActivityInfo = () => {
  return dispatch => {
    console.log("活动页面：获取活动信息和用户参与情况")
    getLatestActivityInfo()
      .then((res) => {
        if (res) {
          dispatch(activitySave(res))
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }
}

export const actionPreJoinActivity = ({openid, term}, setCanJoin: React.Dispatch<any>) => {
  return async dispatch => {
    console.log("活动页面：发起参与活动，进行购买预处理")
    try {
      let preJoinRes = await postPreJoinActivity({
        "openid": openid,
        "term": term
      })

      if (preJoinRes) {
        // 只有相应数据不为空才能继续操作
        console.log("活动页面：发起预处理请求成功，发起支付请求")
        let {timeStamp, nonceStr, prepayId, signType, paySign} = preJoinRes
        let payRes = await Taro.requestPayment({
          timeStamp,
          nonceStr,
          package: 'prepay_id=' + prepayId,
          signType,
          paySign
        })

        if (payRes && payRes.errMsg === 'requestPayment:ok') {
          console.log(payRes)
          console.log("活动页面：支付成功")
          await Taro.showModal({
            title: '操作提示',
            content: '支付成功',
            showCancel: false,
            confirmText: '确定'
          })
          setCanJoin(false)
          // TODO 检查是否完成支付？
          await Taro.navigateTo({url: '/pages/activity/page-2'});
        } else {
          console.log(payRes)
          await Taro.showModal({
            title: '操作提示',
            content: '支付失败，请重新尝试',
            showCancel: false,
            confirmText: '确定'
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

export const actionFillSurvey = ({appId, path}) => {
  return async dispatch => {
    console.log("活动页面：用户填写问卷星")
    try {
      let cb = await Taro.navigateToMiniProgram({
        appId: appId,
        path: path,
        success: (_) => {
          console.log("活动页面：跳转小程序成功")
        },
      })
    } catch (e) {
      console.log(e)
    }
  }
}

export const actionFilledOverSurvey = (openid, term) => {
  return async dispatch => {
    console.log("活动页面：用户完成填写问卷")
    try {
      let res = await postFilledOverSurvey({
        openid, term
      })

      if (res) {
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
