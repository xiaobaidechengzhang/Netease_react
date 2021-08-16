import React, { useState, useEffect, useRef } from 'react';
import BasicSlider from './BasicSlider';

export default function VolumeSlider(props) {
  const [volume, setVolume] = useState('0%')
  const handleVolumeChange = (percent) => {
    //音量是小数点格式, 例如0.52
    let volume = parseFloat(percent)/100;
    volume = volume.toFixed(2);
    volume = parseFloat(volume)//有没有这行都可以
    props.onChange(volume)
  }
  useEffect(() => {
    setVolume(props.value)
  }, [props.value])
  return (
    <div>
      <BasicSlider value={volume} onChange={handleVolumeChange}/>
    </div>
  )
}