import React, { useState, useEffect, useRef } from "react";
import { Input, message, Button, Slider } from "antd";
import HTTPUtils from "../HTTPUtils/HTTPUtils";
import "./MusicSlider.less";
// const mp3Path = require('../Sounds/test.mp3')
//测试本地mp3地址
import mp3Path from "../Sounds/test.mp3";
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

//是否mouse move
let isMove = false;
let iswhich = "";
//播放条最开始位置
let startX = 0;
//快进/快退 定时器, 长按快进/快退按钮, 不放开鼠标,定时器id
let outId = "";
let id = "";
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
export default function MusicSlider(props) {
  const whickRef = useRef(null); //为了拖动的时候有个判断是那个封装组件
  const btnRef = useRef(null); //播放/暂停按钮ref
  const adRef = useRef(null); //audio的ref
  const backRef = useRef(null); //音乐条ref
  const bbRef = useRef(null); //音乐条里面的进度条ref
  const bofangRef = useRef(null); //音乐条里面的圆形按钮ref
  const backfastRef = useRef(null); //快退按钮ref
  const fastRef = useRef(null); //快进按钮ref
  const sliderconRef = useRef(null); //音量条ref
  const [isPlay, setIsPlay] = useState(false); //是否播放
  const [isMuted, setIsMuted] = useState(false); //是否静音
  const [sliPer, setSliper] = useState("0%"); //播放条百分比
  const [perInner, setPerinner] = useState("0%"); //时间百分百
  const [musicCurTime, setMusiccurtime] = useState(0); //歌曲当前时间
  const [musicDur, setMusicdur] = useState(0); //歌曲时长
  const [musicPath, setMuscipath] = useState(""); //歌曲地址
  const [loopType, setLoopType] = useState(1); //循环类型, 1:无循环; 2: 单曲循环; 3:列表循环
  const [sliderVal, setSliderVal] = useState(0); //音量滑动条数值
  const [showMusicList, setShowMusicList] = useState(false); //是否显示播放列表--点击播放列表图标, 打开/关闭播放列表
  //音乐 播放/暂停
  const audioPause = () => {
    // let audio = document.getElementById(props.id+'audio');
    let audio = adRef.current;
    console.log("结束");
    console.log("音量: --", audio.volume);
    console.log("是否播放: -", audio.played);
    console.log("是否暂停: --", audio.paused);
    console.log("静音: --", audio.muted);
    console.log("时长: ", audio.duration);
    console.log("循环: --", audio.loop);
    console.log("");
    if (isPlay) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlay(!isPlay);
  };
  //快进/快退; type: 1为快退; 2为快进; 默认为5s
  const fastChange = (type) => {
    // let audio = document.getElementById(props.id+'audio');
    let audio = adRef.current;
    let dur = audio.duration;
    //没有时长,不做操作
    if (!dur || dur == 0) {
      return;
    }
    let cur = audio.currentTime;
    if (cur == dur && type == 2) return;
    if (cur == 0 && type == 1) return;
    cur = type == 1 ? cur - 5 : cur + 5;
    //大于总时长, 则赋值总时长; 小于0, 则赋值0
    cur = cur >= dur ? dur : cur <= 0 ? 0 : cur;
    let per = ((cur / dur) * 100).toFixed(2);
    setRelTime(dur, per);
  };
  //播放栏按钮 hover 与 unhover事件;  --- 主要用于更新图片
  //index为 1: 播放/暂停按钮; 2: 上一首; 3: 快退; 4: 快进; 5: 下一首; 6: 音量; 7 播放列表
  //isHover: true为hover;false为out hover
  const imgHover = (e, isHover, index) => {
    switch (index) {
      case 1:
        e.target.src = isPlay
          ? isHover
            ? pauseActive
            : pauseNoActive
          : isHover
          ? playActive
          : playNoActive;
        break;
      case 2:
        e.target.src = isHover ? forwardActive : forwardNoActive;
        break;
      case 3:
        e.target.src = isHover ? backFastActive : backFastNoActive;
        break;
      case 4:
        e.target.src = isHover ? fastActive : fastNoActive;
        break;
      case 5:
        e.target.src = isHover ? lastActive : lastNoActive;
        break;
      case 6:
        //获取父元素类为musicAcBtn的ele
        let ele6 = getMusicacbtnEle(e.target, "musicAcBtn");
        if (ele6) {
          //这样是为了保持图片处于hover状态
          ele6.getElementsByClassName("musicImg")[0].src = !isMuted
            ? isHover
              ? volumeActive
              : volumeNoActive
            : isHover
            ? mutedActive
            : mutedNoActive;
        }
        break;
      case 7:
        //获取父元素类为musicAcBtn的ele
        let ele7 = getMusicacbtnEle(e.target, "musicAcBtn");
        if (ele7) {
          //这样是为了保持图片处于hover状态
          ele7.getElementsByClassName("musicImg")[0].src = isHover
            ? listActive
            : listNoActive;
        }
        // e.target.src = isHover ? listActive : listNoActive;
        break;
      case 8:
        let hoverLoop =
          loopType == 1
            ? noLoopActive
            : loopType == 2
            ? singleLoopActive
            : allLoopActive;
        let unHoverLoop =
          loopType == 1
            ? noLoopNoActive
            : loopType == 2
            ? singleLoopNoActive
            : allLoopNoActive;
        e.target.src = isHover ? hoverLoop : unHoverLoop;
        break;
      default:
        break;
    }
  };
  //播放栏按钮click事件, ---------主要用于点击事件, 更新数据
  //index为 1: 播放/暂停按钮; 2: 上一首; 3: 快退; 4: 快进; 5: 下一首; 6: 音量; 7 播放列表
  const musicBtnsClick = (e, index) => {
    // let audio = document.getElementById(props.id+'audio');
    let audio = adRef.current;
    switch (index) {
      case 1:
        audioPause();
        break;
      case 2:
        console.log("上一首");
        reset();
        // setIsPlay(true)
        break;
      case 3:
        console.log("快退");
        fastChange(1);
        break;
      case 4:
        console.log("快进");
        fastChange(2);
        break;
      case 5:
        console.log("下一首");
        reset();
        // setIsPlay(true)
        break;
      case 6:
        //目前是静音与否
        console.log("音量");
        if (e.target.localName == "img") {
          let mute = audio.muted;
          audio.muted = !audio.muted;
          if (!mute) {
            setSliderVal(50);
          } else {
            setSliderVal(0);
          }
          setIsMuted(!mute);
        }
        break;
      case 7:
        console.log("播放列表");
        //打开/关闭播放列表
        setShowMusicList(!showMusicList);
        break;
      case 8:
        console.log("循环");
        //切换循环类型
        let type = loopType + 1 > 3 ? 1 : loopType + 1;
        setLoopType(type);
        break;
      default:
        break;
    }
  };
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
  //更新时间
  const updateProgress = (val) => {
    // let audio = document.getElementById(props.id+'audio');
    let audio = adRef.current;
    let curTime = parseInt(audio.currentTime);
    let per = (audio.currentTime / audio.duration) * 100 + "%";
    let dur = parseInt(audio.duration);
    curTime = covertTime(curTime);
    dur = covertTime(dur);
    setSliper(per);
    setMusiccurtime(curTime);
    setMusicdur(dur);
  };
  //audio跳到指定时间
  const seekTime = (tim) => {
    // let audio = document.getElementById(props.id+'audio')
    let audio = adRef.current;
    audio.currentTime = tim;
  };
  //播放结束
  const musicEnded = () => {
    reset();
  };
  //音量+
  const upvolume = () => {
    // let audio = document.getElementById(props.id+'audio')
    let audio = adRef.current;
    for (let keys in audio) {
      console.log(keys);
    }
    console.log("音量+: ", audio.volume);
    console.log(audio.paused);
    console.log(audio.readyState);
    console.log(audio.playbackRate);
    // console.log('速率: --', audio.ra)
    audio.volume += 0.01;
    // audio.volume -=1
  };
  //音量-
  const downvolume = () => {
    // let audio = document.getElementById("audio")
    let audio = adRef.current;
    console.log("音量-: ", audio.volume);
    audio.volume -= 0.01;
  };
  //静音
  const muted = () => {
    // let audio = document.getElementById(props.id+'audio')
    let audio = adRef.current;
    console.log("静音: ", audio.muted);
    audio.muted = audio.muted ? false : true;
  };
  //循环
  const loopMusic = () => {
    // let audio = document.getElementById(props.id+'audio')
    let audio = adRef.current;
    console.log("循环: ", audio.loop);
    audio.loop = audio.loop ? false : true;
  };
  //播放条系列方法
  //拖动开始
  const dragStart = (e) => {
    console.log("drag start");
    e.dataTransfer.setData("text", e.target.id);
  };
  //拖动放下
  const dropHandle = (e) => {
    console.log("drop");
    e.currentTarget.style.background = "green";
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    let dragEle = document.getElementById(data);
    console.log(dragEle.style);
    dragEle.style.left = dragEle.style.left
      ? parseInt(dragEle.style.left) + 50 + "px"
      : "50px";
    e.target.appendChild(document.getElementById(data));
  };
  //拖动过程中over
  const dragover = (e) => {
    e.preventDefault();
  };
  //重置播放条,(用于歌曲地址改变, 播放完毕下一首,)
  const reset = () => {
    let p = "0%";
    // let bb = document.getElementById(props.id+'bb')
    // let bof = document.getElementById(props.id+'bofang');
    // let audio = document.getElementById(props.id+'audio')
    let bb = bbRef.current;
    let bof = bofangRef.current;
    let audio = adRef.current;
    bof.style.left = p;
    bb.style.width = p;
    setSliper(p);
    setPerinner(p);
    setMusiccurtime(covertTime(0));
    seekTime(0);
    setMusicdur(covertTime(parseInt(audio.duration)));
  };
  //mousemove, mouseup统一设置播放条, 播放条按钮, 当前时间, audio跳转seek时间
  const setAllTime = (moveX) => {
    let ele = document.getElementById(props.id);
    // let bof = document.getElementById(props.id+'bofang');
    // let bk = document.getElementById(props.id+'back');
    // let audio = document.getElementById(props.id+'audio');
    // let bb = document.getElementById(props.id+'bb');
    let audio = adRef.current;
    let bof = bofangRef.current;
    let bb = bbRef.current;
    let bk = backRef.current;
    let lft = bof.style.left ? parseFloat(bof.style.left) : 0;
    let movePer = (moveX / bk.scrollWidth) * 100 + lft;
    movePer = movePer > 100 ? 100 : movePer < 0 ? 0 : movePer;
    movePer = movePer.toFixed(2);
    bof.style.left = movePer + "%";
    bb.style.width = movePer + "%";
    let dur = audio.duration;
    setRelTime(dur, movePer);
  };
  //统一设置播放条, 播放条按钮, 当前时间, audio跳转seek时间
  const setRelTime = (dur, per) => {
    let curTime = parseInt((dur * per) / 100);
    curTime = covertTime(curTime);
    setMusiccurtime(curTime);
    seekTime((dur * per) / 100);
    setSliper(per + "%");
    setPerinner(per + "%");
  };

  /**
   *
   * 音量变化相应事件
   */
  //音量条数值改变事件
  const sliderValChange = (e) => {
    e.preventDefault();
    let val = e.target.value;
    setSliderVal(val);
  };
  //音量条数值变化(0-100), 要改变audio的音量(0-1)
  useEffect(() => {
    let audioVol = parseInt(sliderVal) / 100;
    // let audio = document.getElementById(props.id+'audio');
    let audio = adRef.current;
    audio.volume = audioVol;
    if (audioVol == 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  }, [sliderVal]);

  //歌曲地址改变时,所引发的事件--
  useEffect(() => {
    reset();
  }, [musicPath]);
  //页面刚加载时, 初始化各种listener(click, mouseup, mousedown)
  useEffect(() => {
    // let back = document.getElementById(props.id+'back');
    let back = backRef.current;
    //获取click 进度条
    back.addEventListener("click", (e) => {
      //递归返回id为back的元素的宽度, 适用于未指定宽度的元素(scrollWidth)
      function searchPar(e) {
        if (e.id == "back") {
          return e.scrollWidth;
        } else {
          if (e.parentNode.id != "back") {
            return searchPar(e.parentNode);
          } else if (e.parentNode.id == "back") {
            let p = e.scrollWidth;
            return p;
          }
        }
      }
      let per = document.getElementById("per");
      //获取id为back元素的宽度
      let reP = searchPar(e.target);
      // let btn = document.getElementById(props.id+'bofang');
      // let bb = document.getElementById(props.id+'bb');
      // let audio = document.getElementById(props.id+'audio');
      let audio = adRef.current;
      let btn = bofangRef.current;
      let bb = bbRef.current;
      // let btnPer = ((e.offsetX - 10) / reP) * 100
      let btnPer = (e.offsetX / reP) * 100;
      //如果e.target为按钮, e.offsetX就是相对于自身x水平位置, 即btnPer, 如果不是, 则btnPer为相对back的水平位置
      // if (e.target.id == (props.id+'bofang')) {
      if (e.target.id == "bofang") {
        let left = btn.style.left ? parseFloat(btn.style.left) : 0;
        btnPer = btnPer + left;
      }
      if (btnPer > 100) {
        btnPer = 100;
      } else if (btnPer < 0) {
        btnPer = 0;
      }
      btnPer = btnPer.toFixed(2);
      btn.style.left = btnPer + "%";
      bb.style.width = btnPer + "%";
      let dur = audio.duration;
      setRelTime(dur, btnPer);
    });
    // let bofang = document.getElementById(props.id+'bofang');
    let bofang = bofangRef.current;
    bofang.addEventListener(
      "click",
      (e) => {
        console.log("bofang bofang");
        //取消冒泡, id为back的父元素不会接收到click事件
        e.cancelBubble = true;
        // isMove = true
      },
      true
    );
    bofang.addEventListener("mousedown", (e) => {
      startX = e.screenX;
      isMove = true;
      // iswhich = props.id
      iswhich = whickRef;
      document.onselectstart = function () {
        return false;
      };
    });
    document.addEventListener("mousemove", (e) => {
      if (isMove && iswhich == whickRef) {
        let moveX = e.screenX - startX;
        startX = e.screenX;
        setAllTime(moveX);
      }
    });
    document.addEventListener("mouseup", (e) => {
      //清除快进/快退长按监听器
      outId && clearTimeout(outId);
      id && clearInterval(id);
      //如果是点击播放条按钮没放开鼠标的话, 才会改变相应数据
      if (isMove && iswhich == whickRef) {
        let moveX = e.screenX - startX;
        startX = e.screenX;
        setAllTime(moveX);
        isMove = false;
        iswhich = "";
        document.onselectstart = function () {
          return true;
        };
      }
    });
    document.addEventListener("dragstart", (e) => {
      // if (isMove) {
      //     let moveX = e.screenX - startX;
      //     startX = e.screenX;
      //     setAllTime(moveX, false);
      // }
      // isMove = false
      isMove = true;
      iswhich = whickRef;
      document.onselectstart = function () {
        return false;
      };
    });
    document.addEventListener("dragend", (e) => {
      if (isMove && whickRef == iswhich) {
        let moveX = e.screenX - startX;
        startX = e.screenX;
        setAllTime(moveX);
        isMove = false;
        iswhich = "";
        document.onselectstart = function () {
          return true;
        };
      }
    });
    //全局添加click事件, 隐藏-播放列表/音量弹窗/播放列表
    document.addEventListener("click", (e) => {
      let eClass = e.target.className;
      if (eClass != "test") {
        let test = document.getElementsByClassName("test");
        //test为HTMLCollection类型, 为类数组, 不能用数组的map方法
        let len = test.length;
        let i = 0;
        while (i < len) {
          test[i].style.display = "none";
          i++;
        }
      }
      //是否是类名为name元素, 或者子元素, 逻辑: 递归查找, 如果最后元素为null, 返回false, 如果找到(类名相同), 返回true
      function isNameEle(tar, name1, name2) {
        if (!tar) {
          //如果最终查不到想要的元素, fanhuifalse
          return false;
        }
        if (tar.className) {
          //为什么用indexof , 因为有的元素有多个类名
          if (
            tar.className.indexOf(name1) != -1 ||
            tar.className.indexOf(name2) != -1
          ) {
            //如果是想要查找的元素, 返回true
            return true;
          }
        }
        return isNameEle(tar.parentNode, name1, name2);
      }
      let islist = isNameEle(e.target, "musicList", "listimg");
      //如果类名不是 播放列表图标/播放列表中元素, 则将播放列表关闭
      if (!islist) {
        setShowMusicList(false);
      }
    });
    //为音量条添加滚轮滚动事件--改变音量大小
    // let sliderCon = document.getElementsByClassName(props.id+'sliderCon')[0];
    // let audio = document.getElementById(props.id+'audio')
    let sliderCon = sliderconRef.current;
    let audio = adRef.current;
    sliderCon.addEventListener("mousewheel", (e) => {
      let add = e.deltaY > 0 ? false : true;
      let oldVal = audio.volume * 100;
      //在这里要用audio的volume, 不能用sliderVal, 因为useEffect中的依赖数组为[], 所以sliderVal永远为最初的值
      let vol = add ? oldVal + 2 : oldVal - 2;
      vol = vol < 0 ? 0 : vol > 100 ? 100 : vol;
      audio.volume = vol / 100;
      setSliderVal(vol);
    });
    //为快进/快退 按钮, 添加mouse up长按监听listener
    // let backFast = document.getElementById(props.id+'backFast');
    // let fast = document.getElementById(props.id+'fast');
    let backFast = backfastRef.current;
    let fast = fastRef.current;
    backFast.addEventListener("mousedown", () => {
      outId = setTimeout(() => {
        id = setInterval(() => {
          fastChange(1);
        }, 500);
      }, 2000);
    });
    fast.addEventListener("mousedown", () => {
      outId = setTimeout(() => {
        id = setInterval(() => {
          fastChange(2);
        }, 500);
      }, 2000);
    });
    setMuscipath(mp3Path);
  }, []);
  /**
   * 播放列表系列事件
   */
  //双击列表item, 播放该歌曲
  const listItemDBClick = () => {};
  //点击相应图标
  /**
   *
   * @param {*} type 1为打开mv; 2为收藏/取消收藏; 3为下一首播放; 4为加入播放列表
   */
  const listItemImgClick = (type) => {
    switch (type) {
      case 1:
        console.log("打开mv");
        break;
      case 2:
        console.log("收藏/取消收藏");
        break;
      case 3:
        console.log("下一首播放");
        break;
      case 4:
        console.log("加入播放列表");
        break;
      default:
        break;
    }
  };
  /**
   * 播放列表组件
   */
  //播放列表
  const MusicList = (props) => {
    return (
      <div className="musicList">
        {[1, 3, 5, 7, 6, 9].map((item, index) => {
          return (
            <MusicListItem
              key={index}
              index={index}
              dbClick={listItemDBClick}
            />
          );
        })}
      </div>
    );
  };
  //播放列表item组件
  const MusicListItem = (props) => {
    return (
      <div
        className={`musicListItem ${props.index == 1 ? "itemActive" : null}`}
        onDoubleClick={props.dbClick}
      >
        <div className="musicListItemChild">
          <img className="musicListItemImg" src={itemPlay} />
          <p>音乐列表item</p>
          <abbr style={{ cursor: "pointer" }} title="mv">
            <img
              className="musicListItemImg"
              src={MV}
              onClick={() => listItemImgClick(1)}
            />
          </abbr>
        </div>
        <div className="musicListItemChild">
          <abbr style={{ cursor: "pointer" }} title="收藏">
            <img
              className="musicListItemImg"
              src={like}
              onClick={() => listItemImgClick(4)}
            />
          </abbr>
          <abbr style={{ cursor: "pointer" }} title="下一首播放">
            <img
              className="musicListItemImg"
              src={joinNext}
              onClick={() => listItemImgClick(3)}
            />
          </abbr>
          <abbr style={{ cursor: "pointer" }} title="加入播放列表">
            <img
              className="musicListItemImg"
              src={add}
              onClick={() => listItemImgClick(4)}
            />
          </abbr>
        </div>
      </div>
    );
  };
  return (
    <div id={props.id}>
      <audio
        ref={adRef}
        id="audio"
        controls
        src={musicPath}
        onTimeUpdate={(e) => updateProgress()}
        onEnded={musicEnded}
      ></audio>
      <div>
        <button onClick={audioPause}>播放/暂停</button>
        <button onClick={seekTime}>seek</button>
        <button onClick={upvolume}>音量+</button>
        <button onClick={downvolume}>音量-</button>
        <button onClick={muted}>静音</button>
        <button onClick={loopMusic}>循环</button>
      </div>
      <div
        style={{ margin: "0 50px", height: "10px", zIndex: 50 }}
        id="back"
        ref={backRef}
        className="back"
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "gray",
            opacity: 0.5,
            marginTop: 10,
            position: "relative",
          }}
        >
          <div
            id="bb"
            ref={bbRef}
            style={{
              height: "100%",
              backgroundColor: "blue",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              width: sliPer,
            }}
          ></div>
          <div
            id="bofang"
            ref={bofangRef}
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "blue",
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              left: sliPer,
              boxShadow: "0 0 15px 5px blue",
            }}
          ></div>
        </div>
      </div>
      <div className="musicActions">
        <button
          className="musicAcBtn"
          onClick={(e) => musicBtnsClick(e, 2)}
          onMouseOver={(e) => imgHover(e, true, 2)}
          onMouseOut={(e) => imgHover(e, false, 2)}
        >
          <img
            className="musicImg"
            src={forwardNoActive}
            style={{ width: 30, height: 30, objectFit: "cover" }}
          />
        </button>
        <button
          id="backFast"
          ref={backfastRef}
          className="musicAcBtn"
          onClick={(e) => musicBtnsClick(e, 3)}
          onMouseOver={(e) => imgHover(e, true, 3)}
          onMouseOut={(e) => imgHover(e, false, 3)}
        >
          <img
            className="musicImg"
            src={backFastNoActive}
            style={{ width: 30, height: 30, objectFit: "cover" }}
          />
        </button>
        <button
          ref={btnRef}
          className="musicAcBtn"
          onClick={(e) => musicBtnsClick(e, 1)}
          onMouseOver={(e) => imgHover(e, true, 1)}
          onMouseOut={(e) => imgHover(e, false, 1)}
        >
          <img
            className="musicImg"
            src={isPlay ? pauseNoActive : playNoActive}
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        </button>
        <button
          id="fast"
          ref={fastRef}
          className="musicAcBtn"
          onClick={(e) => musicBtnsClick(e, 4)}
          onMouseOver={(e) => imgHover(e, true, 4)}
          onMouseOut={(e) => imgHover(e, false, 4)}
        >
          <img
            className="musicImg"
            src={fastNoActive}
            style={{ width: 30, height: 30, objectFit: "cover" }}
          />
        </button>
        <button
          className="musicAcBtn"
          onMouseOver={(e) => imgHover(e, true, 5)}
          onMouseOut={(e) => imgHover(e, false, 5)}
        >
          <img
            className="musicImg"
            src={lastNoActive}
            style={{ width: 30, height: 30, objectFit: "cover" }}
            onClick={(e) => musicBtnsClick(e, 5)}
          />
        </button>
        <button
          className="musicAcBtn"
          onClick={(e) => musicBtnsClick(e, 6)}
          onMouseOver={(e) => imgHover(e, true, 6)}
          onMouseOut={(e) => imgHover(e, false, 6)}
        >
          <img
            className="musicImg"
            src={!isMuted ? volumeNoActive : mutedNoActive}
            style={{ width: 30, height: 30, objectFit: "cover" }}
          />
          <div className={[`sliderCon`]} ref={sliderconRef}>
            <input type="range" value={sliderVal} onChange={sliderValChange} />
          </div>
        </button>
        <button
          className="musicAcBtn"
          onClick={(e) => musicBtnsClick(e, 7)}
          onMouseOver={(e) => imgHover(e, true, 7)}
          onMouseOut={(e) => imgHover(e, false, 7)}
        >
          <img
            className="musicImg listimg"
            src={listNoActive}
            style={{ width: 30, height: 30, objectFit: "cover" }}
          />
        </button>
        <button
          className="musicAcBtn"
          onClick={(e) => musicBtnsClick(e, 8)}
          onMouseOver={(e) => imgHover(e, true, 8)}
          onMouseOut={(e) => imgHover(e, false, 8)}
        >
          <img
            className="musicImg"
            src={
              loopType == 1
                ? noLoopNoActive
                : loopType == 2
                ? singleLoopNoActive
                : allLoopNoActive
            }
            style={{ width: 30, height: 30, objectFit: "cover" }}
          />
        </button>
        <div
          style={{ position: "absolute", right: 15, top: 10, color: "white" }}
        >
          {musicCurTime + " " + "/" + " " + musicDur}
        </div>
        {showMusicList ? <MusicList /> : null}
      </div>
      <div id="per">{perInner}</div>
      <button onClick={reset}>重置</button>
    </div>
  );
}
