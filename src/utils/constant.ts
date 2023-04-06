export const AddressData = [
  '浙江省-杭州市',
  '浙江省-非杭州市',
  '北京市',
  '上海市',
  '天津市',
  '重庆市',
  '黑龙江省',
  '吉林省',
  '辽宁省',
  '内蒙古',
  '河北省',
  '新疆',
  '甘肃省',
  '青海省',
  '陕西省',
  '宁夏',
  '河南省',
  '山东省',
  '山西省',
  '安徽省',
  '湖北省',
  '湖南省',
  '江苏省',
  '四川省',
  '贵州省',
  '云南省',
  '广西省',
  '西藏',
  '江西省',
  '广东省',
  '福建省',
  '台湾省',
  '海南省',
  '香港',
  '澳门',
  '海外'
]

export const TOAST_SHOW_TIME = 3000

export enum WARNING_NOTE{
  REQUIRED='*此项必填',
  INVALID_NUMBER = '*请输入数字',
  INVALID_PHONE = '*请输入正确手机号',
  INVALID_WECAHT = '*请输入正确微信号',
  INVALID_BLANK='*不可提交空内容><',
  INVALID_PHOTO='*至少上传一张照片',
  REQUIRED_OTHER='*其他不可为空',
  AT_LEAST_ONE = '*请至少选择一项',
  PLZ_CHOOSE_ONE = '*请完成选项',
  OUT_OF_BOUNDARY = '*数值异常不符合要求',
  INVALID_RANGE = '上下界限不符合要求'
}

export enum GENDER {
  FEMALE=2,
  MALE= 1,
}

export enum QUESTION_TYPE{
  MULTI_CHOICE = 'MULTI_CHOICE',
  ORDER = 'ORDER',
  RANGE = 'RANGE',
  SINGLE = 'SINGLE',
  OPTION_CHECK = 'OPTION_CHECK',
  OPTION_SINGLE = 'OPTION_SINGLE'
}

export enum INPUT_TYPE{
  STUDENT_NUMBER=1,
  PHONE_NUMBER=2,
  WECHAT_NUMBER=3,
  HEIGHT=4,
  WEIGHT=5,
  GRADUATE_WORK_DETAIL=6,
  MBTI = 7,

  SUPER_POWER = 8,
  EMO = 9,
  SAY = 10,
  REAL_NAME=11,

  REQUIRED = 12,
  NOT_REQUIRED = 13,
  NUMBER = 14,
  LONG_INPUT = 15
}

export enum CHECK_TYPE{
  TEMPER = 1,
  FUTURE_BASE = 2,
  INDUSTRY = 3,

  WECHAT_FIRST_TIME = 4,
  BE_FRIEND = 5,
  SHOW_LOVE = 6,
  IS_LOVER = 7,
  IS_LOVE_YOU = 8,
  CONSUMPTION=9,
  GRADUATE_INCOME = 10,
  INTEREST=11
}

export enum PICKER_TYPE{
  COMMON=1,
  ADDRESS=2,
  DATE=3
}

export enum USER_TYPE{
  OTHER=0,
  STUDENT=1,
  GRADUATE_WITH_3_YEAR=2,
  GRADUTE_MORE_THAN_3_TEAR=3,
  GRADUATE=4,
}

export enum USER_TYPE_STEPS{
  CLOSE,
  CHOOSE,
  UPLOAD,
  FINISH
}

export const USER_TYPE_STRING=['在校生','校友']

export const TEMPERAMENT = {
female: [{label:'可爱清秀',selected:false},
          {label:'朴实亲和',selected:false},
          {label:'成熟知性',selected:false},
          {label:'高冷御姐',selected:false},
          {label:'性感妩媚',selected:false},
          {label:'开朗搞笑',selected:false}],
male: [{label:'清秀少年',selected:false},
        {label:'开朗逗比',selected:false},
        {label:'酷帅潮流',selected:false},
        {label:'运动健壮',selected:false},
        {label:'成熟稳重',selected:false},
        {label:'朴实亲和',selected:false}]
}

export const CURRENT_TYPE = ['在校生','毕业生','教职工']
export const CURRENT_CAMPUS = [
  '紫金港校区','玉泉校区','西溪校区','华家池校区','之江校区','舟山校区','海宁国际校区','工程师学院','杭州国际科创中心','宁波校区'
]
export const INTEREST = [
  {label:'健身',selected: false},
  {label:'跑步',selected: false},
  {label:'球类运动',selected: false},
  {label:'手游',selected: false},
  {label:'端游',selected: false},
  {label:'综艺',selected: false},
  {label:'电影',selected: false},
  {label:'动漫',selected: false},
  {label:'KTV(唱歌)',selected: false},
  {label:'音乐节&livehouse',selected: false},
  {label:'音乐',selected: false},
  {label:'舞蹈',selected: false},
  {label:'画画',selected: false},
  {label:'旅游',selected: false},
  {label:'爬山',selected: false},
  {label:'摄影',selected: false},
  {label:'棋牌麻将',selected: false},
  {label:'桌游（狼人杀等）',selected: false},
  {label:'阅读',selected: false},
  {label:'剧本杀密室',selected: false},
  {label:'宠物（撸猫撸狗）',selected: false},
  {label:'看展（博物艺术）',selected: false},
  {label:'其他',selected:false}
]

