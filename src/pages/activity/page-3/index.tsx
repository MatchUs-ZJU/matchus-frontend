import {useDispatch, useSelector} from "react-redux";
import {View} from "@tarojs/components";
import {useEffect, useState} from "react";
import {AtRadio} from "taro-ui";
import {sendTwcResult} from "../../../actions";
import {fetchTwcResult} from "../../../actions/activity";

const Index = () => {
  const dispatch = useDispatch();
  const {activity, user} = useSelector(state => state)
  const currentTime = new Date();

  const [canTwc, setCanTwc] = useState(false)
  const [canViewTwcResult, setCanViewTwcResult] = useState(false)
  const [chooseValue, setChooseValue] = useState('未选择')

  useEffect(() => {
    const checkTwcState = () => {
      // 根据时间和获取到的双选信息，判断是否能够填写双选结果，并显示当前双选结果
      if (currentTime > activity.twoWayChooseStartTime! && currentTime < activity.twoWayChooseEndTime!) {
        setCanTwc(true)
      } else {
        setCanTwc(false)
      }

      if(activity.participate.twcValue) {
        setChooseValue(activity.participate.twcValue)
      }
    }

    const checkTwcResultState = () => {
      dispatch(fetchTwcResult())
      // 根据时间和获取到的匹配结果信息，判断是否可以查看匹配结果
      if (currentTime > activity.twoWayChooseEndTime! && activity.participate.twc) {
        setCanViewTwcResult(true)
      } else {
        setCanViewTwcResult(false)
      }
    }
    checkTwcState()
    checkTwcResultState()
  }, [])

  function onClickRadio(newValue) {
    setChooseValue(newValue)
    dispatch(sendTwcResult(chooseValue))
  }

  return (
    <View className='container'>
      <View>
        选择双选
      </View>
      <View>
        <AtRadio
          options={[
            { label: '成功', value: '成功', disabled: !canTwc},
            { label: '失败', value: '失败', disabled: !canTwc},
          ]}
          value={chooseValue}
          onClick={onClickRadio}
        />
      </View>

      <View>
        查看双选结果
      </View>
    </View>
  )
}

export default Index
