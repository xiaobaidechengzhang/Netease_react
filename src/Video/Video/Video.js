import React, { useState, useEffect, useRef } from 'react';
import { useParams, withRouter } from 'react-router';
import HTTPUtils from '../../HTTPUtils/HTTPUtils';
import { exchangeDuration, exchangeTime } from '../../Utils';
import './Video.less'

//图片资源
import PlayImg from "@/images/Playlist/play.png";

function Video(props) {

  //视频页面ref
  const VideoRef = useRef();
  const [videoGroupList, setVideoGroupList] = useState([]); //视频标签列表数据
  const [selGroupID, setSelGroupID] = useState("0"); //选中的视频标签item ID
  const [isSpreadGroupList, setIsSpreadGroupList] = useState(false); //是否展开视频标签列表

  //视频数据
  const [videoData, setVideoData] = useState([]);
  //视频数据页数
  const [videoDataPage, setVideoDataPage] = useState(1);
  //是否还有更多视频数据
  const [isHasMoreData, setIsHasMoreData] = useState(true);
  
  //页面是否到达底部
  const [arriveBottom, setArriveBottom] = useState(false);

  /**
   * 需要登录
   * 获取视频系列接口-----------------------------------------------------------------
   */
  //接口---获取视频标签列表
  const getVideoCatList = async () => {
    let data = await HTTPUtils.video_group_list();
    data.data.unshift({ id: "0", name: "全部" });
    setSelGroupID(data.data[0].id);
    setVideoGroupList(data.data);
  };
  //事件---视频标签item click点击事件
  const selectVideoGroup = async (item) => {
    setSelGroupID(item.id);
    setIsHasMoreData(true);
    setVideoDataPage(1)
  };
  //事件---展开/关闭视频标签列表
  const changeGroupListHeight = () => {
    setIsSpreadGroupList(!isSpreadGroupList);
  };

  //依赖 选中的标签 获取该标签下视频列表
  useEffect(() => {
    getVideoGroup(selGroupID);
  }, [selGroupID, videoDataPage])

  //接口---获取相应视频标签下视频列表
  const getVideoGroup = async (id) => {
    if (id == 0) {
      getAllVideo()
      return;
    }
    let obj = {
      id: id,
      offset: (videoDataPage-1) * 20
    };
    let data = await HTTPUtils.video_group(obj);
    console.log("视频");
    console.log(data);
    // let data = await HTTPUtils.video_timeline_all();
    //滚动加载数据
    let pageData = videoDataPage == 1 ? data.datas : videoData.concat(data.datas);
    setVideoData(pageData);
    if(!data.hasmore) {
      //如果没有更多数据, 设置isHasMoreData, 该属性用于显示正在加载..或者已经到底文本
      setIsHasMoreData(false)
    }
  };

  //获取全部视频
  const getAllVideo = async () => {
    let params = {
      offset: (videoDataPage - 1) * 8
    }
    let data = await HTTPUtils.video_timeline_all(params);
    //滚动加载数据
    let pageData = videoDataPage == 1 ? data.datas : videoData.concat(data.datas);
    setVideoData(pageData);
    if(!data.hasmore) {
      //如果没有更多数据, 设置isHasMoreData, 该属性用于显示正在加载..或者已经到底文本
      setIsHasMoreData(false)
    }
  }


  //依赖 是否到达底部arriveBottom, 到达底部 videoDataPage + 1
  useEffect(() => {
    setVideoDataPage(videoDataPage + 1)
  }, [arriveBottom])


  /**
   * 防抖事件 处理滚动加载事件
   */
  //防抖事件
  const debounceHandleScroll = (func, timeDelay) => {
    let timer = null;
    return function() {
      console.log('opopopopopopppo');
      if(timer) {
        return ;
      }
      timer = setTimeout(() => {
        func();
        timer = null;
      }, timeDelay)
    }
  }

  //事件-- 处理滚动事件
  const handleScroll = () => {
    if(VideoRef.current) {
        //标签在评论列表
        let currentElem = VideoRef.current;
        //整个页面的滚动高度-即实际高度
        let scrollHeight = currentElem.scrollHeight;
        //整个页面已滚动的高度
        let scrollTop = currentElem.scrollTop;
        //整个页面的可视高度
        const {height} = currentElem.getBoundingClientRect();
        let scroll_to_bottom_distance = scrollHeight - scrollTop - height;
        console.log(scroll_to_bottom_distance);
        if(scroll_to_bottom_distance < 100) {
          //当距离底部还有100px的时候, 执行加载评论操作
          console.log('已经到达底部');
          setArriveBottom(bottom => !bottom)
          
        }
    }
  }

  useEffect(() => {
    //获取标签列表
    getVideoCatList();
    //获取全部视频
    getAllVideo()
    //对页面添加滚动监听事件
    VideoRef.current?.addEventListener('scroll', debounceHandleScroll(handleScroll, 500))
  }, [])

  /**
   * 视频列表数据, 组件以及事件
   */
  //进入video详情页面
  const navigateDetail = (item, index) => {
    console.log('视频数据');
    console.log(item);
    props.history.push('/video/' + item.data.vid)
  }

  //视频item
  const ListItem = ({ item, index }) => {
    return (
      <div
        key={item.data?.vid || index.toString()}
        className={`allPlItem is_video`}
        onClick={() => navigateDetail(item, index)}
        data-video={item.data.vid}
      >
        <div
          className="allPlItemImgContainer"
        // onClick={() => playlistDetail(item)}
        >
          <img
            // src={item.coverImgUrl + "?param=280y280"}
            src={item.data?.coverUrl + "?param=280y280"}
            className="allPlItemImgConMain"
          />
          <div className="allPlItemImgContainerTL">
            <img src={PlayImg} className="deImg" />
            <span>{item.data?.playTime}</span>
          </div>
          <div
            className="allPlItemImgContainerRB"
          >
            {/* <img src={PlayHoverImg} className="rbImg" /> */}
            <span>{exchangeDuration(item.data.durationms)}</span>
          </div>
        </div>
        <p className="allPlItemDesc">{item.data?.title}</p>
        <p>{item.data?.creator?.nickname || ''}</p>
      </div>
    )
  }

  return (
    <div ref={VideoRef} className='videoPage'>
      <div
        className={`videoGroupList
                    ${isSpreadGroupList ? "autoHeight" : "fixedHeight"}
                    `}
      >
        {videoGroupList.map((item, index) => {
          return (
            <span
              key={item.id}
              className={`
                                    videoGroupListItem 
                                    ${item.id == selGroupID
                  ? "videoGroupListItemActive"
                  : null
                }
                                `}
              onClick={() => selectVideoGroup(item)}
            >
              {item.name}
            </span>
          );
        })}
      </div>
      <div
        style={{ borderBottom: "1px solid red", cursor: "pointer" }}
        onClick={changeGroupListHeight}
      >
        <p style={{ color: "red", textAlign: "right", padding: "0 20px" }}>
          展开
        </p>
      </div>
      <div>

      </div>
      <div>
        {
          (videoData instanceof Array) && videoData.map((item, index) => {
            return <ListItem item={item} key={index.toString()} index={index} />
          })
        }
      </div>
    </div>
  )
}

export default withRouter(Video);