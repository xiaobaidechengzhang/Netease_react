import React, { useState, useEffect, useRef } from 'react';
import { useParams, withRouter } from 'react-router';
import HTTPUtils from '../../HTTPUtils/HTTPUtils';
import { exchangeDuration, exchangeTime } from '../../Utils';
import './MV.less'

//图片资源
import PlayImg from "@/images/Playlist/play.png";

function MV(props) {

  //视频页面ref
  const MvRef = useRef();
  const [videoGroupList, setVideoGroupList] = useState([]); //视频标签列表数据
  const [selGroupID, setSelGroupID] = useState("0"); //选中的视频标签item ID
  const [isSpreadGroupList, setIsSpreadGroupList] = useState(false); //是否展开视频标签列表

  //视频分类数据
  //地区
  const [areas, setAreas] = useState([
    { id: -1, name: '全部'},
    { id: 1, name: '内地'},
    { id: 2, name: '港台'},
    { id: 3, name: '欧美'},
    { id: 4, name: '韩国'},
    { id: 5, name: '日本'},
  ]);
  //类型
  const [types, setTypes] = useState([
    { id: -1, name: '全部'},
    { id: 1, name: '官方版'},
    { id: 2, name: '原声'},
    { id: 3, name: '现场版'},
    { id: 4, name: '网易出品'},
  ]);
  //排序
  const [cats, setCats] = useState([
    {id: 1, name: '上升最快'},
    {id: 2, name: '最热'},
    {id: 3, name: '最新'},
  ]);
  const [activeType, setActiveType] = useState({id: -1, name: '全部'}); //当前active的MV类型
  const [activeArea, setActiveArea] = useState({id: -1, name: '全部'}); //当前active的地区
  const [activeCat, setActiveCat] = useState({id: 1, name: '上升最快'}); //当前active的MV热度排序

  //视频数据
  const [mvData, setMVData] = useState([]);
  //视频数据页数
  const [mvDataPage, setMVDataPage] = useState(1);
  //是否还有更多视频数据
  const [isHasMoreData, setIsHasMoreData] = useState(true);
  
  //页面是否到达底部
  const [arriveBottom, setArriveBottom] = useState(false);

  /**
   * 获取MV类型数据
   */
  /**
   * 
   * @param {Number} id : 所选对应类别item的id
   * @param {Number} type : 1为地区; 2为类型; 3为order排序
   */
   const selectCatItem = (id, type) => {
    setMVDataPage(1)
    switch(type) {
      case 1:
        setActiveArea(id);
        break;
      case 2:
        setActiveType(id);
        break;
      case 3:
        setActiveCat(id);
        break;
      default:
        break;
    }
  }

  
  // //依赖 选中的标签 获取该标签下视频列表
  // useEffect(() => {
  //   getVideoGroup(selGroupID);
  // }, [selGroupID, videoDataPage])

  // //接口---获取相应视频标签下视频列表
  // const getVideoGroup = async (id) => {
  //   if (id == 0) {
  //     getAllVideo()
  //     return;
  //   }
  //   let obj = {
  //     id: id,
  //     offset: (videoDataPage-1) * 20
  //   };
  //   let data = await HTTPUtils.video_group(obj);
  //   console.log("视频");
  //   console.log(data);
  //   // let data = await HTTPUtils.video_timeline_all();
  //   //滚动加载数据
  //   let pageData = videoDataPage == 1 ? data.datas : videoData.concat(data.datas);
  //   setVideoData(pageData);
  //   if(!data.hasmore) {
  //     //如果没有更多数据, 设置isHasMoreData, 该属性用于显示正在加载..或者已经到底文本
  //     setIsHasMoreData(false)
  //   }
  // };

  // //获取全部视频
  // const getAllVideo = async () => {
  //   let params = {
  //     offset: (videoDataPage - 1) * 8
  //   }
  //   let data = await HTTPUtils.video_timeline_all(params);
  //   //滚动加载数据
  //   let pageData = videoDataPage == 1 ? data.datas : videoData.concat(data.datas);
  //   setVideoData(pageData);
  //   if(!data.hasmore) {
  //     //如果没有更多数据, 设置isHasMoreData, 该属性用于显示正在加载..或者已经到底文本
  //     setIsHasMoreData(false)
  //   }
  // }

  //获取全部MV
  const getAllMV = async () => {
    let params= {
      area: activeArea.name,
      type: activeType.name,
      order: activeCat.name,
      offset: (mvDataPage - 1) * 30
    }
    if(!isHasMoreData) {
      return;
    }
    let data = await HTTPUtils.mv_all(params);
    let mv_data = mvDataPage == 1 ? data.data : mvData.concat(data.data);
    setMVData(mv_data)
    if(!data.hasMore) {
      setIsHasMoreData(false)
    }
  }

  //依赖 activeArea, activeType, activeCat, 每次类型变化, 需要加载相对应类型的MV数据
  useEffect(() => {
    getAllMV();
  }, [activeArea.name, activeType.name, activeCat.name, mvDataPage])


  //依赖 是否到达底部arriveBottom, 到达底部 videoDataPage + 1
  useEffect(() => {
    setMVDataPage(mvDataPage + 1)
  }, [arriveBottom])



  /**
   * 导航-进入MV详情页面
   */
  const navigateMVDetail = (item) => {
    props.history.push('/mv/'+item.id)
  }

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
    if(MvRef.current) {
        //标签在评论列表
        let currentElem = MvRef.current;
        //整个页面的滚动高度-即实际高度
        let scrollHeight = currentElem.scrollHeight;
        //整个页面已滚动的高度
        let scrollTop = currentElem.scrollTop;
        //整个页面的可视高度
        const {height} = currentElem.getBoundingClientRect();
        let scroll_to_bottom_distance = scrollHeight - scrollTop - height;
        console.log(scroll_to_bottom_distance);
        if(scroll_to_bottom_distance < 30) {
          //当距离底部还有100px的时候, 执行加载评论操作
          console.log('已经到达底部');
          setArriveBottom(bottom => !bottom)
          
        }
    }
  }

  useEffect(() => {
    //获取MV
    //获取全部视频
    // getAllVideo()
    //获取MV排行
    getAllMV();
    //对页面添加滚动监听事件
    MvRef.current?.addEventListener('scroll', debounceHandleScroll(handleScroll, 500))
  }, [])


  //视频item
  const ListItem = ({ item, index }) => {
    return (
      <div
        key={item.data?.vid || index.toString()}
        className={`allPlItem is_mv`}
        onClick={() => navigateMVDetail(item)}
        data-mv={item.id}
      >
        <div
          className="allPlItemImgContainer"
        // onClick={() => playlistDetail(item)}
        >
          <img
            // src={item.coverImgUrl + "?param=280y280"}
            src={item.cover + "?param=280y280"}
            className="allPlItemImgConMain"
          />
          <div className="allPlItemImgContainerTL">
            <img src={PlayImg} className="deImg" />
            <span>{item.playCount}</span>
          </div>
          <div
            className="allPlItemImgContainerRB"
          >
            {/* <img src={PlayHoverImg} className="rbImg" /> */}
            <span>{exchangeDuration(item.duration)}</span>
          </div>
        </div>
        <p className="allPlItemDesc">{item.name}</p>
        <p>{item.artistName || ''}</p>
      </div>
    )
  }

  return (
    <div ref={MvRef} className='videoPage'>
      <div>
        <div className="itemOptions">
          <div className="itemOptionsRow itemOptionsRowLeft">地区: </div>
          <div className="itemOptionsRow itemOptionsRowRight">
            {areas.map((item, index) => {
              return (
                <span key={item.id+'_'+index} className="artistItemContainer">
                  <span
                    className={`${
                      activeArea.id == item.id ? "activeItem" : ""
                    } artistItem`}
                    onClick={() =>selectCatItem(item, 1)}
                  >
                    {item.name}
                  </span>
                  {index!= areas.length-1 ? <span style={{padding: '0 10px'}}>|</span> : null}
                </span>
              );
            })}
          </div>
        </div>
        <div className="itemOptions">
          <div className="itemOptionsRow itemOptionsRowLeft">分类: </div>
          <div className="itemOptionsRow itemOptionsRowRight">
            {types.map((item, index) => {
              return (
                <span key={item.id+'_'+index} className="artistItemContainer">
                  <span
                    className={`${
                      activeType.id == item.id ? "activeItem" : ""
                    } artistItem`}
                    onClick={() =>selectCatItem(item, 2)}
                  >
                    {item.name}
                  </span>
                  {index!= types.length-1 ? <span style={{padding: '0 10px'}}>|</span> : null}
                </span>
              );
            })}
          </div>
        </div>
        <div className="itemOptions">
          <div className="itemOptionsRow itemOptionsRowLeft">排序: </div>
          <div className="itemOptionsRow itemOptionsRowRight">
            {cats.map((item, index) => {
              return (
                <span key={item.id+'_'+index} className="artistItemContainer">
                  <span
                    key={item.id}
                    className={`${
                      activeCat.id == item.id ? "activeItem" : ""
                    } artistItem`}
                    onClick={() =>selectCatItem(item, 3)}
                  >
                    {item.name}
                  </span>
                  {index!= cats.length-1 ? <span style={{padding: '0 10px'}}>|</span> : null}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div>
        {
          (mvData instanceof Array) && mvData.map((item, index) => {
            return <ListItem item={item} key={item.id.toString()} index={index} />
          })
        }
      </div>
    </div>
  )
}

export default withRouter(MV);