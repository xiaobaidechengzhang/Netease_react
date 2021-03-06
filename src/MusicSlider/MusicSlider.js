import React, { useState, useEffect, useRef } from "react";
import { addToPlaylist, deleteAllSongs, deleteSong, setActive, } from '../store/actions/playlistActions'
import { connect } from 'react-redux'
import { Input, message, Button, Slider } from "antd";
import HTTPUtils from "../HTTPUtils/HTTPUtils";
import "./MusicSlider.less";
// const mp3Path = require('../Sounds/test.mp3')
//测试本地mp3地址
import mp3Path from "../Sounds/test.mp3";
import hongyanPath from "../Sounds/hongyan.mp3";
//播放/暂停img
import playActive from "../images/music/play-active.png";
import playNoActive from "../images/music/play-no-active.png";
import pauseActive from "../images/music/pause-active.png";
import pauseNoActive from "../images/music/pause-no-active.png";
//上一首
import forwardActive from "../images/music/forward-active.png";
import forwardNoActive from "../images/music/forward-no-active.png";
//下一首
import lastActive from "../images/music/last-active.png";
import lastNoActive from "../images/music/last-no-active.png";
//快进
import fastActive from "../images/music/fast-active.png";
import fastNoActive from "../images/music/fast-no-active.png";
//快退
import backFastActive from "../images/music/back-fast-active.png";
import backFastNoActive from "../images/music/back-fast-no-active.png";
//音量
import volumeActive from "../images/music/volume-active.png";
import volumeNoActive from "../images/music/volume-no-active.png";
//静音
import mutedActive from "../images/music/muted-active.png";
import mutedNoActive from "../images/music/muted-no-active.png";
//播放列表
import listActive from "../images/music/list-active.png";
import listNoActive from "../images/music/list-no-active.png";
//循环
///列表循环
import allLoopActive from "../images/music/all-loop-active.png";
import allLoopNoActive from "../images/music/all-loop-no-active.png";
///单曲循环
import singleLoopActive from "../images/music/single-loop-active.png";
import singleLoopNoActive from "../images/music/single-loop-no-active.png";
///无循环
import noLoopActive from "../images/music/none-loop-active.png";
import noLoopNoActive from "../images/music/none-loop-no-active.png";

//音乐列表item图片
///加入播放列表
import add from "../images/music/musicListItem/add.png";
import noAdd from "../images/music/musicListItem/no-add.png";
///下一首播放
import joinNext from "../images/music/musicListItem/join-next.png";
import noJoinNext from "../images/music/musicListItem/no-join-next.png";
///收藏like
import like from "../images/music/musicListItem/like.png";
import noLike from "../images/music/musicListItem/no-like.png";
///播放
import itemPlay from "../images/music/musicListItem/play.png";
//MV
import MV from "../images/music/musicListItem/mv.png";


//引入的组件
import MusicSliderComponent from "./MusicSliderComponent";
import AudioSlider from "./AudioSlider";
import VolumeSlider from "./VolumeSlider";
import SliderPlaylist from "../SliderPlaylist/SliderPlaylist";

