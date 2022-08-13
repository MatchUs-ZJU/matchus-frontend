import {PersonalInfoAddPhoto} from "@/assets/images";
import {View} from "@tarojs/components";
import {Uploader,Image} from "@taroify/core";
import classnames from "classnames";
import {deletePersonalImages, editPersonalImages} from "@/actions/user";
import Taro from "@tarojs/taro";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IPhotoUrls} from "@/typings/types";
import {Clear} from "@taroify/icons";
import {viewImages} from "@/utils/taro-utils";
import {TOAST_SHOW_TIME} from "@/utils/constant";
import './index.scss'

interface IPhotoProps{
  images: IPhotoUrls[],
  onChange: any
}

const PhotoBox = (props: IPhotoProps)=>{
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state)
  const {isChangeable} = user

  const {onChange} = props
  const [images,setImages] = useState(props.images)

  useEffect(()=>{
    setImages(props.images)
    // onChange(props.images)
  },[props.images])

  async function onUpload() {
    if(isChangeable){
      Taro.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
      }).then(({tempFiles}) => {
        let updatedImages = images
        updatedImages = [...updatedImages, {imageUrl: tempFiles[0].path}]
        setImages([...updatedImages])
        onChange([...updatedImages])
      })
    }else{
      await Taro.showToast({
        icon: 'none',
        title: '已进入匹配暂时不能修改',
        duration: TOAST_SHOW_TIME,
      });
    }
  }

  function onReplace(idx) {
    if(isChangeable){
      Taro.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
      }).then(({tempFiles}) => {
        let updatedImages = images
        updatedImages[idx].imageUrl = tempFiles[0].path
        if(updatedImages[idx].id) {
          dispatch(editPersonalImages({realName:user.realName,studentNumber:user.studentNumber,image:updatedImages[idx]}))
        }
        else{
          setImages([...updatedImages])
          onChange([...updatedImages])
        }
      })
    }
  }

  async function onRemove(idx,item) {
    if(isChangeable){
      let updatedImages = images
      const deletResult = images.filter((img) => img !== item)
      if(updatedImages[idx].id){
        updatedImages[idx] = {...updatedImages[idx],delete: true}
        dispatch(deletePersonalImages(updatedImages[idx]))
        setImages([...deletResult])
        onChange([...deletResult])
      }
      else{
        setImages([...deletResult])
        onChange([...deletResult])
      }
    }else{
      await Taro.showToast({
        icon: 'none',
        title: '已进入匹配暂时不能修改',
        duration: TOAST_SHOW_TIME,
      });
    }
  }

  return (
    <View className='photo-box'>
      <View className={classnames('row', 'uploader')}>
      {/*  <Uploader*/}
      {/*  multiple*/}
      {/*  className={classnames('row', 'uploader')}*/}
      {/*  maxFiles={3}*/}
      {/*>*/}
        {images && images.map((item,idx) => (
          (item.imageUrl || item.tmpUrl) &&
          <View className='movable-img-box'>
            <View className='uploader-img-preview'>
              <Image
                key={item.id}
                src={item.tmpUrl?item.tmpUrl:item.imageUrl}
                onClick={() => viewImages([item.tmpUrl?item.tmpUrl:item.imageUrl])}
                className='uploader-img'
              />
            </View>
            <Clear className='uploader-delete' onClick={() => {onRemove(idx,item)}}/>
          </View>
        ))}
        {images && images.length < 3 &&
          <View onClick={onUpload}>
            <Image src={PersonalInfoAddPhoto} className='uploader-img'/>
          </View>
        }
      </View>
    </View>
  );
}

export default PhotoBox
