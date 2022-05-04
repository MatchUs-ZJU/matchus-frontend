const ROOT_URL = process.env.NODE_ENV === 'development' ?
    // 线下开发地址
    'https://springboot-sipn-1869495-1309499644.ap-shanghai.run.tcloudbase.com' : (process.env.TEST === 1 ?
    // 测试地址
    'https://www.matchuszju.com' :
    // 线上开发地址
    'https://springboot-sipn-1869495-1309499644.ap-shanghai.run.tcloudbase.com');

const APP_URI = '/app'

export const BASE_URL = `${ROOT_URL}${APP_URI}`

export const CLOUD_ENV = 'prod-3gmomtqs65fff710'
export const WX_SERVICE_NAME = 'springboot-sipn'
