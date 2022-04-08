import {View, Image} from "@tarojs/components";
import './index.scss';
import {Rules} from "@/assets/images";


const Index = () => {
  return(
    <View className='container wrapper'>
      <View className='content'>
        <View className='h2 purple margin-bottom-12'>一、活动介绍</View>
        <View className='p1 margin-bottom-12'>MatchUs致力于解决本校学生交友渠道少、交友质量低等问题，希望参与者能在试错成本尚低的学生时代，把握住浙大校内的优质资源，找到对的人，然后勇敢地谈恋爱。
MatchUs活动特色在于以下几点：</View>
        <View className='p1 margin-bottom-12'><View className='highlight'>1、精细匹配：</View>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;按双方要求进行精细匹配，能满足参与者重视的多重要求，降低参与者的试错成本，避免出现强行配对现象。️</View>
        <View className='p1 margin-bottom-12'><View className='highlight'>2、实名核验：</View>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;活动将确保参与者均为浙江大学在校生。️</View>
        <View className='p1 margin-bottom-12'><View className='highlight'>3、过程助攻：</View>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;在规定的时点开放双向选择环节，双方各自决定是否选择继续深入了解以及是否线下见面。</View>
        <View className='p1 margin-bottom-48'><View className='highlight'>4、真诚交友：</View>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;设立举报机制防止信息造假等恶劣行为，防止海王重复交友。</View>

        <View className='h2 purple margin-bottom-12'>二、活动流程</View>
        <Image src={Rules} className='img margin-bottom-48 col'></Image>

        <View className='h2 purple margin-bottom-12'>三、活动收费</View>
        <View className='h3 purple margin-bottom-12'>1、报名费用</View>
        <View className='p1 margin-bottom-12'>9.9元/次 </View>
        <View className='p1 margin-bottom-12'>在报名时收取报名费用；若匹配失败，报名费将会退回。</View>
        <View className='p1 margin-bottom-12'>PS：匹配失败指未在匹配库中找到双向契合的匹配对象。</View>
        <View className='h3 purple margin-bottom-12'>2、脱单奖励</View>
        <View className='p1 margin-bottom-48'>通过本项目脱单的情侣，参与线下访谈可获得99元以上“恋爱红包”。</View>

        <View className='h2 purple margin-bottom-12'>四、报名问卷</View>
        <View className='h3 purple margin-bottom-12'>1、问卷收集目的</View>
        <View className='p1 margin-bottom-12'>MatchUs将对您的个人信息和匹配要求进行收集，更好地了解您的特点和需求以便于更加精确的匹配。</View>
        <View className='h3 purple margin-bottom-12'>2、报名问卷内容</View>
        <View className='p1 margin-bottom-12'><View className='highlight'>①个人信息：</View>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;️包括姓名、年龄、学院、地域、身高、性格、爱好、生活习惯等，并要求上传个人照片和校园卡信息以供人工核实身份信息。</View>
        <View className='p1 margin-bottom-12'><View className='highlight'>②匹配要求：</View>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;️与个人信息部分相对应，主要填写您对匹配对象的要求和期待。您需要从众多匹配指标中选择您最关注的5个指标，再填写每个指标的具体内容。</View>
        <View className='h3 purple margin-bottom-12'>3、问卷填写重点提示</View>
        <View className='p1 margin-bottom-12'>①为了提高双方真实的契合度，请您如实地、真诚地填写问卷信息。</View>
        <View className='p1 margin-bottom-12'>②匹配将严格按照所填区间进行筛选，请确保您可以接受所填指标的上、下限。</View>
        <View className='p1 margin-bottom-48'>③若想尽量避免匹配失败，可以尝试放宽条件。</View>

        <View className='h2 purple margin-bottom-12'>五、匹配流程</View>
        <View className='h3 purple margin-bottom-12'>1、匹配准则</View>
        <View className='p1 margin-bottom-12'>匹配将严格按照您所选指标和填写的区间进行筛选，将综合性格、个人特质等综合信息进行一对一匹配。 </View>
        <View className='h3 purple margin-bottom-12'>2、匹配结果</View>
        <View className='p1 margin-bottom-48'>匹配结果将按照既定时间在小程序上公布，并将推送提醒活动参与者；匹配成功可看到对方基础信息，添加对方微信后即可开启聊天；若匹配失败，请不要灰心，缘分还在路上~</View>

        <View className='h2 purple margin-bottom-12'>六、双选环节</View>
        <View className='p1 margin-bottom-12'>在匹配结果公布后的第5天设立双选环节，此环节用于传达双方是否愿意继续进行了解的意愿。</View>
        <View className='p1'>若双选成功，则双方可看到进一步的信息以深入了解对方，以及决定是否想要继续聊天或线下见面。</View>
      </View>
    </View>
  )
}

export default Index

