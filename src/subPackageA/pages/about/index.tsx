import { View, Text } from "@tarojs/components";
import { Image } from "@taroify/core";
import { AboutUsTopImage } from "@/assets/images";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivityData } from "@/actions/activity";
import activity from "@/reducers/activity";
import "./index.scss";

export default () => {
  const dispatch = useDispatch();
  const { matched, totalTerm, totalParticipate, unavailable } = useSelector(
    (state) => state.activity
  );
  useEffect(() => {
    dispatch(fetchActivityData());
  }, []);

  return (
    <View className="container wrapper">
      <Image src={AboutUsTopImage} className="img" />
      <View className="content">
        <View className="p1 margin-bottom-24 margin-top-12">
          你好👋，感谢你参与到MatchUs匹配计划！️
        </View>
        <View className="p1 margin-bottom-24">
          <Text className="highlight">「 我们是谁 👀 」</Text>
          我们是纯纯浙大背景的创业团队，这里有产品大佬，也有算法大神，还有数院运筹学团队加持，我们来自学生会、创赛先锋、投行、CAD实验室、竺院……总之是一群有趣的人，我们既研究现实主义的条件匹配和算法流程，也在探索着浪漫主义的交友心理和性格玄学。️
        </View>
        <View className="p1 margin-bottom-24">
          <Text className="highlight">「 做了什么 🙌️ 」</Text>我们运营MatchUs
          ZJU公众号以及MatchUs小助手微信号已经有小半年了，在浙大校内进行了
          {totalTerm}次交友匹配活动，一共有{totalParticipate}
          +人次参与到我们的匹配计划中。匹配成功{matched}+，仅目前已有
          {unavailable / 2}+对有缘人从浙里牵手走向未来。
        </View>
        <View className="data">
          <View className="row margin-bottom-24">
            <View className="col gradedata">
              <View className="upper">
                {totalTerm}
                <View className="inner">期</View>
              </View>
              <View className="lower">校内匹配活动</View>
            </View>
            <View className="col gradedata">
              <View className="upper">{totalParticipate}</View>
              <View className="lower">活动参与人数</View>
            </View>
          </View>
          <View className="row margin-bottom-24">
            <View className="col gradedata">
              <View className="upper">{matched}</View>
              <View className="lower">匹配成功人数</View>
            </View>
            <View className="col gradedata">
              <View className="upper">{unavailable}</View>
              <View className="lower">成功脱单人数</View>
            </View>
          </View>
        </View>
        <View className="p1 margin-bottom-24">
          <Text className="highlight">「 关于小程序 👉 」</Text>
          通过问卷和深度访谈，我们和用户一起成长，不断修改问卷的细节问题，不断调节线上聊天和双选的时间间隔，共同调制出理智又浪漫的脱单秘方，呈现在当前的小程序中。️
        </View>
        <View className="p1 margin-bottom-24">
          <Text className="highlight">「 我们希望 😇 」</Text>
          我们希望灵魂契合的ZJUers相遇在最美好的年岁，谈一场属于这个年纪的恋爱；我们也希望优秀且独特的你遇到同样优秀且独特的Ta，给彼此带去未来认同感。
          如果你准备好了真诚地对待每一个可能性，就开启匹配吧！️
        </View>
      </View>
    </View>
  );
};
