import {View} from "@tarojs/components";
import {useSelector} from "react-redux";
import {LoginModal} from "../../components";
import {Button} from "@taroify/core";

const Introduction = () => {

  const {showLoginModal} = useSelector(state => state.global)

  return(
    <View>
      <LoginModal opened={showLoginModal} />
      欢迎
      <Button>

      </Button>
    </View>
  )

}

export default Introduction
