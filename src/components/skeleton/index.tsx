import {View, ViewProps} from "@tarojs/components";
import classNames from 'classnames'
import './index.scss'

interface SkeletonProps extends Omit<ViewProps, 'animation'> {
  variant?: SkeletonVariant
  animation?: SkeletonAnimation
}

type SkeletonVariant = 'rect' | 'circle'
type SkeletonAnimation = 'pulse' | 'wave'

const Skeleton = (props: SkeletonProps) => {
  const {className, variant = 'rect', animation = 'pulse', ...restProps} = props
  return (
    <View
      className={classNames(
        "skeleton",
        {
          ["skeleton--rect"]: variant === "rect",
          ["skeleton--circle"]: variant === "circle",
          ["skeleton--pulse"]: animation === "pulse",
          ["skeleton--wave"]: animation === "wave",
        },
        className
      )}
      {...restProps}
    />
  )
}

export default Skeleton
