import {Text, View} from "@tarojs/components";
import {Image, Button} from "@taroify/core";
import {Like} from "@taroify/icons";
import {IArticle} from "@/typings/types";
import Taro from "@tarojs/taro";
import {useEffect, useState} from "react";

import './index.scss'
import {ActivityIcon} from '../../assets/images/index'

interface ActivityCardProps {
  index:number
  info:info
}
interface info{
  title:string,
  detail:string
  add:string,
  click_content:string
}

const ActivityCard = (props: ActivityCardProps) => {
  const {index,info} = props
  console.log(props)

  return (
    <View className='row activity-card'>
      <View className='col index'>
        <View className='idx'>{index}</View>
        <Image lazyLoad src={ActivityIcon} className='img'/>
      </View>
      <View className='col intro'>
        <View className='title'>{info.title}</View>
        <View className='detail'>{info.detail}</View>
        <View className='add' onClick={()=>{console.log("test")}}>{info.add}</View>
      </View>
      <View className='col click'>
        <Button
          variant="contained"
          style={{ backgroundColor: '#918AE3', color: "#fff" }}
          shape="round"
          className='button'>
          {info.click_content}
        </Button>
      </View>
    </View>
  )
}

export default ActivityCard;
