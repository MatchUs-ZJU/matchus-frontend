const APP_URI = '/app'

const ROOT_URL = process.env.NODE_ENV === 'development' ?

    // 线下开发地址（通过npm run dev命令）
<<<<<<< HEAD
<<<<<<< HEAD
    "https://backend-dev-1929900-1309499644.ap-shanghai.run.tcloudbase.com"
  // 'https://matchuszju.com'
    : process.env.NODE_ENV === 'development-test' ?
    // 模拟生产环境、真机测试地址（通过npm run dev-test命令）
    "https://backend-dev-1929900-1309499644.ap-shanghai.run.tcloudbase.com" :
    // 'https://matchuszju.com':
=======
    'https://springboot-3rsi-1929900-1309499644.ap-shanghai.run.tcloudbase.com' : process.env.NODE_ENV === 'development-test' ?
    // 模拟生产环境、真机测试地址（通过npm run dev-test命令）
    'https://springboot-3rsi-1929900-1309499644.ap-shanghai.run.tcloudbase.com' :
>>>>>>> 4961d387d87eacff51bc75f0ed5b3293c2213e77
=======
    'https://springboot-3rsi-1929900-1309499644.ap-shanghai.run.tcloudbase.com' : process.env.NODE_ENV === 'development-test' ?
    // 模拟生产环境、真机测试地址（通过npm run dev-test命令）
    'https://springboot-3rsi-1929900-1309499644.ap-shanghai.run.tcloudbase.com' :
>>>>>>> origin/develop_ppp
    // 线上及默认地址（通过npm run build命令）
    // 'https://springboot-3rsi-1929900-1309499644.ap-shanghai.run.tcloudbase.com';
    'https://springboot-sipn-1869495-1309499644.ap-shanghai.run.tcloudbase.com';


const CLOUD_ENV = process.env.NODE_ENV === 'development' ?
    // 线下开发地址（通过npm run dev命令）
    // 'matchus-backend-dev-8cpqf11d7b0e'
  'prod-3gmomtqs65fff710'
  : process.env.NODE_ENV === 'development-test' ?
    // 模拟生产环境、真机测试地址（通过npm run dev-test命令）
    'matchus-backend-dev-8cpqf11d7b0e' :
    // 线上及默认地址（通过npm run build命令）
    // 'matchus-backend-dev-8cpqf11d7b0e';
    'prod-3gmomtqs65fff710';

const BASE_URL = `${ROOT_URL}${APP_URI}`
console.log('项目后台: ', BASE_URL)
console.log('云服务环境: ', CLOUD_ENV)

export {CLOUD_ENV, BASE_URL}
