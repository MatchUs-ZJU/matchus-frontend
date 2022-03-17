const ROOT_URL = process.env.NODE_ENV === 'development' ?
    // 线下开发地址
    'http://120.26.60.116:80' : (process.env.TEST === 1 ?
    // 测试地址
    'https://api.qianxu.run:80' :
    // 线上开发地址
    'https://matchuszju.com:80');

const ROOT_URI = '/app'

export const BASE_URL = `${ROOT_URL}${ROOT_URI}`

