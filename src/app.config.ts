export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/activity/page-1/index',
    'pages/user/index',
    'pages/about/index',
    'pages/identify/index',
    'pages/information/index',
    'pages/activity/page-2/index',
    'pages/user/help',
    'pages/user/records'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'MatchUs',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    selectedColor: '#caccef',
    borderStyle: 'white',
    list: [
      {
        text: '首页',
        pagePath: 'pages/home/index',
        iconPath: 'assets/images/tablist/home.png',
        selectedIconPath: 'assets/images/tablist/home-s.png',
      },
      {
        text: '活动',
        pagePath: 'pages/activity/page-2/index',
        iconPath: 'assets/images/tablist/activity.png',
        selectedIconPath: 'assets/images/tablist/activity.png',
      },
      {
        text: '我的',
        pagePath: 'pages/user/index',
        iconPath: 'assets/images/tablist/my.png',
        selectedIconPath: 'assets/images/tablist/my-s.png',
      },
    ],
  },
  navigateToMiniProgramAppIdList: ["wxd947200f82267e58"]
})
