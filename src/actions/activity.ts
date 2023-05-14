import Taro from "@tarojs/taro";
import {
  ACTIVITY_FILL_FORM_SAVE,
  ACTIVITY_CHOOSE_SAVE,
  ACTIVITY_MATCH_SAVE,
  ACTIVITY_SAVE,
  SET_HAS_VOUCHER,
  CHOOSE_SAVE,
  MATCH_SAVE,
  ACTIVITY_SIGN_UP_SAVE,
  ACTIVITY_WALLET_SAVE,
  ACTIVITY_DAILYQA_SAVE,
  ACTIVITY_APPROVE_SAVE,
  ACTIVITY_ANALYSIS_SAVE,
  ACTIVITY_BASIC_DATA_SAVE,
  MATCH_FEEDBACK_SAVE,
  SAVE_VOUCHER_READ_INFO
} from "@/constants";
import {
  postFilledForm,
  getLatestActivityInfo,
  postPreJoinActivity,
  useVoucherJoinActivity,
  getMatchResult,
  postSatisfiedFeedback,
  postSendTwcResult,
  getTwcResult,
  postSendFeedback,
  getMatchQuestion,
  postMatchQuestionApproval,
  postMatchQuestionAnswer,
  getMatchAnalysisData,
  notifyMatchSubscribe, getActivityData, postMatchFeedback, getMatchFeedback, postFeedbackImages, postCoS, postFeedback
} from "@/services/activity";
import { TOAST_SHOW_TIME } from "@/utils/constant";
import { globalSave } from "@/actions/global";
import { CoS } from "@/typings/types";
import { uploadFeedBackImage } from "@/utils/taro-utils";

export const activitySave = (payload) => {
  return {
    type: ACTIVITY_SAVE,
    payload
  }
}

export const setHasVoucher = (payload) => {
  return {
    type: SET_HAS_VOUCHER,
    payload
  }
}

export const saveVoucherReadInfo = (payload) => {
  return {
    type: SAVE_VOUCHER_READ_INFO,
    payload
  }
}

export const activityAnalysisSave = (payload) => {
  return {
    type: ACTIVITY_ANALYSIS_SAVE,
    payload
  }
}

export const activitySignUpSave = (payload) => {
  return {
    type: ACTIVITY_SIGN_UP_SAVE,
    payload
  }
}

export const saveActivityWallet = (wallet) => {
  return {
    type: ACTIVITY_WALLET_SAVE,
    payload: {
      participate: {
        wallet: wallet
      }
    }
  }
}

export const activityMatchSave = (payload) => {
  return {
    type: ACTIVITY_MATCH_SAVE,
    payload
  }
}

export const activityDailyQASave = (payload) => {
  return {
    type: ACTIVITY_DAILYQA_SAVE,
    payload
  }
}

export const activityApproveSave = (payload) => {
  return {
    type: ACTIVITY_APPROVE_SAVE,
    payload
  }
}

export const activityChooseSave = (payload) => {
  return {
    type: ACTIVITY_CHOOSE_SAVE,
    payload
  }
}

export const activityFillFormSave = (payload) => {
  return {
    type: ACTIVITY_FILL_FORM_SAVE,
    payload
  }
}

export const matchStateSave = (payload) => {
  return {
    type: MATCH_SAVE,
    payload
  }
}

export const matchFeedbackSave = (payload) => {
  return {
    type: MATCH_FEEDBACK_SAVE,
    payload
  }
}

export const twcStateSave = (payload) => {
  return {
    type: CHOOSE_SAVE,
    payload
  }
}

