import {PersonalInfoAddPhoto} from "@/assets/images";
import {View} from "@tarojs/components";
import {Uploader,Image} from "@taroify/core";
import classnames from "classnames";
import {deletePersonalImages, editPersonalImages} from "@/actions/user";
import Taro from "@tarojs/taro";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IPhotoUrls} from "@/typings/types";

import './index.scss'

interface IPhotoProps{
  images: IPhotoUrls[],
  onChange: any
}

const PhotoBox = (props: IPhotoProps)=>{
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state)
  const {onChange} = props
  const [images,setImages] = useState(props.images)

  useEffect(()=>{
    setImages(props.images)
    onChange(props.images)
  },[props.images])

  function onUpload() {
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
  }

  function onReplace(idx) {
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

  function onRemove(idx,item) {
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
  }

  return (
    <View className='photo-box'>
      <Uploader
        multiple
        className={classnames('row', 'uploader')}
        maxFiles={3}
      >
        {images && images.map((item,idx) => (
          (item.imageUrl || item.tmpUrl) &&
          <Uploader.Image
            key={item.id}
            url={item.tmpUrl?item.tmpUrl:item.imageUrl}
            onClick={() => onReplace(idx)}
            onRemove={() => {onRemove(idx,item)}}
            className='uploader-preview'
          />
        ))}

        {images && images.length < 3 &&
          <View onClick={onUpload}>
            <Image src={PersonalInfoAddPhoto} className='uploader-img'/>
          </View>
        }
      </Uploader>
    </View>
  );
}

export default PhotoBox
