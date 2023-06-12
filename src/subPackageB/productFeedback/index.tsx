import Taro from "@tarojs/taro";
import { Button, Text, View } from "@tarojs/components";
import { Image } from "@taroify/core"
import './index.scss'
import { useEffect, useState } from "react";
import { Field, Input, Textarea, Checkbox } from "@taroify/core";
import FeedbackImageBox from "@/components/activity-card/feedback-image-cell/feedback-image-box";
import { sendProductFeedback } from "@/actions/user";
import { useDispatch, useSelector } from "react-redux";
import PageCheckbox from "@/components/person-info/page-chekoutbox";
import classnames from "classnames";

const productFeedbackInfo = () => {
  const [checked, setChecked] = useState([]);
  const [opinion, setOpinion] = useState(''); // 新增opinion状态，用于存储用户输入的文本
  const [feedbackImages, setFeedbackImages] = useState<{ id: number }[]>([]);
  // 新增feedbackImages状态，用于存储用户上传的图片数据
  const dispatch = useDispatch();
  const { match } = useSelector(state => state)
  const [selectedValue, setSelectedValue] = useState<boolean>(true);

  const { feedback } = match
  const [wordCount, setWordCount] = useState(0);
  const maxWordCount = 200; // 最大字数限制
  const [inputFocus, setInputFocus] = useState(false)

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setOpinion(value);
    setWordCount(value.length);
  };

  const handleCheckboxChange = (values) => {
    console.log(1999, values)
    let selectedValue = true; // 默认
    values.forEach(item => {
      console.log(item)
      if (item.checked) {
        selectedValue = item.value === '是' ? 'True' : 'False'
      }
    });

    setSelectedValue(selectedValue);
    console.log(1000, selectedValue)// 更新父组件的 selectedValue
  };

  const submitProductFeedback = () => {
    console.log(111);
    let imageIds = feedbackImages.map(item => item.id);
    const contact = selectedValue === '是';

    dispatch(sendProductFeedback({ imageIds: imageIds, opinion: opinion, contact: contact }));
    Taro.navigateTo({ url: '/subPackageB/submitOK/index' });
  };

  return (
    <View className="big-container">
      <View className="big-title-container">
        <View className="title-container">
          <View className="title">MatchUs 产品优化建议</View>
          <View className="line"></View>
        </View>
        <View className="content-container">
          <Text>&#128150;感谢你选择MatchUs，有任何产品相关的建议可填表反馈，一起打造更极致的产品体验~ </Text>
          <Text>&#127873;意见被采纳的UU将获得专属MU小礼物一份哦~</Text>
        </View>
      </View>
      <View className="big-content-container">
        <View className="part">
          <View className="title-one"> 产品优化建议（必填）</View>
          <View className="border"></View>
          <View className={classnames('row textarea-wrapper', { 'textarea-wrapper-focus': inputFocus })}>
            <Field>
              <Textarea
                autoHeight
                className='content-text'
                placeholder='详细的建议能帮助我们更好地优化哦~'
                value={opinion}
                onInput={handleTextareaChange}
                maxlength={200}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
              />
            </Field>
          </View>
          <View className="word-count">{`${wordCount}/${maxWordCount}`}</View>
        </View>
        <View className="part part-two">
          <View className="title-two">相关截图（选填）</View>
          <View className="line-two"></View>
          <FeedbackImageBox
            images={feedbackImages}
            onChange={setFeedbackImages}
            changeable={feedback?.type?.code == null}
          />
        </View>
        <View className="part part-three">
          <View className="title-three">方便产品同学联系咨询详情吗？</View>
          <View className="line-three"></View>
          <PageCheckbox onChange={handleCheckboxChange} setSelectedValue={setSelectedValue} />
          <View className="button-container">
            <Button className="button" onClick={submitProductFeedback}>
              <Text className="txt">提交</Text>
            </Button>
          </View>

        </View>
      </View>
    </View >
  )
}

export default productFeedbackInfo;