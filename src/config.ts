const ROOT_URL = process.env.NODE_ENV === 'development' ?
    // 线下开发地址
    'https://springboot-3rsi-1929900-1309499644.ap-shanghai.run.tcloudbase.com' : (process.env.TEST === 1 ?
    // 测试地址
    'https://springboot-3rsi-1929900-1309499644.ap-shanghai.run.tcloudbase.com' :
    // 线上地址
    'https://springboot-3rsi-1929900-1309499644.ap-shanghai.run.tcloudbase.com');
const APP_URI = '/app'
export const BASE_URL = `${ROOT_URL}${APP_URI}`

export const CLOUD_ENV = 'matchus-backend-dev-8cpqf11d7b0e'
export const SERVICE_NAME = 'springboot-3rsi'
