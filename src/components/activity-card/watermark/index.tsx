import {Text, View, ViewProps} from "@tarojs/components";
import classnames from "classnames";

import './index.scss'

interface WatermarkProps extends ViewProps {
  type: 'match' | 'choose'
  success: boolean
}

function getContent(type: string, success: boolean) {
  const types = {
    'match': '匹配',
    'choose': '双选'
  }

  if (success) {
    return `${types[type]}成功`
  } else {
    return `${types[type]}失败`
  }
}

const Watermark = (props: WatermarkProps) => {
  const {type, success} = props
  const content = getContent(type, success)

  return (
    <View className={classnames(
      'watermark',
      {'watermark-success': success}
    )}
    >
      <Text className={classnames(
        'watermark-content',
        {'watermark-content-success': success}
      )}
      >
        {content}
      </Text>
    </View>
  )
}

export default Watermark
