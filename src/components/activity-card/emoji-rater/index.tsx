import {Emoji1, Emoji2, Emoji3, Emoji4, Emoji5} from "@/assets/images";
import {View} from "@tarojs/components";
import {Image} from "@taroify/core";
import classnames from "classnames";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {sendFavor} from "@/actions";

import './index.scss';

interface EmojiRaterProps {
  initChoose: number,
}

const emojis = [{
  value: 1,
  src: Emoji1
}, {
  value: 2,
  src: Emoji2
}, {
  value: 3,
  src: Emoji3
}, {
  value: 4,
  src: Emoji4
}, {
  value: 5,
  src: Emoji5
}]

const EmojiRater = (props: EmojiRaterProps) => {
  const dispatch = useDispatch()
  const {initChoose} = props
  const {id} = useSelector(state => state.activity)
  const [chosen, setChosen] = useState(0)

  function chooseEmoji(value: number) {
    dispatch(sendFavor({id: id, level: value}))
    setChosen(value)
  }

  return (
    <View className='row emoji-container'>
      {emojis.map((emoji) => (
        <View
          className={classnames(
            'item',
            {'item-last-choose': chosen === 0 && initChoose === emoji.value},
            {'item-chosen': chosen === emoji.value}
          )}
          onClick={() => {
            chooseEmoji(emoji.value)
          }}
        >
          <Image src={emoji.src} className='emoji'/>
        </View>
      ))}
    </View>
  )
}

export default EmojiRater
