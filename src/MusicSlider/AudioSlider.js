import React, { useState, useEffect, useRef } from 'react';
import BasicSlider from './BasicSlider';

let interval_id = null; //播放定时

export default function AudioSlider(props) {

  const [value, setValue] = useState('0%')
  const [play, setPlay] = useState(false); //歌曲是否开始播放
  const [time, setTime] = useState("0"); //歌曲总时长
  const [isReset, setIsReset] = useState(false); //是否重置

  /**
    * BasicSlider事件
    */
   //onChange事件
   const handleBasicSliderChange = (percent) => {
    console.log('basic slider change --', percent)
    props.onChange(percent)
  }

  ////事件--处理定时进度条每隔一秒 更新一次进度条
  // const handleBackWidth = () => {
  //   console.log('handle back width')
  //   console.log(value)
  //   let back_width = value;
  //   back_width = parseFloat(back_width);
  //   if (back_width >= 100) {
  //     //如果back_width已经到达100%,则直接reset()--造成这样情况有以下
  //     //1: 直接拖动滑动条到达100%, 这样直接reset
  //     setIsReset(true);
  //   } else {
  //     //这里150是歌曲的时间, 1/150获取每秒移动的百分比
  //     let percent = ((1 / parseFloat(time)) * 100).toFixed(2);
  //     percent = parseFloat(percent);
  //     //与原来的百分比相加, 得到新的百分比
  //     back_width = back_width + percent;
  //     //如果超过100%, 清除定时器
  //     if (back_width >= 100) {
  //       back_width = 100;
  //       setPlay(false);
  //       // props.hasOwnProperty("onEndReached") && props.onEndReached();
  //     }
  //     back_width += "%";
  //     setValue(back_width)
  //     //更新滑动条
  //     // setBackWidth(back_width);
  //     // setSliderRoundLeft(back_width);
  //     // props.onChange(back_width)
  //   }
  // };
  // useEffect(() => {
  //   if (play) {
  //     //这里要用一个单独的方法处理进度条, 不能用() => {}, 这样容易形成值backWidth不变化
  //     interval_id = setInterval(handleBackWidth, 1000);
  //   } else {
  //     //暂停播放状态下, 清除定时器
  //     interval_id && clearInterval(interval_id);
  //   }
  // }, [play]);
  //play播放状态依赖传过来的props.play
  // useEffect(() => {
  //   setPlay(props.play);
  // }, [props.play]);
  // useEffect(() => {
  //   setTime(props.duration);
  //   setIsReset(true)
  // }, [props.duration]);
  useEffect(() => {
    console.log('audio slider')
    setValue(props.value)
  }, [props.value])
  return (
    <BasicSlider value={value} onChange={handleBasicSliderChange}/>
  )
}