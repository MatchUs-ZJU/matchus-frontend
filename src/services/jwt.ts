import Taro from "@tarojs/taro";

export const setJWT = (token) => Taro.setStorageSync('jwt', token);
export const getJWT = () => Taro.getStorageSync('jwt');
export const removeJWT = () => Taro.removeStorageSync('jwt');
