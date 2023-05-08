import { PersonalInfoAddPhoto } from "@/assets/images";
import { View } from "@tarojs/components";
import { Uploader, Image } from "@taroify/core";
import classnames from "classnames";
import { deletePersonalImages, editPersonalImages } from "@/actions/user";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CoS, IPhotoUrls } from "@/typings/types";
import { Clear } from "@taroify/icons";
import { viewImages } from "@/utils/taro-utils";
import { TOAST_SHOW_TIME } from "@/utils/constant";
import './index.scss'

interface IPhotoProps {
  images: CoS[],
  onChange: any,
  changeable: boolean
}

const FeedbackImageBox = (props: IPhotoProps) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state)
  const { isChangeable } = user

  const { onChange } = props
  const [images, setImages] = useState(props.images)

  useEffect(() => {
    setImages(props.images)
    onChange(props.images)
  }, [props.images])

  async function onUpload() {
    if(props.changeable === false)
    {
      Taro.showToast({
        title: '您已经提交过了',
        icon: 'none',
        duration: 1000
      })
      return
    }
    Taro.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
    }).then(({ tempFiles }) => {
      let updatedImages = images
      console.log(tempFiles)
      updatedImages = [...updatedImages, { cloudId: tempFiles[0].path }]
      setImages([...updatedImages])
      onChange([...updatedImages])
      console.log(updatedImages)
    })
  }

  async function onRemove(idx, item) {
    if(props.changeable === false)
    {
      Taro.showToast({
        title: '您已经提交过了',
        icon: 'none',
        duration: 1000
      })
      return
    }
    console.log("test",props.changeable)
    let updatedImages = images
    const deletResult = images.filter((img) => img.id !== item.id)
    onChange([...deletResult])
    setImages([...deletResult])
    // if (updatedImages[idx].id) {
    //   //updatedImages[idx] = { ...updatedImages[idx], delete: true }
    //   //dispatch(deletePersonalImages(updatedImages[idx]))
    //   setImages([...deletResult])
    // }
    // else {
    //   setImages([...deletResult])
    // }
  }

  return (
    <View className='photo-box'>
      <View className={classnames('row', 'uploader')}>
        {images && images.map((item, idx) => {
          // console.log("testeee",item)
          if(item.cloudId)
          {
            //console.log("testeee",item.cloudId)
            return(
              <View className='movable-img-box'>
                <View className='uploader-img-preview'>
                  <Image
                    key={item.id}
                    src={item.cloudId ? item.cloudId : ''}
                    onClick={() => viewImages([item.cloudId!])}
                    className='uploader-img'
                  />
                </View>
                <Clear className='uploader-delete' onClick={() => { onRemove(idx, item) }} />
              </View>
            )
          }
          })
        }
        {images && images.length < 3 &&
          <View onClick={onUpload}>
            <Image src={PersonalInfoAddPhoto} className='uploader-img' />
          </View>
        }
      </View>
    </View>
  );
}

export default FeedbackImageBox
