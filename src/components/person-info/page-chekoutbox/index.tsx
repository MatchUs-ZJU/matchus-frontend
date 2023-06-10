import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import { Checkbox } from '@taroify/core';
import classnames from 'classnames';

interface ICheckboxItem {
  value: string;
  text: string;
  checked: boolean;
}

interface IPageCheckboxProps {
  onChange: (values: any) => void;
  setSelectedValue: (value: any) => void;
}

const PageCheckbox: React.FC<IPageCheckboxProps> = (props) => {
  const { onChange, setSelectedValue } = props;
  const [list, setList] = useState<ICheckboxItem[]>([
    {
      value: '否',
      text: '否',
      checked: false,
    },
    {
      value: '是',
      text: '是',
      checked: true,
    },
  ]);

  useEffect(() => {
    onChange(list);
  }, [list, onChange]);

  const handleCheckboxChange = (index: number) => {
    const newList = list.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          checked: true,
        };
      } else {
        return {
          ...item,
          checked: false,
        };
      }
    });
    setList(newList);
    setSelectedValue(newList[index].value); // 更新父组件的 selectedValue
  };

  return (
    <View className='page-section'>
      {list.map((item, index) => (
        <Checkbox
          key={index}
          className={classnames('checkbox-list__checkbox', {
            checked: item.checked,
          })}
          value={item.value}
          checked={item.checked}
          onChange={() => handleCheckboxChange(index)}
        >
          {item.text}
        </Checkbox>
      ))}
    </View>
  );
};

export default PageCheckbox;