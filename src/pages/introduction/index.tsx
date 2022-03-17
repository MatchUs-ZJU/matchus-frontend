import {View} from "@tarojs/components";
import {useSelector} from "react-redux";
import {LoginModal} from "../../components";

const Introduction = () => {

  const {showLoginModal} = useSelector(state => state.global)

  return(
    <View>
      <LoginModal opened={showLoginModal} />
      欢迎
    </View>
  )

}

export default Introduction
