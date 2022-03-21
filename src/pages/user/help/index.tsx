import {Text, View} from "@tarojs/components";
import {useState} from "react";
import {Cell, Collapse, Image} from "@taroify/core"
import "@taroify/core/collapse/style"
import './index.scss'
import {commonquestionsIcon, artiserviceIcon, assitantIcon} from '../../../assets/images'

const test_data = [
  {value:"喜欢、超级喜欢后可以取消吗？", answer:"111111"},
  {value:"超级喜欢后可以取消吗？", answer:"222222"},
  {value:"喜取消吗？", answer:"33333"},
  {value:"喜欢可以取消吗？", answer:"44444"},
  {value:"喜欢、超级？", answer:"55555"}
]

const Index = () => {
  var list = (data) => {
    var res = []
    data.forEach((item) => {
      res.push(
        <Collapse.Item title={item.value}>{item.answer}</Collapse.Item>
      )
    })
    return res
  }

  return (
    <View className='container'>
      <View className='common_qustions'>
        <View className='help-title'>
          <Image lazyLoad src={commonquestionsIcon} className='help-img'/>
          <Text className='help-text'>常见问题</Text>
        </View>
        <Cell.Group inset>
          <Collapse accordion>
            {list(test_data)}
          </Collapse>
        </Cell.Group>
      </View>
      <View className='artificial_service'>
        <View className='help-title'>
          <Image lazyLoad src={artiserviceIcon} className='help-img'/>
          <Text className='help-text'>人工客服</Text>
        </View>
        <Cell.Group inset>
          <View className='arti_service'>
            <View className='arti-text'>
              <Text>其他问题请扫码添加客服微信️咨询</Text>
              <Text>人工客服在线时间：</Text>
              <Text className='arti-text-color'>工作日：9:00-21:00</Text>
            </View>
            <View className='arti-wechat'>
              <Image lazyLoad src={assitantIcon} className='arti-img'/>
            </View>
          </View>
        </Cell.Group>
      </View>
    </View>
  )
}

export default Index;
