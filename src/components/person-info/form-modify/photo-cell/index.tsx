import {useEffect, useState} from "react";
import {Cell, Image, Popup} from "@taroify/core";
import {Text, View} from "@tarojs/components";
import {useSelector} from "react-redux";
import {
  TOAST_SHOW_TIME,
  WARNING_NOTE
} from "@/utils/constant";
import classnames from "classnames";
import {checkPhotos} from "@/utils/fcheck";
import PhotoBox from "@/components/person-info/photo-box";
import {IPhotoUrls} from "@/typings/types";
import Taro from "@tarojs/taro";
import './index.scss'

export interface PhotoPopUpProps {
  title: string,
  photoUrls: IPhotoUrls[],
  onConfirm: any,
}

const PhotoCell = (props: PhotoPopUpProps) => {

  const {user} = useSelector((state) => state)
  const [popupOpen,setPopupOpen] = useState(false)

  const [photoUrls, setPhotoUrls] = useState(props.photoUrls ? props.photoUrls : [])

  const [feedbackValue, setFeedbackValue] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)

  useEffect(() => {
    setPhotoUrls(user.images ? user.images : [])
  }, [user.images])

  const checkCanSubmit = () => {
      return checkPhotos(photoUrls)
  }

  useEffect(() => {
    if (!checkPhotos(photoUrls)) {
      setFeedbackValue(WARNING_NOTE.INVALID_PHOTO)
    }else{
      setFeedbackValue('')
    }
    setCanSubmit(checkCanSubmit())
  }, [photoUrls])

  const onConfirm = () => {
    if (checkCanSubmit()) {
      props.onConfirm(photoUrls)
      setPopupOpen(false)
    } else {
      setCanSubmit(false)
      setShowFeedback(true)
      return
    }

  }

  return (
    <>
      <Cell
        className={classnames('form-cell', {'form-cell-split-line': props.photoUrls.length > 0})}
        title='照片'
        clickable
        onClick={async () => {
          if(!user.isChangeable){
            await Taro.showToast({
              title: "您已成功报名，暂时不可修改～",
              duration: TOAST_SHOW_TIME,
              icon: 'none'
            })
          }
          else {
            setPopupOpen(true)
          }
        }}
      >
        <>
          {props.photoUrls.length > 0 && <View className='personal-info-img-box'>
            {props.photoUrls.map((item) => (
                item.imageUrl && item.imageUrl != '' &&
                <View className='personal-img-wrapper'>
                  <Image lazyLoad className='personal-img' src={item.imageUrl}/>
                </View>
              )
            )}
          </View>}
          {!checkPhotos(props.photoUrls) &&
            <View className='value qa-value'>
              <View className='dot'/>
              <Text>请选择</Text>
            </View>}
        </>
      </Cell>
      <Popup
        className='form-popup'
        open={popupOpen}
        onClose={()=>setPopupOpen(false)}
        rounded placement='bottom'
      >

        <Popup.Backdrop/>
        <Text className='popup-title'>修改照片</Text>
        {/*<PhotoBox images={user.images ? user.images : []} onChange={setPhotoUrls}/>*/}
        <PhotoBox images={photoUrls ? photoUrls : []} onChange={setPhotoUrls}/>
        {showFeedback && feedbackValue &&
          <View className='warning-note'>{feedbackValue}</View>}

        <View className={classnames('confirm-btn', {'confirm-btn-disabled': !canSubmit})} onClick={() => {
          onConfirm()
        }}
        >确认</View>
      </Popup>
    </>
  );
}

export default PhotoCell
