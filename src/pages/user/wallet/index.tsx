import Taro from "@tarojs/taro";
import { Button, Text, View } from "@tarojs/components";
import { Image } from "@taroify/core"
import {
  moneyIcon, halfCircle
} from "@/assets/images";
import './index.scss'
import { getVoucherInfo } from '@/services/user';
import { useEffect, useState } from "react";

const WalletInfo = () => {
  const [voucherValidity, setVoucherValidity] = useState('');
  const [voucher, setVoucher] = useState([]);
  let voucherValidityText = '';

  useEffect(() => {
    async function fetchData() {
      const res = await getVoucherInfo();
      if (res && res.code === 0) {
        const voucherData = res.data;
        console.log('333', voucherData);
        const newVoucher = voucherData.map((coupon) => {
          const startTime = new Date(coupon.createTime).toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '.');
          const endTime = new Date(coupon.updateTime).toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '.');
          voucherValidityText = `有效期 ${startTime}-${endTime}`;
          console.log(startTime, endTime, voucherValidityText);
        });
        setVoucher(newVoucher);
      }
    }
    fetchData();
  }, []);

  return (
    <View className="big-container">
      <View className='container'>
        {voucher.map((coupon, index) => (
          <View className="coupon" key={index}>
            <View className="icon-container">
              <Image src={moneyIcon} className='item-icon' />
              <Image src={halfCircle} className='item-circle' />
            </View>
            <View className="text-container">
              <Text className="text-title">匹配券</Text>
              <View className="text-information-one">&#x1F497;免费参与一次匹配</View>
              <View className="text-information-two">匹配失败恕不退回</View>
              <Text className="text-time">{voucherValidityText}</Text>
            </View>
            <Button className='to-use-btn' onClick={() => {
              Taro.switchTab({
                url: '/pages/activity/index/index'
              })
            }}>
              <Text className="to-use-txt" >去使用</Text>
            </Button>
          </View>
        ))}
      </View>
    </View >
  )
}


export default WalletInfo;