export const activityBasicDataSave = (payload) => {
  return {
    type: ACTIVITY_BASIC_DATA_SAVE,
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
        dispatch(activitySave(res.data));
        dispatch(setHasVoucher(res.data.hasVoucher))
      } else {
        console.log("活动页面：获取最新活动信息和用户参与情况失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const preJoinActivity = ({ id, price, body, attach }) => {
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
        let { timeStamp, nonceStr, signType, paySign } = preJoinRes.data
        let payRes = await Taro.requestPayment({
          timeStamp,
          nonceStr,
          package: preJoinRes.data.package, // package是'prepay_id=xxx'
          signType,
          paySign
        })

        if (payRes && payRes.errMsg === 'requestPayment:ok') {
          console.log("活动页面：支付成功")
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
          dispatch(activitySignUpSave({
            paid: true,
            participated: true,
            state: 'ACTIVE'
          }))

          // 用户订阅消息通知
          dispatch(notifySubscribe([
            'FGLXTk3ch9W5f8aUTiBddud61bsWlr2F3KhU2c7inGU',
            'esF-o_Wy6QFhswmn3PpTXkkitvk1QxsqAQH7zH3EB5A',
            // 'ABNu4cv1fPkKLAYqyWW-cXdAHd_Du76b5gQVWqYPG2M',
            // 'FcT_VexScd5cLvxf8wi_d9hMcBJQrDjUvQv63YN-7HU',
          ]))

          await Taro.showModal({
            title: '提示',
            content: '订阅成功',
            showCancel: false,
            confirmText: '确定'
          })

          dispatch(notifySubscribe([
            // 'FGLXTk3ch9W5f8aUTiBddud61bsWlr2F3KhU2c7inGU',
            // 'esF-o_Wy6QFhswmn3PpTXkkitvk1QxsqAQH7zH3EB5A',
            'ABNu4cv1fPkKLAYqyWW-cXdAHd_Du76b5gQVWqYPG2M',
            'FcT_VexScd5cLvxf8wi_d9hMcBJQrDjUvQv63YN-7HU',
          ]))
        } else {
          console.log(payRes)
          await Taro.showToast({
            title: '支付失败',
            duration: 3000,
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
        duration: 3000,
      });
    }
  }
}

//使用匹配券发起支付
export const preUseVoucherJoinActivity = ({ id, useVoucher, data }) => {
  return async dispatch => {
    console.log("活动页面：发起参与活动，进行购买预处理")
    // console.log('usevoucher', useVoucher)
    if (useVoucher) {
      try {
        let preJoinRes = await useVoucherJoinActivity(id, useVoucher, data)

        if (preJoinRes && preJoinRes.code === 0) {
          console.log("活动页面：支付成功")
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
          dispatch(activitySignUpSave({
            paid: true,
            participated: true,
            state: 'ACTIVE'
          }))
          // 用户订阅消息通知
          await notifySubscribe([
            'FGLXTk3ch9W5f8aUTiBddud61bsWlr2F3KhU2c7inGU',
            'esF-o_Wy6QFhswmn3PpTXkkitvk1QxsqAQH7zH3EB5A',
            // 'ABNu4cv1fPkKLAYqyWW-cXdAHd_Du76b5gQVWqYPG2M',
            // 'FcT_VexScd5cLvxf8wi_d9hMcBJQrDjUvQv63YN-7HU',
          ])

          await Taro.showModal({
            title: '提示',
            content: '订阅成功',
            showCancel: false,
            confirmText: '确定'
          })

          await notifySubscribe([
            // 'FGLXTk3ch9W5f8aUTiBddud61bsWlr2F3KhU2c7inGU',
            // 'esF-o_Wy6QFhswmn3PpTXkkitvk1QxsqAQH7zH3EB5A',
            'ABNu4cv1fPkKLAYqyWW-cXdAHd_Du76b5gQVWqYPG2M',
            'FcT_VexScd5cLvxf8wi_d9hMcBJQrDjUvQv63YN-7HU',
          ])

        } else {
          await Taro.showToast({
            title: '支付失败',
            duration: 3000,
            icon: 'error'
          })
        }
      } catch (e) {
        console.log(e)
        await Taro.showToast({
          icon: 'none',
          title: '购买失败',
          duration: 3000,
        });
      }
    }
  }
}

export const confirmSubscribe = () => {
  return async dispatch => {
    console.log('匹配訂閲確認：匹配結果通知已確認')
    try {
      const res = await notifyMatchSubscribe()
      if (res && res.code === 0) {
        dispatch(matchStateSave({ subscribe: true }))
      } else {
        console.log('匹配訂閲確認：未成功確認')
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const notifySubscribe = async (tmplIds: string[], notifyConfirm: boolean = false) => {
  // return async dispatch => {
  console.log('活动页面：用户订阅消息')
  let subscribeRes = await Taro.requestSubscribeMessage({
    tmplIds: tmplIds
  })

  if (subscribeRes?.errMsg === 'requestSubscribeMessage:ok') {
    console.log('活动页面：用户订阅消息成功')
    if (notifyConfirm && subscribeRes['49EFzIqjgDy4yVdz0Bo9pkKdT-cPP7K_99sXh51NIkk'] === 'accept') {
      dispatch(confirmSubscribe())
    }
  } else {
    console.log('活动页面：用户订阅消息失败')
    await Taro.showToast({
      icon: 'none',
      title: '消息订阅失败，您可能无法收到活动的通知',
      duration: 3000,
    });
    return
  }
  // }
}

export const fillForm = ({ appId, path }) => {
  return async () => {
    console.log("活动页面：用户填写问卷星")
    try {
      await Taro.navigateToMiniProgram({
        appId: appId,
        path: path,
        success: (_) => {
          console.log("活动页面：跳转小程序成功")
        },
        fail: async () => {
          console.log("活动页面：跳转小程序失败")
          await Taro.showToast({
            icon: 'none',
            title: '打开问卷失败',
            duration: TOAST_SHOW_TIME
          })
        }
      });
    } catch (e) {
      console.log(e)
    }
  }
}

export const finishFillForm = (surveyDetail) => {
  return async dispatch => {
    console.log("活动页面：用户完成填写问卷", surveyDetail)
    try {
      let res = await postFilledForm(surveyDetail)

      if (res && res.code === 0) {
        console.log("活动页面：填写问卷结束状态变更成功")
        dispatch(activityFillFormSave({
          filled: true
        }))
      } else {
        console.log("活动页面：填写问卷结束状态变更失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const sendFavor = ({ id, level }) => {
  return async dispatch => {
    console.log("活动页面：发送每日好感度反馈")
    try {
      let res = await postSendFeedback({
        activityId: id,
        level: level
      })

      if (res && res.code === 0) {
        console.log("活动页面：发送每日好感度反馈成功")
        if (res.data.favor !== null) {
          dispatch(activityMatchSave({
            favor: res.data.favor
          }))
        }
      } else {
        console.log("活动页面：发送每日好感度反馈失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const sendMessage = ({ message, id }) => {
  return async dispatch => {
    console.log("活动页面：发送留言")
    try {
      let res = await postSendFeedback({
        activityId: id,
        message: message
      })

      if (res && res.code === 0) {
        console.log("活动页面：发送留言成功")
        dispatch(activityChooseSave({
          message: message
        }))

        await Taro.showToast({
          title: '提交成功',
          duration: 3000,
          icon: 'success'
        })
      } else {
        console.log("活动页面：发送留言失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const sendSatisfiedFeedback = ({ id, level }) => {
  return async dispatch => {
    console.log("活动页面：发送满意度调查结果")
    try {
      let res = await postSatisfiedFeedback({
        id: id,
        level: level
      })

      if (res && res.code === 0) {
        console.log("活动页面：发送满意度调查结果成功")
        dispatch(matchStateSave({
          hasFilled: true,
          favor: level
        }))
      } else {
        console.log("活动页面：发送满意度调查结果失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchMatchResult = (id) => {
  return async dispatch => {
    console.log("活动页面：获取匹配结果")
    try {
      let res = await getMatchResult(id)
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

export const fetchMatchFeedback = (id) => {
  return async dispatch => {
    console.log("活动页面：获取匹配反馈")
    try {
      let res = await getMatchFeedback(id)
      if (res && res.code === 0) {
        console.log("活动页面：获取匹配反馈成功")
        dispatch(matchFeedbackSave(res.data))
      } else {
        console.log("活动页面：获取匹配反馈失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const sendMatchFeedback = ({ type, imageIds }) => {
  return async dispatch => {
    console.log("活动页面：发送匹配反馈")
    try {
      let res = await postMatchFeedback({
        type: type,
        imageIds: imageIds
      })
      if (res && res.code === 0) {
        console.log("活动页面：发送匹配反馈成功")
        dispatch(matchFeedbackSave(res.data))
      } else {
        console.log("活动页面：发送匹配反馈失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}


export const sendFeedback = (data) => {
  console.log("sendFeedback", data)
  return async dispatch => {
    console.log("活动页面：发送反馈")
    try {
      let res = await postFeedback(data)
      dispatch(matchFeedbackSave(res.data))
      if (res && res.code === 0) {
        console.log("活动页面：发送反馈成功")
        await Taro.showToast({
          title: '反馈成功',
          duration: 1000,
          icon: 'success'
        })
      } else {
        console.log("活动页面：发送反馈失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchMatchQuestion = (id) => {
  return async dispatch => {
    console.log("活动页面：获取每日问答")
    try {
      let res = await getMatchQuestion(id)
      if (res && res.code === 0) {
        console.log("活动页面：获取每日问答成功")
        dispatch(activityDailyQASave(res.data))
      } else {
        console.log("活动页面：获取每日问答失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const approvalAnswer = ({ activityId, questionId, approval }) => {
  return async dispatch => {
    try {
      let res = await postMatchQuestionApproval({ activityId, questionId, approval })
      if (res && res.code === 0) {
        console.log("活动页面：点赞成功")
        if (res.data.success) {
          dispatch(activityApproveSave({ before: { approval: approval } }))
        }
      } else {
        console.log("活动页面：点赞失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}


export const answerQuestion = ({ activityId, questionId, answer }) => {
  return async dispatch => {
    try {
      let res = await postMatchQuestionAnswer({ activityId, questionId, answer })
      if (res && res.code === 0) {
        console.log("活动页面：回答成功", res)
        dispatch(fetchMatchQuestion(activityId))
        await Taro.showToast({
          title: '回答成功',
          duration: 1000,
          icon: 'success'
        })
      } else {
        console.log("活动页面：回答失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const sendTwcResult = ({ id, choose }) => {
  return async dispatch => {
    console.log("活动页面：发送双选选择结果")
    try {
      let res = await postSendTwcResult({
        id: id,
        choose: choose
      })

      if (res && res.code === 0) {
        console.log("活动页面：发送双选选择结果成功")
        dispatch(activityChooseSave({
          choice: choose
        }))
      } else {
        console.log("活动页面：发送双选选择结果失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchTwcResult = (id) => {
  return async dispatch => {
    console.log("活动页面：获取双选结果")
    try {
      let res = await getTwcResult(id)
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

export const fetchMatchAnalysisData = (activityId) => {
  return async dispatch => {
    console.log("活动页面：获取匹配分析数据")
    try {
      let res = await getMatchAnalysisData(activityId)
      if (res && res.code === 0) {
        console.log("活动页面：获取匹配分析数据成功")
        dispatch(activityAnalysisSave(res.data))
      } else {
        console.log("活动页面：获取匹配分析数据失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const fetchActivityData = () => {
  return async dispatch => {
    console.log("活动页面：获取活动相关信息")
    try {
      let res = await getActivityData()
      if (res && res.code === 0) {
        console.log("活动页面：获取活动相关信息成功")
        dispatch(activityBasicDataSave(res.data))
      } else {
        console.log("活动页面：获取活动相关信息失败")
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const sendFeedbackImages = (realName, studentNumber, images: CoS[], setImages) => {
  return async dispatch => {
    console.log("活动页面：上传反馈图片")
    let uploadimages = images.filter(item => item.id == undefined)
    if (!uploadimages || uploadimages.length == 0) {
      console.log("无图片上传")
      return
    }
    let image = uploadimages[0];
    console.log("活动页面：上传反馈图片 data:", image)
    let res: any;
    try {
      res = await uploadFeedBackImage(realName, studentNumber, image);
      console.log("活动页面：上传反馈图片 res:", res)
      if (res && res.errMsg == "cloud.uploadFile:ok") {
        console.log("活动页面：上传反馈图片成功")
      } else {
        console.log("活动页面：上传反馈图片失败")
      }
    } catch (e) {
      console.log(e)
      return
    }
    console.log("活动页面：上传反馈图片到数据库")
    try {
      let t = await postCoS({ cloudId: res.fileID })
      console.log("活动页面：上传反馈图片到数据库 res:", t)
      if (t && t.code === 0) {
        console.log("活动页面：上传反馈图片到数据库成功")
        image = t.data
      } else {
        console.log("活动页面：上传反馈图片到数据库失败")
      }
    } catch (e) {
      console.log(e)
      return
    }
    console.log("活动页面：更新图片状态")
    images = images.filter(item => item.id != undefined)
    images.push(image)
    setImages(images)
    console.log("活动页面：更新图片状态成功")

    // let data

    // try {
  }
}




