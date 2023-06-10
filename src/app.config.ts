export default defineAppConfig({
  lazyCodeLoading: 'requiredComponents',
  pages: [
    'pages/home/index/index',
    'pages/home/article-view/index',

    'pages/activity/index/index',
    'pages/activity/match-result/index',
    'pages/activity/analysis/index',
    'pages/activity/choose-result/index',
    'pages/activity/rules/index',

    'pages/user/index/index',
    'pages/user/help/index',
    'pages/user/record/index',
    'pages/user/identify/index',
    'pages/user/information/index',
    'pages/user/register/index',
    'pages/user/survey-info/index',
    'pages/user/survey-info-edit/index',
    'pages/user/wallet/index',
    'pages/user/productFeedback/index',
    'pages/user/submitOK/index',
  ],
  subPackages: [
    {
      root: 'subPackageA',
      pages: [
        'pages/introduction/index',
        'pages/privacy/index',
        'pages/about/index',
        'pages/agreement/index',
      ]
    },
    {
      root: 'subPackageB',
      pages: [
        'user/personal-info-modify/index',
        'user/personal-info-fill/index',
      ]
    }
  ],
  window: {
    backgroundColor: '#F3F4FB',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#918AE3',
    navigationBarTitleText: 'MatchUs',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    selectedColor: '#918AE3',
    borderStyle: 'black',
    list: [
      {
        text: '首页',
        pagePath: 'pages/home/index/index',
        iconPath: 'assets/images/tablist/home.jpg',
        selectedIconPath: 'assets/images/tablist/home-s.jpg',
      },
      {
        text: '活动',
        pagePath: 'pages/activity/index/index',
        iconPath: 'assets/images/tablist/activity.jpg',
        selectedIconPath: 'assets/images/tablist/activity-s.jpg',
      },
      {
        text: '我的',
        pagePath: 'pages/user/index/index',
        iconPath: 'assets/images/tablist/my.jpg',
        selectedIconPath: 'assets/images/tablist/my-s.jpg',
      },
      // TEST
      // {
      //   text: '111',
      //   pagePath: 'pages/activity/analysis/index',
      //   iconPath: 'assets/images/tablist/my.jpg',
      //   selectedIconPath: 'assets/images/tablist/my-s.jpg',
      // },
    ],
  },
  navigateToMiniProgramAppIdList: ["wxd947200f82267e58", "wxd947200f82267e57"],
  enablePullDownRefresh: true
})
