import {ScrollView, Text, View} from "@tarojs/components";
import {Cell, Image} from "@taroify/core";
import {ArrowDown, ArrowUp} from "@taroify/icons";
import {useState} from "react";
import {getFormatTime} from "@/utils/ftime";
import {ISurveyFields} from "@/typings/types";
import {viewImages} from "@/utils/taro-utils";
import {SurveyMatchIcon, SurveyUserIcon} from "@/assets/images";

import './index.scss'

interface SurveyInfoItemProps {
  updateTime: number,
  info: ISurveyFields[]
  name: string
  iconSize?: number,
  defaultExpand?: boolean
  images?: string[]
}

const getSurveyItemIcon = (name: string) => {
  if(name === '基本信息') {
    return SurveyUserIcon
  } else if(name === '匹配信息') {
    return SurveyMatchIcon
  } else {
    return SurveyUserIcon
  }
}

const SurveyInfoItem = (props: SurveyInfoItemProps) => {
  const {updateTime, info, iconSize = 22, name, defaultExpand = false, images = []} = props
  const icon = getSurveyItemIcon(name)
  const [expand, setExpand] = useState(defaultExpand)

  return (
    <View className='collapse-container'>
      {/*<View className='collapse-header'>*/}
      {/*  <Image src={icon} className='icon' style={{width: `${iconSize}px`, height: `${iconSize}px`}}/>*/}
      {/*  <Text className='title'>{name}</Text>*/}
      {/*  {expand ? <ArrowUp className='arrow' onClick={() => setExpand(!expand)}/> :*/}
      {/*    <ArrowDown className='arrow' onClick={() => setExpand(!expand)}/>}*/}
      {/*</View>*/}
      {/*<ScrollView className='collapse-content' scrollY scrollWithAnimation style={{height: (expand ? '' : '0')}}>*/}
      {/*  */}
      {/*</ScrollView>*/}
      <View className='collapse-content'>
        {info && info.map((item, key) => (
          <View className='field' key={key}>
            <View className='field-name'>{item.name}</View>
            {
              item.fields && item.fields
                .sort((o1, o2) => {
                  return o1.index - o2.index
                })
                .map((field) => (
                  field.type === 1 ? (
                    <Cell title={field.key} brief={field.value} className='subfield brief'/>
                  ) : field.type === 0 ? (
                    <Cell title={field.key} className='subfield'>{field.value}</Cell>
                  ) : field.type === 2 ? (
                    <Cell
                      title={field.key}
                      brief={
                        images && images.map((image, _) => {
                          return (
                            <Image
                              src={image}
                              lazyLoad
                              mode='aspectFill'
                              className='img'
                              onClick={() => viewImages(images, image)}
                            />
                          )
                        })
                      }
                      className='subfield brief'
                    />
                  ) : <></>
                ))
            }
          </View>
        ))}
      </View>

      <View className='collapse-body' style={{display: (!expand ? '' : 'none')}}>
        上次修改时间：{getFormatTime(new Date(updateTime))}
      </View>
    </View>
  )
}

export default SurveyInfoItem
