import {Text, View} from "@tarojs/components";
import {Cell, Collapse, Image} from "@taroify/core"
import "@taroify/core/collapse/style"
import {useDispatch, useSelector} from "react-redux";
import {commonquestionsIcon, artiserviceIcon, assitantIcon} from '@/assets/images'
import {fetchHelpsInfo} from "@/actions";
import {useEffect} from "react";
import './index.scss'

const Index = () => {
  const dispatch = useDispatch()
  const {help} = useSelector(state => state.resource)

  useEffect(() => {
    fetchData()
  }, [])

  function fetchData() {
    dispatch(fetchHelpsInfo())
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
            {help &&
              help.map((item, _) => {
                return (
                  <Collapse.Item title={item.question}>{item.answer}</Collapse.Item>
                )
              })
            }
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
