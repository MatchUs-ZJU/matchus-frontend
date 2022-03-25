import {View} from "@tarojs/components";
import {Cell} from "@taroify/core";
import "@taroify/core/cell/style"
import {useSelector} from "react-redux";
import './index.scss'

const Information = () => {
  const {user} = useSelector((state) => state)
  const {realName, gender, faculty, studentNumber, phoneNumber, identified} = user

  return (
    <View className='container wrapper'>
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
  );
}

export default Information;
