const ROOT_URL = process.env.NODE_ENV === 'development' ?
    // 线下开发地址
    'https://120.26.60.116' : (process.env.TEST === 1 ?
    // 测试地址
    'https://matchuszju.com' :
    // 线上开发地址
    'https://matchuszju.com');

const APP_URI = '/app'

export const BASE_URL = `${ROOT_URL}${APP_URI}`

