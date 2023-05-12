import Taro from "@tarojs/taro";
import { Button, Text, View } from "@tarojs/components";
import { Image } from "@taroify/core"
import {
  moneyIcon, halfCircle, knife
} from "@/assets/images";
import './index.scss'
import { getVoucherInfo } from '@/services/user';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveActivityWallet } from '@/actions/activity';
import { store } from "../../../../src/store";

// 在需要触发action的地方调用
const myWallet = { state: ' ' }
store.dispatch(saveActivityWallet(myWallet))


const WalletInfo = () => {
  const [voucherValidity, setVoucherValidity] = useState('');
  const [voucherValidityText, setVoucherValidityText] = useState('');
  const [voucher, setVoucher] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch()
  const { home, user } = useSelector((state) => state)
  const { articles, banners, data } = home
  const { needUpdate, needRead } = user
  const currentTime = new Date().getTime()
  const [, setReady] = useState(false);
  const [activityTime, setActivityTime] = useState('')
  const [countDownTime, setCountDownTime] = useState(0)
  const [countDownType, setCountDownType] = useState<'NOT_START' | 'ACTIVE' | 'FINISHED'>('NOT_START')

  const handleClick = () => {
    Taro.showToast({
      title: '非报名期内不可使用',
      duration: 3000,
      icon: 'error'
    })



    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }



  useEffect(() => {
    async function fetchData() {
      const res = await getVoucherInfo();
      if (res && res.code === 0) {
        const voucherData = res.data;
        const newVoucher = voucherData.map((coupon) => {
          const startTime = new Date(coupon.createTime).toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '.');
          const endTime = new Date(coupon.updateTime).toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '.');
          const voucherValidityText = `有效期 ${startTime}-${endTime}`;
          // console.log(startTime, endTime, voucherValidityText);
          return (voucherValidityText)
        });
        setVoucher(newVoucher);
        setVoucherValidityText(newVoucher[0]);
        if (data && data.startTime && data.endTime) {
          const getFormatTime = (time: Date) => {
            return `${time.getMonth() < 9 ? `0${time.getMonth() + 1}` : time.getMonth() + 1}.${time.getDate() < 10 ? `0${time.getDate()}` : time.getDate()}`
          }
          let startTime = new Date(data.startTime)
          let endTime = new Date(data.endTime)
          let start = getFormatTime(startTime)
          let end = getFormatTime(endTime)
          let processed: string = `${start}～${end}`;
          setActivityTime(processed)
        }
        // 处理是否能报名，计算剩余时间
        if (data && data.signUpStartTime && data.signUpEndTime) {
          if (currentTime <= data.signUpStartTime) {
            setCountDownType('NOT_START')
            setCountDownTime(data.signUpStartTime - currentTime)
          } else if (currentTime > data.signUpStartTime && currentTime < data.signUpEndTime) {
            setCountDownType('ACTIVE')
            setCountDownTime(data.signUpEndTime - currentTime)
          } else {
            setCountDownType('FINISHED')
            setCountDownTime(0)
          }
        }
      }
    }
    fetchData();
  }, [data]);



  return (
    <View className="big-container">
      <View className='container'>
        {voucher.map((coupon, index) => (
          <View className="coupon" key={index}>
            <View className="icon-container">
              <Image src={knife} className="item-knife" />
              <Image src={moneyIcon} className='item-icon' />
              <Image src={halfCircle} className='item-circle' />
            </View>
            <View className="text-container">
              <Text className="text-title">匹配券</Text>
              <View className="text-information-one">&#x1F497;免费参与一次匹配</View>
              <View className="text-information-two">匹配失败不退回</View>
              <Text className="text-time">{voucherValidityText}</Text>
            </View>
            <Button className='to-use-btn' onClick={() => {
              if (countDownType === 'ACTIVE') {
                Taro.switchTab({
                  url: '/pages/activity/index/index'
                })
                // console.log(3636, countDownType)
              } else if (countDownType === 'NOT_START') {
                handleClick()
              }
            }}>
              <Text className="to-use-txt" >去使用</Text>
            </Button>

          </View>
        ))
        }
      </View >
    </View >
  )
}

export default WalletInfo;