export const INDUSTRY = [
  {label:'政府/非盈利机构/科研',selected: false},
  {label:'金融/银行/保险',selected: false},
  {label:'IT/互联网/通信/电子',selected: false},
  {label:'医药生物/医疗保健',selected: false},
  {label:'广告/传媒/印刷出版',selected: false},
  {label:'管理咨询/教育/法律',selected: false},
  {label:'能源矿产/石油化工',selected: false},
  {label:'消费零售/贸易/交通物流',selected:false},
  {label:'房产/建筑/物业',selected: false},
  {label:'加工制造/仪表设备',selected:false}
]

export const FUTURE_BASE = AddressData.map((item)=> {
  return {label:item, selected:false}
})
  // [
  // {label:'浙江杭州',selected:false},
  // {label:'浙江省（杭州除外）',selected: false},
  // {label:'江苏省',selected: false},
  // {label:'上海市',selected: false},
  // {label:'北京市',selected: false},
  // {label:'珠三角',selected: false},
  // {label:'川渝',selected: false},
  // {label:'我要自己选',selected: false}]

export const CURRENT_STATUS = ['本科','全日制硕士','全日制博士','非全日制硕士','非全日制博士']
export const CURRENT_GRADE = ['一年级','二年级','三年级','四年级','五年级及以上']
export const ONE_YEAR_STATUS = ['仍在学校','即将离校（工作、保研/考研外校等）','出国深造']
export const SCHOOL_GRADUATE_IN_SEP = ['是','否']
export const PHYSIQUE = ['瘦','微瘦','正常','微胖','胖']
export const LOVE_HISTORY = ['0次','1次','2次','3次','4次及以上']
export const CONSUMPTION = [{label:'1k以下',selected:false}, {label:'1k-2k',selected: false}, {label:'2k-3k',selected: false}, {label:'3k-4k',selected:false}, {label:'4k以上',selected:false}]
export const CONSUMPTION_SHARE = ['男生承担大部分','女生承担大部分','严格AA制','不用算清有来有往']
export const HABIT_FREQUENCY = ['5-7次/周','3-4次/周','1-2次/周','1-3次/月','无']
export const GRADUATE_EDUCATION = ['本科毕业','硕士毕业','博士毕业']
export const GRADUATE_WORK_LOCATION = []
export const GRADUATE_INCOME = [
  {label:'12w内',selected:false}, {label:'12w-18w',selected: false}, {label:'18w-25w',selected: false}, {label:'25w-50w',selected:false}, {label:'50w以上',selected: false}
]
export const TAKE_DESIRE = [
  '脱单意愿较低：目前单身，但不着急，交个朋友',
  '脱单意愿不强：佛系随缘，不会主动，合适者来',
  '脱单意愿较强：乐于了解，条件合适，主动追求',
  '脱单意愿强烈：打开话匣，展示自己，直球出击'
]
export const SUBJECT_QUESTION = {
  super_power: '如果你明天一觉醒来就能拥有某种才能或能力，你希望那会是什么能力呢？',
  emo: '当你有坏情绪（emo）的时候会怎么发泄？',
  say: '对未来的新朋友说一句话吧^^',
  wechatFirstTime:
    {question:'你刚加到理想型的微信，你第一时间会想：',
      choices: [
        '速速翻一遍Ta的朋友圈，感叹Ta好可爱/帅啊，但是要不要赞呢',
        '把自己朋友圈里不修边幅的照片给隐藏了',
        '紧张，先说什么好呢？',
        '其他',
      ],
      selfAnswer: ''
    },
  showLove: {
    question: '你刚喜欢上你的理想型，但不确定ta是否喜欢你，你会怎样表达爱慕？',
    choices: [
      '“在嘛？”',
      '“我今天遇到一个人跟你长得好像哦”',
      '“你朋友圈去的那个地方我也很喜欢”',
      '发一条Ta感兴趣的朋友圈引起Ta的注意',
      '开始想各种办法施展土味情话',
      '其他'
    ],
    selfAnswer: ''
  },
  beFriend: {
    question: '哪个瞬间最会让你首先觉得你们从认识变成朋友了？',
    choices: [
      '从点赞之交变成秒评之交了',
      '你们互关了对方的微博',
      '刚才朋友圈发的照片是Ta给你拍的',
      '聊天措辞从谨慎变得越来越沙雕了',
      '其他'
    ],
    selfAnswer: ''
  },
  isLover: {
    question: '你们还没确定关系，哪个瞬间会突然让你感觉仿佛你们已经是恋人？',
    choices: [
      '你发的消息Ta总是秒回',
      '无意间你认识了Ta的大部分朋友',
      '掐指一算，你就知道Ta这个时间在干嘛',
      '对彼此的过往都有了很深的了解',
      '每天都会互道早晚安',
      '其他'
    ] ,
    selfAnswer: ''
  },
  isLoveYou: {
    question: '终于，在哪一刻你确定ta也喜欢你？',
    choices: [
      'Ta对别人爱答不理，在你面前则甘愿做个喜剧人',
      '不光回应你的话题，还会主动来找你开启新的话题',
      '从不拒绝你的邀约',
      '当你表达醋意后，Ta会拼命给你解释',
      '眼里写着喜欢你',
      '其他'
    ] ,
    selfAnswer: ''
  }
}
