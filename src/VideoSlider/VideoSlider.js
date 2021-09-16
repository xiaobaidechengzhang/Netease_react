import React, { useState, useEffect, useRef } from 'react';
import './videoSlider.less';
import HTTPUtils from '../HTTPUtils/HTTPUtils';
import AudioSlider from '../MusicSlider/AudioSlider';
import VolumeSlider from '../MusicSlider/VolumeSlider';
import { exchangeDuration, exchangeTime } from '../Utils';

import TestMp4 from '../images/test.mp4'
import { Button } from 'antd';
import $ from 'jquery'

//图片资源 点赞 收藏 评论 下载 分享
import CommentTransparent from '@/images/VideoSlider/Comment_transparent.png';
import DownloadTransparent from '@/images/VideoSlider/download_transparent.png';
import ShareTransparent from '@/images/VideoSlider/share_transparent.png';
import SubcribeTransparent from '@/images/VideoSlider/subcribe_transparent.png';
import ThumbupTransparent from '@/images/VideoSlider/thumb_up_transparent.png';
import PlayTransparent from '@/images/VideoSlider/play_transparent.png';
import PauseTransparent from '@/images/VideoSlider/pause_transparent.png';
import FullscreenTransparent from '@/images/VideoSlider/fullscreen.png';
import ExitFullscreenTransparent from '@/images/VideoSlider/exit_fullscreen.png';

//定时隐藏video 顶部栏和底部栏
let timer = null;

