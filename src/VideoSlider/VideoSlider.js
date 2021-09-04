import React, { useState, useEffect, useRef } from 'react';
import './videoSlider.less';
import HTTPUtils from '../HTTPUtils/HTTPUtils';
import AudioSlider from '../MusicSlider/AudioSlider';
import VolumeSlider from '../MusicSlider/VolumeSlider';
import { exchangeDuration, exchangeTime } from '../Utils';

import TestMp4 from '../images/test.mp4'
import { Button } from 'antd';

export default function VideoSlider(props) {

  //video ref 
  const videoSliderRef = useRef();
  //video 播放/暂停
  const [videoPlay, setVideoPlay] = useState(false)
  //video 缓冲完毕/可播放
  const [canPlay, setCanPlay] = useState(false);
  //当前播放时间-百分比
  const [currentVideoTimePercent, setCurrentVideoTimePercent] = useState('0%');
  //当前播放时间-秒数
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  //总时长
  const [videoDuration, setVideoDuration] = useState(0);


  //音量
  const [videoVolume, setVideoVolume] = useState(0)

  /**
   * 
   * @param {time} time: String 传过来的百分比, 字符串类型
   */
  //事件--处理video时间变化事件--用于处理slider拖动/跳转某一时间后, 更新video的事件
  const handleVideoTimeChange = (time) => {
    console.log(time);
    let duration = videoSliderRef.current.duration;
    console.log(duration * parseInt(time) / 100);
    videoSliderRef.current.currentTime = duration * parseInt(time) / 100
  }
  //事件--video播放后, 当前事件更新的事件, 用于更新slider的currentTime
  const handleVideoTimeUpdateChange = () => {
    let myVideo = videoSliderRef.current;
    let duration = myVideo.duration;
    let currentTime = myVideo.currentTime;
    let percent = Math.floor(currentTime / duration * 100) + '%'
    setCurrentVideoTimePercent(percent)
  }
  //
  useEffect(() => {
    console.log('处理当前事件');
    let myVideo = videoSliderRef.current;
    let duration = myVideo.duration;
    //首先判断duration是否是NAN, 因为duration只能在页面加载完成以后, 才能获取到, 页面加载完成事件在useEffect(() => {}, [])中, 才算加载完成, 本事件发生在上述事件之前
    if(isNaN(duration) || (duration != 0 && !duration)) {
      setCurrentVideoTime('00:00')
    }else {
      let time = parseInt(currentVideoTimePercent) * duration * 10;//获取毫秒数
      setCurrentVideoTime(exchangeDuration(time))
    }
  }, [currentVideoTimePercent])

  //事件--video等待加载资源事件 这是需要将video变为不可播放状态
  const handleVideoWaiting = () => {
    setCanPlay(false);
    setVideoPlay(false)
  }

  //事件--video可播放事件
  const handleVideoPlay = () => {
    setCanPlay(true);
  }

  /**
   * 播放状态设置事件, 以及相关依赖
   */
  //设置播放状态
  const playOrPauseVideo = () => {
    setVideoPlay(!videoPlay)
  }
  //依赖-视频播放器 播放状态--video处于canPlay状态并且 video处于播放状态下, 然后video会开始播放
  useEffect(() => {
    console.log('依赖 依赖');
    let myVideo = videoSliderRef.current;
    console.log('use effect can play');
    console.log(canPlay);
    console.log(videoPlay);
    console.log(myVideo.duration)
    console.log(myVideo.currentTime);
    console.log(exchangeDuration(myVideo.duration * 1000));
    setVideoDuration(exchangeDuration(myVideo.duration * 1000))
    canPlay && videoPlay ? myVideo.play() : myVideo.pause();
  }, [videoPlay, canPlay])


  /**
   * video音量事件
   */
  //音量条change事件
  const handleVideoVolumeChange = (time) => {
    console.log(time);
    setVideoVolume(time * 100 + '%')
  }
  useEffect(() => {
    console.log('video 音量');
    let myVideo = videoSliderRef.current;
    myVideo.volume = parseInt(videoVolume)/100
  }, [videoVolume])

  //第一次页面加载后, 触发, 只加载一次
  useEffect(() => {
    console.log('页面加载一次');
    let myVideo = videoSliderRef.current;
    myVideo.volume = 0.5
    console.log(myVideo.volume);
    console.log(myVideo.duration)
    console.log(myVideo.currentTime);
    setVideoDuration(exchangeDuration(myVideo.duration))
    setCurrentVideoTime('00:00')
  }, [])
  return (
    <div style={{ border: '1px solid gray' }}>
      <div className='videoContainerCeil'>
        <ul className='containerCeilRow'>
          <li>
            MV名称
          </li>
          <li>
            歌手名
          </li>
        </ul>
        <ul className='containerCeilRow' style={{ float: 'right' }}>
          <li>点赞</li>
          <li>收藏</li>
          <li>评论</li>
          <li>分享</li>
          <li>下载</li>
        </ul>
      </div>
      <video
        id='oo'
        ref={videoSliderRef}
        width='500'
        height='400'
        controls
        style={{ border: '1px solid red' }}
        src={TestMp4}
        onCanPlay={handleVideoPlay} type="video/mp4"
        onTimeUpdate={handleVideoTimeUpdateChange}
        onWaiting={handleVideoWaiting}
      />
      <div className='videoContainerFloor'>
        <AudioSlider
          value={currentVideoTimePercent}
          onChange={handleVideoTimeChange}
        />
        <div className='floorRowContainer'>
          <ul className='floorRow'>
            <li>
              <Button onClick={playOrPauseVideo}>播放</Button>
            </li>
            <li>
              <p>{currentVideoTime}/{videoDuration}</p>
            </li>
          </ul>
          <ul className='floorRow floorRight'>
            <li>
              <div style={{width: 100, display: 'inline-block'}}>
                <VolumeSlider value={videoVolume} onChange={handleVideoVolumeChange}/>
              </div>
            </li>
            <li>
              <Button>全屏</Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
