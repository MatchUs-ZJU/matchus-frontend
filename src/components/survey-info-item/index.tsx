import {ScrollView, Text, View} from "@tarojs/components";
import {Cell, Image} from "@taroify/core";
import {ArrowDown, ArrowUp} from "@taroify/icons";
import {useState} from "react";
import {getFormatTime} from "@/utils/ftime";
import {IInfoItem} from "@/typings/types";
import {viewImages} from "@/utils/taro-utils";

import './index.scss'

interface SurveyInfoItemProps {
  updateTime: number,
  info: IInfoItem[]
  name: string
  icon: string,
  iconSize?: number,
  defaultExpand?: boolean
  withImage?: boolean,
  images?: string[]
}

const SurveyInfoItem = (props: SurveyInfoItemProps) => {
  const {updateTime, info, icon, iconSize = 22, name, defaultExpand = false, withImage = false, images = []} = props
  const [expand, setExpand] = useState(defaultExpand)

  return (
    <View className='collapse-container'>
      <View className='collapse-header'>
        <Image src={icon} className='icon' style={{width: `${iconSize}px`, height: `${iconSize}px`}}/>
        <Text className='title'>{name}</Text>
        {expand ? <ArrowUp className='arrow' onClick={() => setExpand(!expand)}/> :
          <ArrowDown className='arrow' onClick={() => setExpand(!expand)}/>}
      </View>
      <ScrollView className='collapse-content' scrollY scrollWithAnimation style={{height: (expand ? '' : '0')}}>
        {info && info.map((item, key) => (
          <View className='field' key={key}>
            <View className='field-name'>{item.name}</View>
            {
              item.fields && item.fields
                .sort((o1, o2) => {
                  return o1.index - o2.index
                })
                .map((field) => (
                  field.multipleRow ? (
                    <Cell title={field.key} brief={field.value} className='subfield brief'/>
                  ) : (
                    <Cell title={field.key} className='subfield'>{field.value}</Cell>
                  )
                ))
            }
            {
              // TODO
              withImage && item.name === '我的照片' &&
              <Cell
                title='我的照片'
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
            }
          </View>
        ))}
      </ScrollView>
      <View className='collapse-body' style={{display: (!expand ? '' : 'none')}}>
        上次修改时间：{getFormatTime(new Date(updateTime))}
      </View>
    </View>
  )
}

export default SurveyInfoItem