//时间转换--秒转为00:00格式,例如150 -->> 02:30
const covertTime = (time) => {
  let min = time / 60;
  min = Math.floor(min);
  min = isNaN(min) ? 0 : min;
  min = min >= 10 ? min : "0" + min;
  let sec = time % 60;
  sec = isNaN(sec) ? 0 : sec;
  sec = sec >= 10 ? sec : "0" + sec;
  return min + ":" + sec;
};
function MusicSlider(props) {
  const [musicPath, setMuscipath] = useState(""); //歌曲地址
  const [sliderPause, setSliderPause] = useState(false); //Audio的播放状态; true: 正在播放; false: 停止播放;
  const [isOnPlaying, setIsOnPlaying] = useState(false);//是否正在播放, 用于切换歌曲, 加载完资源后, 是否自动播放;
  const [canPlay, setCanplay] = useState(false);//是否能播放, 
  const [sliderEnd, setSliderEnd] = useState(false); //musicSldierComponent是否播放完毕
  const ownAudioRef = useRef(); //配合MusicSliderComponent的audio
  const [duration, setDuration] = useState("0"); //歌曲总时长
  const [currentAudioTime, setCurrentAudioTime] = useState("0%");
  const [isFirst, setIsFirst] = useState(0); //是否切换歌曲, isFirst== 1时, 表明是切换歌曲, 设置完事件后, 再将isFirst重置为0

  //action--图片相关变量
  const [forwardImg, setForwardImg] = useState(forwardNoActive); //上一首
  const [playImg, setPlayImg] = useState(playNoActive); //播放/暂停
  const [lastImg, setLastImg] = useState(lastNoActive); //下一首
  const [volumeImg, setVolumeImg] = useState(volumeNoActive);
  //action--音量条变量
  const [sliderVolume, setSliderVolume] = useState("20%");
  //是否显示播放列表
  const [showPlaylist, setShowPlaylist] = useState(false)

  //获取父元素类为name的ele
  const getMusicacbtnEle = (e, name) => {
    if (e.className == name) {
      return e;
    }
    if (e.parentNode.className == name) {
      return e.parentNode;
    }
    return getMusicacbtnEle(e.parentNode, name);
  };
  //MusicSliderComponent播放/暂停
  const handleSliderPause = () => {
    let audioCurrent = ownAudioRef.current;
    let time = audioCurrent.duration;
    setDuration(time);
    if(!musicPath) {
      //如果当前播放列表中没有歌曲地址, 但是播放列表中有数据, 那么直接播放列表中第一首歌曲
      if((props.songs instanceof Array) && props.songs.length > 0) {
        props.setActiveSong(props.songs[0])
      }else {
        if(props.activeSong.data.id) {
          getMusicUrl(props.activeSong.data.id)
        }
      }
    }
    if(canPlay) {
      setSliderPause(!sliderPause)
      setIsOnPlaying(!sliderPause)
    }else {
      setSliderPause(false)
      setIsOnPlaying(false)
    }
  };
  //播放状态- -也要更新audio的播放状态
  useEffect(() => {
    let audioCurrent = ownAudioRef.current;
    if (sliderPause) {
      setPlayImg(pauseNoActive);
      audioCurrent.play();
    } else {
      setPlayImg(playNoActive);
      audioCurrent.pause();
    }
  }, [sliderPause]);

  //播放结束事件--暂停播放, 重置audio当前时间为0
  useEffect(() => {
    let audioCurrent = ownAudioRef.current;
    setSliderPause(false);
    audioCurrent.currentTime = 0;
  }, [sliderEnd]);

  //播放下一首, 或者播放上一首
  const playPreOrNextSong = (type) => {
    let songs = props.songs;
    let len = songs.length;
    let activeSong = props.activeSong;
    if(type == 1) {
      //播放上一首
      if(activeSong.index == 0) {
        props.setActiveSong(songs[len-1]);
      }else {
        props.setActiveSong(songs[activeSong.index - 1])
      }
    }else {
      //播放下一首
      if(activeSong.index == len-1) {
        props.setActiveSong(songs[0]);
      }else {
        props.setActiveSong(songs[activeSong.index + 1])
      }
    }
  }


  //切换歌曲
  const switchSongs = (type) => {
    setSliderPause(false);
    // let songs = props.songs;
    // let len = songs.length;
    // let activeSong = props.activeSong;
    //上一首/下一首
    //上一首: 如果当前歌曲是列表中第一首; 那么上一首为列表最后一首;
    //下一首: 如果当前歌曲是列表中最后一首, 那么下一首是列表第一首
    switch(type) {
      case 1:
        playPreOrNextSong(1)
        break;
      case 2:
        playPreOrNextSong(2)
        break;
      default:
        break;
    }

  };
  //在ownAudioRef能够播放时, 获取总时长,
  const handleAudioCanPlay = () => {
    console.log('handle auto can play');
    let audioCurrent = ownAudioRef.current;
    setDuration(audioCurrent.duration);
    setCanplay(true)
  };

  //ownAudioRef总时长变化后, 播放musicSliderComponent
  useEffect(() => {
    if (isFirst == 1) {
      setSliderPause(true);
      setIsFirst(0);
    }
  }, [duration]);
  /**
   * ownAudioRef 静音事件
   */

  const mutedAudio = () => {
    let audioCurrent = ownAudioRef.current;
    let volume = audioCurrent.volume;
    if (volume) {
      audioCurrent.volume = 0;
    } else {
      audioCurrent.volume = 0.2;
    }
  };

  /**
   * AudioSlider事件
   */
  //ownAudioRef每次更新progress
  const handleAudioUpdate = () => {
    console.log('audio time update')
    let audioCurrent = ownAudioRef.current;
    let audioTime = audioCurrent.currentTime;
    let percent =
      ((parseFloat(audioTime) / parseFloat(duration)) * 100).toFixed(2) + "%";
    setCurrentAudioTime(percent);
  };
  //进度条变化onChange事件
  const handleAudioSliderChange = (percent) => {
    let audioCurrent = ownAudioRef.current;
    percent = parseFloat(percent);
    let audioDuration = audioCurrent.duration;
    let time = (audioDuration * percent) / 100;
    percent += "%";
    console.log('time', time)
    try {
      audioCurrent.currentTime = time;
    } catch(e) {
      console.log('error: ', e)
    }
    setCurrentAudioTime(percent);
  };

  /**
   * 各种按钮事件
   */
  //按钮点击事件
  const handleActionClick = (event) => {
    let id = event.target.id;
    switch (id) {
      case "forward":
        switchSongs(1);
        break;
      case "play":
        handleSliderPause();
        break;
      case "last":
        switchSongs(2);
        break;
      case 'volume':
        let volume = parseInt(sliderVolume);
        if(volume == 0) {
          handleVolumeSliderChange(0.2)
        }else {
          handleVolumeSliderChange(0)
        }
        break;
      case 'list':
        setShowPlaylist(!showPlaylist)
        break;
      default:
        break;
    }
  };
  //按钮hover事件 type: 1为mouseOver; 2: mouseOut
  const handleActionHover = (type, event) => {
    let id = event.target.id;
    switch (id) {
      case "forward":
        type == 1
          ? setForwardImg(forwardActive)
          : setForwardImg(forwardNoActive);
        break;
      case "play":
        if (sliderPause) {
          type == 1 ? setPlayImg(pauseActive) : setPlayImg(pauseNoActive);
        } else {
          type == 1 ? setPlayImg(playActive) : setPlayImg(playNoActive);
        }
        break;
      case "last":
        type == 1 ? setLastImg(lastActive) : setLastImg(lastNoActive);
        break;
      case "volume":
        type == 1 ? setVolumeImg(volumeActive) : setVolumeImg(volumeNoActive);
        break;
      default:
        break;
    }
  };
  //音量条change事件
  const handleVolumeSliderChange = (vol) => {
    console.log('handle volume slider');
    console.log(vol);
    //vol是小数, 例如0.52
    let audioRef = ownAudioRef.current;
    audioRef.volume = vol;
    let percent = vol * 100 + "%";
    setSliderVolume(percent);
  };

  //获取音乐url
  const getMusicUrl = async (id) => {
    if(!id) {
      return;
    }
    let params = {
      id,
    }
    let data = await HTTPUtils.song_url(params);
    console.log('get music url');
    console.log(data);
    let url = data.data[0].url
    if(!url) {
      //url返回null, 那么说明没有版权, 直接进入下一个数据
      let songs = props.songs;
      let len = songs.length;
      let activeSong = props.activeSong
      if(activeSong.index != -1) {
        //同样的上一首/下一首逻辑
        // if(activeSong.index == (len-1)) {
        //   props.setActiveSong(songs[0])
        // }else {
        //   props.setActiveSong(songs[activeSong.index + 1])
        // }
        playPreOrNextSong(2)
      }
    }else {
      setMuscipath(url)
    }
  }

  //每次播放的歌曲url变化都要重新获取音乐的url
  useEffect(() => {
    setSliderPause(false)
    setCanplay(false)
    getMusicUrl(props.activeSong.data.id);
  }, [props.activeSong.data.id])

  //每首歌曲播放完毕, 继续播放下一首
  useEffect(() => {
    if(parseInt(currentAudioTime) == 100) {
      let songs = props.songs;
      let len = songs.length;
      let activeSong = props.activeSong
      if(activeSong.index != -1) {
        //同样的上一首/下一首逻辑
        playPreOrNextSong(2)
      }
    }
  }, [currentAudioTime])

  //依赖canplay, 如果当前能播放, 并且isOnPlaying为true的情况下, 自动播放歌曲
  useEffect(() => {
    if(canPlay && isOnPlaying) {
      setSliderPause(true)
    }
  }, [canPlay])

  return (
    <div id={props.id} style={{ position: 'relative' }}>
      <audio
        ref={ownAudioRef}
        id="audio"
        src={musicPath}
        onCanPlay={handleAudioCanPlay}
        onTimeUpdate={handleAudioUpdate}
      ></audio>
      {/* <button onClick={handleSliderPause}>开始播放</button>
      <button onClick={switchSongs}>切换歌曲</button>
      <button onClick={mutedAudio}>静音</button> */}
      <div className="audioSlider">
        <AudioSlider
          value={currentAudioTime}
          onChange={handleAudioSliderChange}
        />
        <div className="sliderActions">
          <div className="actionRowContainer">
            <ul
              className="actionRow"
              onClick={handleActionClick}
              onMouseOver={(event) => handleActionHover(1, event)}
              onMouseOut={(event) => handleActionHover(2, event)}
            >
              <li className="actionItem">
                <img
                  className="actionItemImg35 marginHon10"
                  id="forward"
                  src={forwardImg}
                />
              </li>
              <li className="actionItem" >
                <img
                  className="actionItemImg50 marginHon10"
                  id="play"
                  src={playImg}
                />
              </li>
              <li className="actionItem">
                <img
                  className="actionItemImg35 marginHon10"
                  id="last"
                  src={lastImg}
                />
              </li>
              <li className="actionItem">
                <img
                  className="actionItemImg35 marginHon10"
                  id="volume"
                  src={volumeImg}
                />
                <div style={{ backgroundColor: "red", width: 100, display: 'inline-block' }}>
                  <VolumeSlider
                    value={sliderVolume}
                    onChange={handleVolumeSliderChange}
                  />
                </div>
              </li>
              <li className="actionItem">
                <img
                  className="actionItemImg35 marginHon10"
                  id='list'
                  src={listNoActive}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      {showPlaylist ? <SliderPlaylist/> : null}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    songs: state.playlistReducer.data,
    activeSong: state.playlistReducer.active
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addSong: (data, index) => {
      dispatch(addToPlaylist(data, index));
    },
    deleteSong: (data, index) => {
      dispatch(deleteSong(data, index))
    },
    deleteAllSongs: () => {
      dispatch(deleteAllSongs())
    },
    setActiveSong: data => {
      console.log(dispatch);
      dispatch(setActive(data))
    }
  }
}

const MusicSliderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MusicSlider)

export default MusicSliderContainer;
