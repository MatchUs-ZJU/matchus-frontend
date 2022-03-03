import {Picker, View} from "@tarojs/components";
import {AtButton, AtForm, AtImagePicker, AtInput, AtList, AtListItem, AtMessage} from "taro-ui";
import Taro from "@tarojs/taro";
import {useEffect, useState} from "react";
import './index.scss'
import {updateUserInfo, uploadIdentificationImages} from "../../services/user";

const Identify = () => {

  interface IForm {
    school: string,
    faculty: string,
    phoneNumber: IEncryptedPhoneNumber,
    images: IImage[]
  }

  interface IImage {
    url: string
  }

  interface IEncryptedPhoneNumber {
    iv: string,
    encryptedData: string
  }

  let [showAddBtn, setShowAddBtn] = useState(true)
  let [canSubmit, setCanSubmit] = useState(false)
  let [schools, setSchools] = useState(['浙江大学', '浙江大学软件学院'])
  let [faculties, setFaculties] = useState(['计算机科学与技术学院', '人文学院'])
  let [form, setForm] = useState<IForm>({
    school: '无',
    faculty: '无',
    phoneNumber: { iv:'', encryptedData: ''},
    images: [],
  })

  useEffect(() => {
    // at most add 2 images
    if (form.images.length === 2) {
      setShowAddBtn(false)
    }

    if (form.school !== '无' && form.faculty !== '无' && form.phoneNumber.iv !== '' && form.images.length !== 0) {
      setCanSubmit(true)
    }
  }, [form])

  const onSubmitForm = async () => {
    let hasProblem = checkForm()
    if (hasProblem) {
      Taro.atMessage({
        message: '填写信息有错误哦！',
        type: 'warning',
        duration: 3000,
      });
    } else {
      try {
        // update user info
        await updateUserInfo(form)
        // upload images
        for (const image of form.images) {
          await uploadIdentificationImages({
            filePath: image.url,
            name: image.url,
          })
        }

        // success
        Taro.atMessage({
          message: '填写成功，工作人员将尽快审核',
          type: 'success',
          duration: 3000,
        });

        // navigate back
        await Taro.navigateBack()
      } catch (e) {
        Taro.atMessage({
          message: '上传信息失败！',
          type: 'error',
          duration: 3000,
        });
      }
    }
  }

  const onGetPhoneNumber = (e) => {
    if(e.detail.errMsg === 'getPhoneNumber:ok') {
      setForm({
        ...form, phoneNumber: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        }
      })
    } else {
      console.log(e.detail.errMsg)
    }
  }

  const checkForm = () => {
    // TODO check form
    return false
  }

  return (
    <View className='container default'>
      <AtMessage />
      <View className='basic'>
        <View className='section-name'>基本信息</View>
        <View>
          <Picker
            mode='selector'
            range={schools}
            onChange={(e) => {
              setForm({
                ...form, school: schools[e.detail.value]
              })
            }}
          >
            <AtList className='basic-choice' hasBorder={false}>
              <AtListItem
                title='选择学校'
                extraText={form.school}
              />
            </AtList>
          </Picker>
        </View>
        <View>
          <Picker
            mode='selector'
            range={faculties}
            onChange={(e) => {
              setForm({
                ...form, faculty: faculties[e.detail.value]
              })
            }}
          >
            <AtList className='basic-choice' hasBorder={false}>
              <AtListItem
                title='选择院系'
                extraText={form.faculty}
              />
            </AtList>
          </Picker>
        </View>
        <View>
          <AtForm>
            <AtInput
              clear
              name='phoneNumber'
              title='手机号'
              type='text'
              placeholder=''
              value=''
              onChange={() => {}}
              className='phone-number'
            >
              <AtButton
                className='button'
                size='small' type='secondary'
                circle
                openType='getPhoneNumber'
                onGetPhoneNumber={onGetPhoneNumber}
              >获取手机号
              </AtButton>
            </AtInput>
          </AtForm>
        </View>
      </View>
      <View className='identity'>
        <View className='section-name'>信息认证</View>
        <View>
          <AtImagePicker
            multiple
            length={2}
            count={2}
            showAddBtn={showAddBtn}
            files={form.images}
            onChange={(images) => {
              console.log(images)
              setForm({...form, images: images})
            }}
            onFail={(e) => {
              console.log(e)
            }}
          />
        </View>
      </View>
      <View className='submit'>
        <AtButton
          disabled={!canSubmit}
          type='primary'
          circle
          customStyle={{width: '85%'}}
          onClick={onSubmitForm}
          className='submit-button'
        >
          完成
        </AtButton>
      </View>
    </View>
  )

}

export default Identify;
