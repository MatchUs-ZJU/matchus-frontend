import Taro from "@tarojs/taro";
import { Button, Text, View } from "@tarojs/components";
import { Image } from "@taroify/core"
import './index.scss'
import { useEffect, useState } from "react";
import { submitOkIcon } from '@/assets/images'

const submitOk = () => {
  const [countdown, setCountdown] = useState(5);
  const close = () => {
    Taro.navigateTo({ url: '/pages/user/help/index' });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      Taro.navigateTo({ url: '/pages/user/help/index' });
    }, countdown * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000); // 每秒更新一次 countdown

      return () => {
        clearInterval(interval); // 清除计时器
      };
    }
  }, []);

  return (
    <View className="big-container">
      <View className="up-container">
        <Image src={submitOkIcon} className="icon" />
        <View className="frame-two">
          <View className="txt-one">产品优化建议已提交</View>
          <View className="txt-two">MatchUs团队将尽快处理</View></View>
      </View>
      <View className="down-container">
        <Button onClick={() => close()} className="close-btn">
          <Text className="txt">关闭</Text>
        </Button>
        <View className="bye">
          <Text className="txt">{countdown}秒后自动返回</Text></View>
      </View>
    </View>
  );
}

export default submitOk;