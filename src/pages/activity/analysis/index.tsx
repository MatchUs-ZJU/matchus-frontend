import {View, Image, Text, ScrollView} from "@tarojs/components";
import {ArrowLeft, InfoOutlined} from "@taroify/icons";
import Taro from "@tarojs/taro";
import {AnalysisHeaderImage, AnalysisHeartbrokenImage} from "@/assets/images";
import {NoticeBar, Skeleton, WhiteSpace} from "@taroify/core";
import {useDispatch, useSelector} from "react-redux";
import classnames from "classnames";
import {useEffect, useState} from "react";
import {fetchMatchAnalysisData} from "@/actions/activity";
import {IMatchCondition} from "@/typings/types";

import './index.scss'

const SideMargin = 16
const MatchAnalysisPage = () => {

  const dispatch = useDispatch()
  const {system} = useSelector(state => state.global)
  const {id, name} = useSelector(state => state.activity)
  const analysisData = useSelector(state => state.activity.analysis)
  const [selectedCondition, setSelectedCondition] = useState<IMatchCondition | undefined>(undefined)
  const mostBrokenCondition = analysisData?.conditions?.length ? analysisData.conditions.reduce((o1, o2) => (o1.value > o2.value) ? o2 : o1) : undefined

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if(analysisData?.conditions?.length) {
      setSelectedCondition(analysisData.conditions[0])
    }
  }, [analysisData.conditions])

  function fetchData() {
    dispatch(fetchMatchAnalysisData(id))
  }

  async function navigateBack() {
    await Taro.navigateBack()
  }

  return (
    <View className='container'>
      <View className='custom-back' onClick={navigateBack}>
        <ArrowLeft size='24px' style={{marginRight: '8px'}}/>
      </View>
      <View className='header'>
        <Image className='header-img' src={AnalysisHeaderImage}></Image>
        <View className='header-content col'>
          <View className='title'>
            匹配分析报告
            <View className='badge'>{name}</View>
          </View>
          <View className='text-1'>根据您的匹配条件，我们计算了每一项符合您要求双向匹配的用户比例</View>
          <View className='text-2'>* 双向匹配指符合您的某个条件，且您也符合对方要求</View>
          <View className='statistic row'>
            <View className='item'>
              <View className='item-title'>匹配次数</View>
              <View className='item-value'>
                {analysisData.match}<Text className='item-value-lower'>次</Text>
              </View>
            </View>
            <View className='item-divider'></View>
            <View className='item'>
              <View className='item-title'>匹配成功</View>
              <View className='item-value' style={{color: '#D5C3ED'}}>
                {analysisData.matchSuccess}<Text className='item-value-lower' style={{color: '#D5C3ED'}}>次</Text>
              </View>
            </View>
            <View className='item-divider'></View>
            <View className='item'>
              <View className='item-title'>幸运值</View>
              <View className='item-value row' style={{color: '#FFCECF'}}>
                {analysisData.lucky}<Text className='item-value-badge center-center'>+{analysisData.luckyAdd}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <NoticeBar style={{color: "#918AE3"}} className='notice'>
        <NoticeBar.Icon>
          <InfoOutlined/>
        </NoticeBar.Icon>
        <Text>条件顺序为您选择的顺序</Text>
        <Text>{'滑动查看 >>'}</Text>
      </NoticeBar>

      <ScrollView
        className='condition-container'
        scrollX
        scrollWithAnimation
        style={{width: (system?.windowWidth! - SideMargin).toString() + 'px'}}
      >
        {
          analysisData?.conditions?.length ? analysisData?.conditions?.map(item =>
              <View
                className={classnames(
                  'condition-item',
                  {'condition-item--selected': selectedCondition && (selectedCondition.index === item.index)},
                  {'condition-item--not-selected': !selectedCondition || (selectedCondition.index !== item.index)}
                )}
                onClick={() => {
                  setSelectedCondition(item)
                }}
              >
                <View className='condition-header'>
                  {item.index}<Text className='condition-title'>{item.condition}</Text>
                </View>
                <View className='condition-content'>{item.value}</View>
              </View>
            )
            :
            <>
              <Skeleton animation='wave'/>
              <WhiteSpace/>
              <Skeleton animation='wave'/>
              <WhiteSpace/>
              <Skeleton animation='wave'/>
            </>
        }
      </ScrollView>
      <View className='display col'>
        <View className='display-value'>{selectedCondition ? (selectedCondition.match_percent * 100).toFixed(2) : 0}%</View>
        <Image src={AnalysisHeartbrokenImage} className='display-heartbroken'/>
        <View className='display-content col'>
          <View className='text-1'>根据本次匹配结果，对您杀伤率最大的条件为：</View>
          <View className='text-2'>{mostBrokenCondition?.index}-{mostBrokenCondition?.condition}</View>
          <View className='text-3'>{mostBrokenCondition?.value}</View>
          <View className='text-4'>若放宽该条件可增大匹配成功率！</View>
          <View
            className='display-button'
            onClick={async () => {
              await Taro.navigateTo({url: '/pages/user/survey-info/index'})
            }}
          >查看匹配要求</View>
          <View className='display-note'>- 结果仅供参考，期待您的下次参与！-</View>
        </View>
      </View>
    </View>
  )
}

export default MatchAnalysisPage
