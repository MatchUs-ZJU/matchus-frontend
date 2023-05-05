import request from "./request";
import { getJWT } from "./jwt";

export const getLatestActivityInfo = async () => {
  console.log('网络请求：获取最新一期活动信息和当前用户的参与情况')
  return request.get(`/activity/info`, {
    header: {
      Authorization: getJWT(),
    },
  });
}

export const getActivityInfoId = async (data) => {
  console.log('网络请求：获取某一期活动信息')
  return request.get(`/activity/info?id=${data.id}`, {
    header: {
      Authorization: getJWT(),
    },
  });
}

// 生成订单
export const postPreJoinActivity = async (id, data) => {
  console.log('网络请求：加入活动预处理')
  return request.post(`/activity/join?id=${id}`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  });
}

//使用匹配券生成订单
export const useVoucherJoinActivity = async (id, data) => {
  console.log('网络请求：使用匹配券加入活动预处理')
  return request.post(`/activity/join?id=${id}`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  });
}

// 检查支付是否成功
export const getPaymentResult = async (data) => {
  console.log('网络请求：获取支付结果')
  return request.get(`/activity/pay/receipt?orderId=${data.orderId}`, {
    header: {
      Authorization: getJWT(),
    },
  });
}

export const postRefundRequest = async (data) => {
  console.log('网络请求：用户申请退款')
  return request.post(`/activity/pay/refund`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  });
}

export const postFilledForm = async (data) => {
  console.log('网络请求：用户完成问卷')
  return request.post(`/activity/matchRequest`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  });
}

export const getMatchResult = async (id) => {
  console.log('网络请求：获取匹配结果')
  return request.get(`/activity/match?id=${id}`, {
    header: {
      Authorization: getJWT(),
    },
  })
}

export const getMatchFeedback = async (activityId) => {
  console.log('网络请求：获取匹配反馈')
  return request.get(`/activity/matchFeedback?id=${activityId}`, {
    header: {
      Authorization: getJWT(),
    },
  })
}

export const postMatchFeedback = async (data) => {
  console.log('网络请求：上传匹配反馈')
  return request.post(`/activity/matchFeedback`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  })
}


export const getMatchQuestion = async (id) => {
  console.log('网络请求：获取每日问答')
  return request.get(`/activity/question?id=${id}`, {
    header: {
      Authorization: getJWT()
    }
  })
}

export const postMatchQuestionApproval = async (data) => {
  console.log('网络请求：赞同')
  return request.post(`/activity/approval`, {
    data,
    header: {
      Authorization: getJWT()
    }
  })
}

export const postMatchQuestionAnswer = async (data) => {
  console.log('网络请求：回答问题')
  return request.post(`/activity/question`, {
    data,
    header: {
      Authorization: getJWT()
    }
  })
}

export const postSatisfiedFeedback = async (data) => {
  console.log('网络请求：上传匹配满意程度')
  return request.post(`/activity/match/satisfied`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  })
}

export const postSendFeedback = async (data) => {
  console.log('网络请求：上传匹配后每日反馈')
  return request.post(`/activity/match/feedback`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  })
}

export const getFeedbackContent = async () => {
  console.log('网络请求：获取反馈问题内容')
  return request.get(`/activity/match/feedback`, {
    header: {
      Authorization: getJWT(),
    },
  })
}

export const postSendTwcResult = async (data) => {
  console.log('网络请求：发送用户双选结果')
  return request.post(`/activity/twc`, {
    data,
    header: {
      Authorization: getJWT(),
    },
  })
}

export const getTwcResult = async (id) => {
  console.log('网络请求：获取双选结果')
  return request.get(`/activity/twc?id=${id}`, {
    header: {
      Authorization: getJWT(),
    },
  })
}

export const getMatchAnalysisData = async (id) => {
  console.log('网络请求：获取匹配分析数据')
  return request.get(`/activity/analysis?activityId=${id}`, {
    header: {
      Authorization: getJWT(),
    },
  })
}

export const notifyMatchSubscribe = async () => {
  console.log('網絡請求：確認訂閲通知')
  return request.post(`/activity/subscribe`, {
    data: { success: true },
    header: {
      Authorization: getJWT(),
    }
  })
}

export const getActivityData = async () => {
  console.log('网络请求:获取小程序相关数据')
  return request.post(`/activity/data`, {
    header: {
      Authorization: getJWT(),
    }
  })
}
