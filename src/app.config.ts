export default defineAppConfig({
  pages: [
    'pages/home/index/index',
    'pages/home/article-view/index',

    'pages/activity/index/index',
    'pages/activity/match-result/index',
    'pages/activity/choose-result/index',
    'pages/activity/rules/index',

    'pages/user/index/index',
    'pages/user/help/index',
    'pages/user/record/index',
    'pages/user/about/index',
    'pages/user/identify/index',
    'pages/user/information/index',
    'pages/user/privacy/index',
    'pages/user/agreement/index',
    'pages/user/register/index',
    'pages/user/survey-info/index',
    'pages/user/personal-info-modify/index',
    'pages/user/personal-info-fill/index',

    'pages/introduction/index',
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
    ],
  },
  navigateToMiniProgramAppIdList: ["wxd947200f82267e58", "wxd947200f82267e57"],
})
