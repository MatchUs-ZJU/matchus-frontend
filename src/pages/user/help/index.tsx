import {View} from "@tarojs/components";
import {AtButton, AtDivider, AtGrid, AtIcon, AtToast} from "taro-ui";
import {useState} from "react";
import './index.scss'

const test_data = [
  {value:"喜欢、超级喜欢后可以取消吗？", answer:"111111"},
  {value:"超级喜欢后可以取消吗？", answer:"222222"},
  {value:"喜取消吗？", answer:"33333"},
  {value:"喜欢可以取消吗？", answer:"44444"},
  {value:"喜欢、超级？", answer:"55555"}
]

const Index = () => {

  let [isOpen, setIsOpen] = useState(false);
  let [text, setText] = useState('')

  const onClickQuestionItem = (item: object, index: number):void => {
    setText("A:"+item.answer)
    setIsOpen(!isOpen)
  }

  const onclose = ():void => {
    setIsOpen(!isOpen)
  }

  const onClickArtificialService = ():void => {
  //  TODO:唤起人工服务的接口
  }

  return (
    <View className='container'>
      <AtToast isOpened={isOpen}
               text={text}
               onClose={onclose.bind(this)}
      >
      </AtToast>
      <View className='basic-question'
            // style={"height:"+(test_data.length*40.5+1)+"px"}
      >
        <View className='left left-flex'
              style={"height:"+(test_data.length*80+8)+"rpx"}
        >
          <AtIcon value='help' size='20' color='$text-color'/>
          常见问题
        </View>
        <AtGrid className='right'
                mode="rect"
                columnNum={1}
                hasBorder={true}
                data={test_data}
                onClick={onClickQuestionItem.bind(this)}
        >
        </AtGrid>
      </View>
      <AtDivider className='info'
        content='^_^需要其他的帮助请联系人工客服'
        lineColor='rgb(231, 231, 231)'
        fontColor='rgb(231, 231, 231)'
      >
      </AtDivider>
      <View className='artificial-service'>
          <AtButton
            type='primary'
            circle={false}
            customStyle={{width: '100%'}}
            onClick={onClickArtificialService.bind(this)}
            className='artificial-button'
          >
            <AtIcon value='bell' size='20' color='$text-color'/>
            &nbsp;联系人工客服
          </AtButton>
      </View>
    </View>
  )
}

export default Index;
