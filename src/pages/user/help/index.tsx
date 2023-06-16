import Taro from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { Button, Cell, Collapse, Image } from "@taroify/core"
import "@taroify/core/collapse/style"
import { useDispatch, useSelector } from "react-redux";
import { commonQuestions, artiService, report, reportImage, productFeedback, FeedbackGift } from '@/assets/images'
import { fetchHelpsInfo } from "@/actions";
import { useEffect } from "react";
import { viewImages } from "@/utils/taro-utils";
import './index.scss'

const Index = () => {
  const dispatch = useDispatch()
  const { help } = useSelector(state => state.resource)
  const { contactUsUrl } = useSelector(state => state.resource.images)

  useEffect(() => {
    fetchData()
  }, [])

  function fetchData() {
    dispatch(fetchHelpsInfo())
  }



  return (
    <View className='container'>
      <View className='section'>
        <View className='title'>
          <Image lazyLoad src={commonQuestions} className='title-img' />
          <Text className='title-text'>常见问题</Text>
        </View>
        <Cell.Group inset>
          <Collapse accordion>
            {help &&
              help.map((item, _) => {
                return (
                  <Collapse.Item className='collapse-item' title={item.question}>{item.answer}</Collapse.Item>
                )
              })
            }
          </Collapse>
        </Cell.Group>
      </View>
      <View className='section margin-hor'>
        <View className='title' style={{ marginLeft: 0 }}>
          <Image lazyLoad src={productFeedback} className='title-img' />
          <Text className='title-text'>产品反馈</Text>
        </View>
        <View className='feedback' onClick={() => {
          Taro.navigateTo({
            url: '/pages/user/productFeedback/index'
          })
        }}>
          <Button className='report-btn'>
            <View className='arti-text'>
              <View className='text'>点击反馈产品优化建议</View>
              <View className='text'>有惊喜小礼品掉落&#127873;</View>
            </View>
          </Button>
          <Image className='gift-img' src={FeedbackGift} />
        </View>
      </View>
      <View className='section'>
        <View className='title'>
          <Image lazyLoad src={artiService} className='title-img' />
          <Text className='title-text'>人工客服</Text>
        </View>
        <Cell.Group inset>
          <View className='arti-service'>
            <View className='arti-text'>
              <Text>其他问题请扫码添加客服微信️咨询</Text>
              <Text>人工客服在线时间：</Text>
              <Text className='arti-text-color'>工作日：9:00-18:00</Text>
            </View>
            <View className='arti-wechat'>
              <Image src={contactUsUrl} className='arti-img' onClick={() => viewImages([contactUsUrl])} />
            </View>
          </View>
        </Cell.Group>
      </View>
      <View className='section margin-hor'>
        <View className='title' style={{ marginLeft: 0 }}>
          <Image lazyLoad src={report} className='title-img' />
          <Text className='title-text'>举报通道</Text>
        </View>
        <View className='report'>
          <Button className='report-btn' openType='contact'>
            <Text className='text'>点击此处快速进行举报</Text>
          </Button>
          <Image className='report-img' src={reportImage} />
        </View>
      </View>
    </View >
  )
}

export default Index;
