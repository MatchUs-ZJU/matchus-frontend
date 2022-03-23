import {View} from "@tarojs/components";
import {Cell} from "@taroify/core";
import "@taroify/core/cell/style"
import {useSelector} from "react-redux";
import './index.scss'

const Information = () => {
  const {user} = useSelector((state) => state)
  // const {nickName, avatarUrl, school, faculty, identified} = user
  const {realName, gender, faculty, studentNumber, phoneNumber, identified} = user

  return (
      <View className='container'>
        <View className='info'>
          <Cell.Group inset>
            <Cell title='真实姓名'>{realName}</Cell>
            <Cell title='性别'>{gender}</Cell>
            <Cell title='学院'>{faculty}</Cell>
            <Cell title='学号'>{studentNumber}</Cell>
            <Cell title='手机号'>{phoneNumber}</Cell>
            <Cell title='身份认证' brief='本期活动将会在收集问卷信息后人工验证'>{identified}</Cell>
          </Cell.Group>
        </View>
      </View>


    // <View>
    //   {/*<View className='container'>*/}
    //   {/*  <AtMessage />*/}
    //   {/*  <AtList hasBorder={false}>*/}
    //   {/*    <AtListItem*/}
    //   {/*      title='头像'*/}
    //   {/*      extraThumb={avatarUrl}*/}
    //   {/*    />*/}
    //   {/*    <AtListItem*/}
    //   {/*      title='昵称'*/}
    //   {/*      extraText={nickName}*/}
    //   {/*    />*/}
    //   {/*    <AtListItem*/}
    //   {/*      title='学校'*/}
    //   {/*      extraText={school}*/}
    //   {/*    />*/}
    //   {/*    <AtListItem*/}
    //   {/*      title='学院'*/}
    //   {/*      extraText={faculty}*/}
    //   {/*    />*/}
    //   {/*  </AtList>*/}
    //
    //   {/*  <View style={{marginTop: '8px'}}>*/}
    //   {/*    <View className='title'>认证状态</View>*/}
    //   {/*    <AtList hasBorder={false}>*/}
    //   {/*      {*/}
    //   {/*        identified === 0 ? (*/}
    //   {/*          <View>*/}
    //   {/*            <AtListItem*/}
    //   {/*              title='身份认证'*/}
    //   {/*              extraText='立即认证'*/}
    //   {/*              arrow='right'*/}
    //   {/*              onClick={() => {*/}
    //   {/*              }}*/}
    //   {/*            />*/}
    //   {/*          </View>*/}
    //   {/*        ) : (*/}
    //   {/*          <View className='detail'>*/}
    //   {/*            <AtListItem*/}
    //   {/*              title='身份认证'*/}
    //   {/*              extraText='已认证'*/}
    //   {/*            />*/}
    //   {/*          </View>*/}
    //   {/*        )*/}
    //   {/*      }*/}
    //   {/*    </AtList>*/}
    //   {/*  </View>*/}
    //   {/*</View>*/}
    // </View>
  );
}

export default Information;