export default function VideoSlider(props) {

  //video container ref
  const videoContainerRef = useRef();
  //video ref 
  const videoSliderRef = useRef();
  //video 顶部栏 ref 
  const videoSliderTopRef = useRef();
  //video 底部栏 ref 
  const videoSliderBotRef = useRef();
  //video 播放地址
  const [videoPath, setVideoPath] = useState('');
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
  //是否处于全屏模式
  const [onFullscreen, setOnFullscreen] = useState(false)
  //鼠标一定时间内, 是否可以藏顶部栏和底部栏
  const [canHideTopAndBottomColumn, setCanHideTopAndBottomColumn] = useState(false)
  //video全屏状态下, 按键类型事件; 暂定 1: 空格(暂停/播放); 2: 方向键左(快退); 3: 方向键(快进); 4: 方向键上(音量增加); 5: 方向键下(音量减小)
  const [fullscreenKeyType, setFullscreenKeyType] = useState(0);


  //图片变量
  const [playImg, setPlayImg] = useState(PlayTransparent);//播放/暂停图片
  const [thumbImg, setThumbImg] = useState(ThumbupTransparent)//点赞/已点赞图片
  const [subImg, setSubImg] = useState(SubcribeTransparent);//收藏/已收藏图片
  const [fullscreenImg, setFullscreenImg] = useState(FullscreenTransparent);//全屏/退出全屏图片



  /**
   * 播放器顶部状态栏 -- 点赞/收藏/评论/分享/下载操作  delegate
   */
  const handleVideoStatusActions = (event) => {
    let id = event.target.id;
    switch (id) {
      case "videoThumb":
        console.log('点在操作');
        break;
      case "videoSub":
        console.log('收藏操作');
        break;
      case "videoComment":
        console.log('评论操作');
        break;
      case "videoShare":
        console.log('分享操作');
        break;
      case "videoDownload":
        console.log('下载操作');
        break;
      default:
        break;
    }
  }



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
    if (isNaN(duration) || (duration != 0 && !duration)) {
      setCurrentVideoTime('00:00')
    } else {
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

  //事件--video播放完毕
  const handleVideoEnd = () => {
    console.log('handleVideo end');
    setVideoPlay(false)
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
    let myVideo = videoSliderRef.current;
    setVideoDuration(exchangeDuration(myVideo.duration * 1000))
    canPlay && videoPlay ? myVideo.play() : myVideo.pause();
  }, [videoPlay, canPlay])

  /**
   * video全屏事件
   */
  const fullscreenVideo = () => {
    setOnFullscreen(!onFullscreen);
  }
  //依赖--进入全屏/退出全屏图片
  useEffect(() => {

    let element = videoContainerRef.current;
    //因为在全屏之前, 需要判断此组件是否存在, 
    if (element) {
      if (onFullscreen) {
        setFullscreenImg(ExitFullscreenTransparent)
        //几种内核兼容
        if (element.requestFullscreen) {
          element.requestFullscreen();
        }
        else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        }
        else if (element.mozRequestFullscreen) {
          element.mozRequestFullscreen()
        }
        else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen()
        }
      } else {
        //先判断是否存在全屏对象-这里不能用element, 要用到document
        if (document.fullscreenElement) {
          setFullscreenImg(FullscreenTransparent)
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
          else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
          else if (document.mozExitFullscreen) {
            document.mozExitFullscreen()
          }
          else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          }
        }
      }
    }
  }, [onFullscreen])


  /**
   * video音量事件
   */
  //音量条change事件
  const handleVideoVolumeChange = (time) => {
    console.log(time);
    setVideoVolume(time * 100 + '%')
  }
  //依赖 volume slider属性value变化, 要设置video的音量
  useEffect(() => {
    let myVideo = videoSliderRef.current;
    myVideo.volume = parseInt(videoVolume) / 100
  }, [videoVolume])

  /**
   * @param {Number} count : 规定时间内 1: 单击事件; 大于2: 双击事件
   */
  const handleVideoClick = (count) => {
    console.log(count);
    if(count == 1) {
      //单击 播放/暂停
      setVideoPlay(play => !play)
    }else if(count >=2) {
      //双击 进入全屏/退出全屏
      setOnFullscreen(fullscreen => !fullscreen)
    }
  }

  /**
   * 
   * @param {Function} func : 处理单击/双击事件
   * @param {Number} delay 一定时间内的点击次数
   * @returns 
   */
  const debounceClick = (func, delay) => {
    let timer = null;
    let count = 0;
    return function() {
      count += 1;
      if(timer) {
        return;
      }
      timer = setTimeout(() => {
        func(count);
        count = 0;
        timer = null
      }, delay)
    }
  }

  /**
   * 鼠标移动 显示/隐藏顶部栏和底部栏系列事件和依赖
   */
  //依赖--在处于全屏状态下, 并且一定时间内, 鼠标没有移动(1), video处于播放状态(2), 且鼠标不在顶部栏和底部栏hover或者移动(3), 这个时候才能隐藏顶部栏和底部栏
  //否则不能隐藏
  useEffect(() => {
    let videoSliderTop = videoSliderTopRef.current;
    let videoSliderBot = videoSliderBotRef.current;
    if(onFullscreen && canHideTopAndBottomColumn && videoPlay) {
      $(videoSliderTop).slideUp()
      $(videoSliderBot).slideUp()
    }else {
      $(videoSliderTop).slideDown()
      $(videoSliderBot).slideDown()
    }
  }, [canHideTopAndBottomColumn, onFullscreen, videoPlay])
  const handleMousemove = () => {
    //触发此事件, 说明一定时间内鼠标没有移动, 那么需要将顶部栏 和 底部栏 隐藏
    setCanHideTopAndBottomColumn(true)
  }
  const debounceMousemove = (func, delay) => {
    return function() {
      //如果在移动过程中 顶部栏和底部栏都要一直显示
      setCanHideTopAndBottomColumn(false)
      if(timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        func();
        timer = null;
      }, delay)
    }
  }


  /**
   * video全屏状态下 键盘事件 空格(32): 暂停/播放; 方向键 上(38)/下(40): 音量增加/减小; 左(37)/右(29): 快退/快进
   */
  //依赖-全屏状态下按键类型fullscreenKeyType
  useEffect(() => {
    let volume = 0
    // return;
    if(onFullscreen) {
      switch(fullscreenKeyType) {
        case 1:
          console.log('空格');
          setVideoPlay(play => !play);
          setFullscreenKeyType(0)
          break;
        case 4:
          console.log('音量加');
          console.log(videoVolume);
          volume = parseInt(videoVolume) + 1;
          if(volume >100) {
            volume = 100
          }
          volume = volume + '%'
          setVideoVolume(volume);
          setFullscreenKeyType(0)
          break;
        case 5:
          console.log('音量减');
          volume = parseInt(videoVolume) - 1;
          if(volume < 0) {
            volume = 0
          }
          volume = volume + '%'
          setVideoVolume(volume);
          setFullscreenKeyType(0)
          break;
        case 2:
          break;
        case 3:
          break;
        default: 
          break;
      }
    }
  }, [fullscreenKeyType, onFullscreen])
  const handleFullscreenKeycode = (event) => {
    let videoContainer = videoContainerRef.current;
    if(videoContainer) {
      let keycode = event.keyCode;
      console.log(keycode);
      // return;
      switch(keycode) {
        case 32:
          //空格
          setFullscreenKeyType(1);
          break;
        case 37:
          //快退
          setFullscreenKeyType(2);
          break;
        case 38:
          //音量增加
          setFullscreenKeyType(4);
          break;
        case 39:
          //快进
          setFullscreenKeyType(3);
          break;
        case 40:
          //音量减小
          setFullscreenKeyType(5);
          break;
        case 27:
          console.log('esc tuichu');
          break;
        default:
          break;
    }
    }
  }

  //依赖视频播放地址, 地址变化, 需要重置视频当前时间, 总时长, 播放状态
  useEffect(() => {
    if(props.path != videoPath) {
      console.log('video slider path');
      console.log(props.path);
      setVideoPath(props.path);
      setCurrentVideoTimePercent('0%')
      setVideoPlay(false)
    }
  }, [props.path])

  //第一次页面加载后, 触发, 只加载一次
  useEffect(() => {
    //这个video组件
    let videoContainer = videoContainerRef.current;
    //Video 元素
    let myVideo = videoSliderRef.current;
    //顶部栏
    let videoSliderTop = videoSliderTopRef.current;
    //底部栏
    let videoSliderBot = videoSliderBotRef.current;
    if(videoContainer) {
      //鼠标移动监听事件, 在这个video container上添加监听事件, 一定时间内鼠标没有移动, 需要隐藏顶部栏和底部栏, 只要移动, 就要显示顶部栏和底部栏
      //但鼠标在顶部栏和底部栏hover或者mousemove中, 需要一直显示顶部栏和底部栏,  清除timer
      videoContainer.addEventListener('keyup', handleFullscreenKeycode)
      videoContainer.addEventListener('mousemove', debounceMousemove(handleMousemove, 3000))
      //下面两个top和bot listener是为了不隐藏顶部栏和底部栏
      videoSliderTop.addEventListener('mousemove', function(event) {
        event.stopPropagation();
        if(timer) {
          clearTimeout(timer)
        }
        setCanHideTopAndBottomColumn(false)
      })
      videoSliderBot.addEventListener('mousemove', function(event) {
        event.stopPropagation();
        if(timer) {
          clearTimeout(timer)
        }
        setCanHideTopAndBottomColumn(false)
      })
      //这里添加full screen change事件, 是为了解决全屏状态下 顶部栏和底部栏已经隐藏, ESC键退出全屏, 顶部栏和底部栏不显示, 并且onFullscreen仍然为true
      document.addEventListener('fullscreenchange', function(event) {
        if(!document.fullscreenElement) {
          setOnFullscreen(false)
          setFullscreenImg(FullscreenTransparent)
        }
      })
    }
    //一定要判断是否存在
    if(myVideo) {
      //存在以后才能获取video的音量, 时长
      myVideo.volume = 0.5
      setVideoDuration(exchangeDuration(myVideo.duration))
      setCurrentVideoTime('00:00'); 
      //对video添加监听单击事件, 单击: 播放/暂停; 双击: 进入全屏/退出全屏; 
      myVideo.addEventListener('click', debounceClick(handleVideoClick, 200)) 
      
    }
  }, [])
  return (
    <div className='videoContainer' ref={videoContainerRef} tabIndex='21'>
      <div className='videoContainerCeil' ref={videoSliderTopRef}>
        <ul className='containerCeilRow'>
          {/* <li className="ceilRowItem">
            MV名称
          </li>
          <li className="ceilRowItem">
            歌手名
          </li> */}
        </ul>
        {onFullscreen ? <ul className='containerCeilRow' onClick={handleVideoStatusActions}>
          <li className="ceilRowItem"><img id="videoThumb" className='rowItemImg' title='点赞' src={ThumbupTransparent} /></li>
          <li className="ceilRowItem"><img id="videoSub" className='rowItemImg' title='收藏' src={SubcribeTransparent} /></li>
          <li className="ceilRowItem"><img id="videoComment" className='rowItemImg' title='评论' src={CommentTransparent} /></li>
          <li className="ceilRowItem"><img id="videoShare" className='rowItemImg' title='分享' src={ShareTransparent} /></li>
          <li className="ceilRowItem"><img id="videoDownload" className='rowItemImg' title='下载' src={DownloadTransparent} /></li>
        </ul> : null}
      </div>
      <video
        id='oo'
        ref={videoSliderRef}
        width='100%'
        height="400"
        className='videoContent'
        src={videoPath}
        onCanPlay={handleVideoPlay} type="video/mp4"
        onTimeUpdate={handleVideoTimeUpdateChange}
        onWaiting={handleVideoWaiting}
        onEnded={handleVideoEnd}
      />
      <div className='videoContainerFloor' ref={videoSliderBotRef}>
        <AudioSlider
          value={currentVideoTimePercent}
          onChange={handleVideoTimeChange}
        />
        <div className='floorRowContainer'>
          <ul className='floorRow'>
            <li className="floorRowItem">
              <img onClick={playOrPauseVideo} src={!videoPlay ? playImg : PauseTransparent} className='rowItemImg' />
            </li>
            <li className="floorRowItem">
              <p>{currentVideoTime}/{videoDuration}</p>
            </li>
          </ul>
          <ul className='floorRow'>
            <li className="floorRowItem">
              <div style={{ width: 100, display: 'inline-block' }}>
                <VolumeSlider value={videoVolume} onChange={handleVideoVolumeChange} />
              </div>
            </li>
            <li className="floorRowItem">
              <img src={fullscreenImg} className='rowItemImg' onClick={fullscreenVideo} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
