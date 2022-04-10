import {View, Image} from "@tarojs/components";
import {ChooseResultTopImageSuccess, ChooseResultFootImageSuccess, ChooseResultTopImageFalure, ChooseResultFootImageFailure} from "@/assets/images";
import {Divider} from "@taroify/core";
import './index.scss';
import {ArrowLeft} from "@taroify/icons";

const test = {
  'boy_name' : '吴桐',
  'girl_name': '533',
  'QandAs': [
    {'question':'不希望对方有的点','answer':'坚持己见听不进别人的'},
    {'question':'异性缘如何处理','answer':'正常交流'},
    {'question':'Ta觉得自己单身的原因','answer':'性格比较内向，社交圈很小且大部分都是女孩子，也不怎么参与社交活动，即使参加了也不会和异性有过多接触。除此之外，比较注重精神灵魂的契合，遇到的异性感觉都不太能谈的起来，虽然不存在滥的可能性但也很认真地宁缺毋滥。'}
  ],
  'message': '1223'
}

const Success = (boy_name, girl_name, QandAs, message) => {
  var list = () => {
    var res = []
    QandAs.forEach((item,i) => {
      if(i==0){
        res.push(
          <View className='margin-left-26 margin-right-22'>
            <View className='subtitle'>{item.question}</View>
            <View className='subanswer'>{item.answer}</View>
          </View>
        )
      }else{
        res.push(
          <View className='margin-left-26 margin-right-22 margin-top-28'>
            <View className='subtitle'>{item.question}</View>
            <View className='subanswer'>{item.answer}</View>
          </View>
        )
      }
    })
    return res
  }

  return(
    <View className='container'>
      <View className='back'>
        <ArrowLeft className='back-img' onClick={null}></ArrowLeft>
        双选结果
      </View>
      <View className='bg col'>
        <Image src={ChooseResultTopImageSuccess} className='top-img'/>
        <View className='boy-name'>{boy_name}</View>
        <View className='girl-name'>{girl_name}</View>
      </View>
      <View className='wrapper col'>
        <View className='content'>
          <Divider style={{ color: "#918AE3", borderColor: "#918AE3", padding: "0 16px" }}>Ta的三观</Divider>
          {list()}
          <Divider style={{ color: "#918AE3", borderColor: "#918AE3", padding: "0 16px" }}>Ta的留言</Divider>
          <View className='margin-left-26 margin-right-22 margin-bottom-20'>
            {message==''
              ?(<View className='subtitle'>Ta没有留言...</View>)
              :(<View className='subanswer'>{message}</View>)}
          </View>
        </View>
        <View className='footer margin-bottom-20'>
          <Image src={ChooseResultFootImageSuccess} className='footer-img' mode='aspectFit'/>
        </View>
      </View>
    </View>
  )
}

const Failure = (boy_name, girl_name, QandAs, message) => {
  return(
    <View className='container'>
      <View className='back'>
        <ArrowLeft className='back-img' onClick={null}></ArrowLeft>
        双选结果
      </View>
      <View className='bg-fail col'>
        <Image src={ChooseResultTopImageFalure} className='top-img-fail'/>
        <View className='boy-name-fail'>{boy_name}</View>
        <View className='girl-name-fail'>{girl_name}</View>
      </View>
      <View className='wrapper-fail col'>
        <View className='content'>
          <Divider style={{ color: "#918AE3", borderColor: "#918AE3", padding: "0 16px" }}>Ta的留言</Divider>
          <View className='margin-left-26 margin-right-22 margin-bottom-20'>
            {message==''
              ?(<View className='subtitle'>Ta没有留言...</View>)
              :(<View className='subanswer'>{message}</View>)}
          </View>
        </View>
        <View className='footer margin-bottom-20'>
          <Image src={ChooseResultFootImageFailure} className='footer-img' mode='aspectFit'/>
        </View>
      </View>
    </View>
  )
}

const Index = () => {
  const choose_result = false
  const {boy_name, girl_name, QandAs, message} = test
  if(choose_result)
    return Success(boy_name, girl_name, QandAs, message)
  else
    return Failure(boy_name, girl_name, QandAs, message)
}

export default Index

