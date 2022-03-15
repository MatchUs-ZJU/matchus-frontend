import {View} from "@tarojs/components";
import {AtList, AtListItem, AtMessage} from "taro-ui";
import {useSelector} from "react-redux";

const Information = () => {
  const {user} = useSelector((state) => state)
  const {nickName, avatarUrl, school, faculty, identified} = user

  return (
    <View>
      <View className='container'>
        <AtMessage />
        <AtList hasBorder={false}>
          <AtListItem
            title='头像'
            extraThumb={avatarUrl}
          />
          <AtListItem
            title='昵称'
            extraText={nickName}
          />
          <AtListItem
            title='学校'
            extraText={school}
          />
          <AtListItem
            title='学院'
            extraText={faculty}
          />
        </AtList>

        <View style={{marginTop: '8px'}}>
          <View className='title'>认证状态</View>
          <AtList hasBorder={false}>
            {
              identified === 0 ? (
                <View>
                  <AtListItem
                    title='身份认证'
                    extraText='立即认证'
                    arrow='right'
                    onClick={() => {
                    }}
                  />
                </View>
              ) : (
                <View className='detail'>
                  <AtListItem
                    title='身份认证'
                    extraText='已认证'
                  />
                </View>
              )
            }
          </AtList>
        </View>
      </View>
    </View>
  );
}

export default Information;
