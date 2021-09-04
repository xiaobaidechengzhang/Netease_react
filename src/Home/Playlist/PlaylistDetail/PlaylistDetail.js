import React, { useState, useEffect, useRef  } from "react";
import { Input, Pagination } from 'antd'
import { useParams } from 'react-router-dom'
import "./PlaylistDetail.less";
import HTTPUtils from "../../../HTTPUtils/HTTPUtils";
import { exchangeTime, exchangeDuration } from "@/Utils";
// import {AddWhitePng, PlayPng, SharePng, DownloadPng, DownPng, UpPng, ShoucangPng, NoShoucangPng, NoZanPng, ZanPng, ShareRound, CommentRoundPng, GenderMale, GenderFemale,  } from '../../../images/Playlist'
import AddPng from "@/images/music/musicListItem/no-add.png";
import SubPng from "@/images/NewestSong/sub.png";
import AddWhitePng from "@/images/Playlist/addWhite.png";
import PlayPng from "@/images/Playlist/play.png";
import SharePng from "@/images/Playlist/share.png";
import DownloadPng from "@/images/Playlist/download.png";
import DownPng from "@/images/Playlist/down.png";
import UpPng from "@/images/Playlist/up.png";
import ShoucangPng from "@/images/Playlist/shoucang.png";
import NoShoucangPng from "@/images/Playlist/noshoucang.png";
import NoZanPng from "@/images/Playlist/no-zan.png";
import ZanPng from "@/images/Playlist/zan.png";
import ShareRound from "@/images/Playlist/share-round.png";
import CommentRoundPng from "@/images/Playlist/comment-round.png";
import GenderMale from "@/images/Playlist/gender-male.png";
import GenderFemale from "@/images/Playlist/gender-female.png";
import MyTextarea from './MyTextarea';
//react相关插件 数据
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { addToPlaylist, deleteAllSongs, deleteSong, getSongs, setSongs, setActive } from '../../../store/actions/playlistActions'

let is_scroll_listener = null;

function PlaylistDetail(props) {
  //Ref
  const playlistDetailRef = useRef();
  //歌单id: 6781111608
  const {id} = useParams()
  //数据---歌单简介-展开与收齐(boolean);
  const [desExpand, setDesExpand] = useState(false);
  //数据---歌单详情--评论--评论输入框val
  const [commentVal, setCommentVal] = useState("");
  //数据---歌单tab index  1:歌曲列表; 2: 评论列表; 3: 收藏列表
  const [tabIndex, setTabIndex] = useState("1");
  const [arriveBottom, setArriveBottom] = useState(false)

  /**
   * 歌单数据
   */
  const [basicData, setBasicData] = useState({}); //歌单基本信息(封面, 描述, 创建者etc)
  const [songsData, setSongsData] = useState([]); //获取歌单中已加载的歌曲列表
  const [allSongsData, setAllSongsData] = useState([]);//歌单中所有歌曲的信息
  const [songsIdData, setSongsIdData] = useState([]);//所有歌曲track id;
  const [currentPage, setCurrentPage] = useState(1);//当前页数
  const [pageSize, setPageSize] = useState(40);//每页显示数量

  /**
   * 收藏者数据
   */
  const [subscribersData, setSubscribersData] = useState([]); //收藏者数据
  const [subcribersPage, setSubcribersPage] = useState(1);//收藏者数据
  const [hasMoreSubcribers, setHasMoreSubcribers]= useState(true);//是否还有更多收藏者数据
  const [subcribersTotalCount, setSubcribersTotalCount] = useState(0)


  /**
   * 评论数据
   */
  const [hotCommentData, setHotCommentData] = useState([]); //精彩评论数据
  const [comments, setComments] = useState([]); //最新评论数据
  const [commentPage, setCommentPage] = useState(1);//当前请求评论数据的页数, 用于计算offset
  const [hasMoreComments, setHasMoreComments] = useState(true);

  //事件---展开/收起歌单简介
  const changeDesExpand = () => {
    setDesExpand(!desExpand);
  };
  //事件--改变tab index, 切换标签 歌曲列表, 评论列表, 收藏列表
  const changeTabIndex = (event) => {
    if (event.target.id) {
      console.log(typeof event.target.id);
      let id = event.target.id;
      console.log(id);
      setTabIndex(id);
      
    }
  };

  /**
   * 歌单歌曲列表事件
   */

  //事件---歌单列表相关数据
  const getPlaylistDetail = async () => {
    // let id = "5472305020";
    let params = {
      id,
      offset: '100'
    };
    let data = await HTTPUtils.playlist_detail(params);
    setBasicData(data?.playlist);
    setSongsIdData(data?.playlist?.trackIds)
    setSubscribersData(data?.playlist?.subscribers);
    setSubcribersTotalCount(data.playlist?.subscribedCount)
  };
  //事件--双击歌曲播放歌曲
  const playSong = (data) => {
    let songs = props.songs;
    let activeSong = props.activeSong;
    let filterArr = songs.filter(item => item.id == data.id);
    //判断播放列表中是否有该歌曲
    let is_have_this_song = filterArr.length != 0;
    //是否与当前播放的歌曲是同一首
    let is_equal_active_song = data.id == activeSong.data?.id;
    if(!is_equal_active_song) {
      props.setActiveSong(data);
      if(!is_have_this_song) {
        //如果播放列表中没有当前播放的歌曲, 那么将该歌曲添加到播放列表
        props.addSong(data)
      }
    }
  }
  //获取所有歌曲详情
  const getSongsDetailDesc = async () => {
    let idStr = '';
    songsIdData.map((item, index) => {
      idStr = idStr == '' ? item.id : idStr + ',' + item.id
    })
    console.log('所有歌曲id');
    console.log(idStr);
    //id字符串是否为空, true: 不为空; false: 为空字符串, 即没有歌曲id
    let is_bool_idstr = (idStr instanceof String) && idStr.length > 0;
    if(!is_bool_idstr) {
      let params = {
        ids: idStr
      }
      let data = await HTTPUtils.song_detail(params);
      console.log('所有歌曲详细数据');
      console.log(data);
      setAllSongsData(data.songs)
      // props.addSong(data.songs)
      let start = pageSize * (currentPage - 1);
      let end = pageSize * (currentPage);
      let showSongsData = data.songs.slice(start, end);
      console.log(start);
      console.log(end);
      console.log(showSongsData);
      setSongsData(showSongsData)
    }
  }

  //当所有歌曲id数据变化, 并且所有歌单id数据的数量大于0时, 获取所有歌曲详细信息
  useEffect(() => {
    if(songsIdData.length > 0 && (songsIdData instanceof Array)) {
      getSongsDetailDesc();
    }
  }, [songsIdData])

  //事件--切换页数change
  const changeCurrentPage = (page) => {
    setCurrentPage(page)
  }

  //事件--切换每页显示数量
  const changePageSize = (current, size) => {
    console.log('change page size');
    console.log(current);
    console.log(size);
    setPageSize(size)
  }

  //依赖 页数/每页显示数量改变时, 需要改变歌单歌曲列表数据
  useEffect(() => {
    let start = pageSize * (currentPage - 1);
    let end = pageSize * currentPage;
    let showSongsData = allSongsData.slice(start, end);
    setSongsData(showSongsData);
    console.log('依赖 依赖');
    console.log(currentPage);
    console.log(pageSize);
    console.log(end);
    console.log(start);
  }, [currentPage, pageSize])


  /**
   * 事件---歌单评论相关事件
   */
  //歌单评论--header输入框输入change事件
  const commentValChange = (event) => {
    // console.log(val.)
    let val = event.target.value;
    // console.log(event.target.blur())
    setCommentVal(val);
  };
  //事件---提交评论
  const submitComment = (val) => {
    console.log('提交评论')
    console.log(val)
  }
  //歌单评论---header评论按钮事件
  const headerComment = () => {};

  //事件--歌单评论数据
  const getPlaylistComments = async () => {
    // let id = "5472305020";
    let params = {
      id,
      limit: 50,
      offset: (commentPage-1) * 50
    };
    if(!hasMoreComments) {
      //已经没有更多评论了, 不用再请求接口了
      return;
    }
    let data = await HTTPUtils.comment_playlist(params);
    if(data.hotComments) {
      setHotCommentData(data.hotComments);
    }
    let newComments = commentPage == 1 ? data.comments : comments.concat(data.comments);

    setComments(newComments);
    //追加完评论数据, 需要重新设置是否到达底部属性为false, 
    setArriveBottom(false)
    if(!(data.more)) {
      setHasMoreComments(false)
    }

  };

  //依赖 评论加载数据的页数, 每次变化, 都要重新追加评论数据
  useEffect(() => {
    if(tabIndex == 2) {
      getPlaylistComments();
    }
  }, [commentPage])

  //依赖 arriveBottom 是否到达底部; 单独拎出来一个中间属性, 因为闭包情况下 tab index 总是为1, 不会变化
  useEffect(() => {
    console.log('use effect arrive bottom');
    console.log(arriveBottom);
    if(arriveBottom) {
      if(tabIndex == 2) {
        //加载新的评论数据
        setCommentPage(commentPage+1)
      }else if(tabIndex == 3) {
        //加载新的收藏者数据
        setSubcribersPage(subcribersPage+1)
      }
    }
  }, [arriveBottom])


  /**
   * 防抖事件 处理滚动加载事件
   */
  //防抖事件
  const debounceHandleScroll = (func, timeDelay) => {
    let timer = null;
    return function() {
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
    if(playlistDetailRef.current) {
      console.log(tabIndex);
        //标签在评论列表
        let currentElem = playlistDetailRef.current;
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
          console.log('jjjjjj')
          console.log(commentPage);
          setArriveBottom(bottom => !bottom)
          
        }
    }
  }


  /**
   * 歌单收藏者系列事件
   */
  //获取歌单收藏者
  const getPlaylistSubcribers = async () => {
    let params = {
      id,
      offset: (subcribersPage-1) * 20
    }
    let data = await HTTPUtils.playlist_subscribers(params);
    console.log('获取歌单收藏者');
    console.log(data);
    if(!hasMoreSubcribers) {
      return;
    }
    let newSubscribersData = subcribersPage == 1 ? data.subscribers : subscribersData.concat(data.subscribers);
    setSubscribersData(newSubscribersData)
    setArriveBottom(false)
    if(!(data.more)) {
      setHasMoreSubcribers(false)
    }
  }
  //点击收藏者 进入收藏者个人中心
  const navigatePersonalCenter = (data) => {
    let id = data.userId;
    props.history.push('/personal/'+id)
  }

  //依赖 页数改变后, 需要加载新的收藏者数据
  useEffect(() => {
    getPlaylistSubcribers()
  }, [subcribersPage])

  useEffect(() => {
    console.log('收藏者总数是否改变');
    console.log(subcribersTotalCount);
  }, [subcribersTotalCount])


  //进入页面, useEffect事件--只调用一次
  useEffect(async () => {
    await getPlaylistDetail();
    await getPlaylistComments();
    await getPlaylistSubcribers();
    playlistDetailRef.current?.addEventListener('scroll', debounceHandleScroll(handleScroll, 300))
  }, []);
  

  //渲染--渲染歌单列表item
  const ListItem = ({ data, index }) => {
    index += 1;
    index = index < 10 ? "0" + index : index;
    let activeId = props.activeSong?.data?.id ? props.activeSong?.data?.id : null;
    return (
      <ul
        data-song={JSON.stringify(data)}
        className={`content-header fontsize18 is_song canSelectItem ${
          (index - 1) % 2 == 0 ? "backGray" : ""
        } ${activeId == data.id ? "activeListItem" : ""}` }
        tabIndex={index}
        onDoubleClick={() => playSong(data)}
      >
        <li className="content-header-item flex4">
          <ul className="item-flex">
            <li className="item-flex-item txtLightGray">{index}</li>
            <li className="item-flex-item">
              <img src={NoShoucangPng} className="img15" />
            </li>
            <li className="item-flex-item">
              <img src={DownloadPng} className="img15" />
            </li>
            <li className="item-flex-item">
              <p style={{ margin: 0, padding: 0 }}>{data?.name}</p>
            </li>
            <ul className="header-item-right">
              <li className="item-flex-item">
                <span className="txtRed borderRedColor">SQ</span>
              </li>
              <li className="item-flex-item ">
                <span className="txtRed borderRedColor clickItem">MV</span>
              </li>
              <li className="item-flex-item">
                <span className="txtRed borderRedColor">VIP</span>
              </li>
              <li className="item-flex-item">
                <span className="txtRed borderRedColor">试听</span>
              </li>
            </ul>
          </ul>
        </li>
        <li className={`content-header-item flex2 txtCenter ${activeId != data.id ? "txtLightGray" : ""}`}>
          {data?.ar.map((z, i) => {
            if (i == data?.ar.length - 1) {
              return z.name;
            }
            return z.name + "/";
          })}
        </li>
        <li className={`content-header-item flex2 txtCenter ${activeId != data.id ? "txtLightGray" : ""}`}>
          {data?.al?.name}
        </li>
        <li className={`content-header-item flex2 txtCenter ${activeId != data.id ? "txtLightGray" : ""}`}>{exchangeDuration(data.dt)}</li>
      </ul>
    );
  };
  //渲染---评论列表item
  const CommentItem = ({ data }) => {
    return (
      <div className="list-item">
        <div className="list-item-left" style={{ margin: "5px 0" }}>
          <img src={data.user.avatarUrl + "?param=50y50"} />
        </div>
        <ul className="list-item-right">
          <li style={{ margin: "5px 0" }}>
            {data.user.nickname}: {data.content}
          </li>
          {data.beReplied.length > 0 ? (
            <li
              className="list-item-reply"
            >
              {data.beReplied[0]?.user?.nickname}: {data.beReplied[0]?.content}
            </li>
          ) : null}
          <li className="list-item-date">
            <div>{exchangeTime(data.time)}</div>
            <div>
              <span className="tipoff marginHon10">举报</span>
              <img src={NoZanPng} className="commentImg marginHon10" />
              <span>{data.likedCount}</span>
              <img src={ShareRound} className="commentImg marginHon10" />
              <img src={CommentRoundPng} className="commentImg marginHon10" />
            </div>
          </li>
        </ul>
      </div>
    );
  };
  //渲染---收藏列表item
  const CollectionItem = ({ data }) => {
    return (
      <div className="collectin-item-container">
        <div className="collection-item">
          <img
            src={data?.avatarUrl + "?param=100y100"}
            className="collection-item-head-portrait marginHon5"
            onClick={() => navigatePersonalCenter(data)}
          />
          <p className="marginHon5 collection-item-name">{data?.nickname}</p>
          {data.gender == 1 ? (
            <img
              src={GenderMale}
              className="collection-item-gender marginHon5"
            />
          ) : null}
          {data.gender == 2 ? (
            <img
              src={GenderFemale}
              className="collection-item-gender marginHon5"
            />
          ) : null}
        </div>
      </div>
    );
  };

  //渲染--歌单详情主要内容
  const RenderContent = () => {
    switch (tabIndex) {
      case "1":
        return <Content />;
      case "2":
        return <Comment/>;
      case "3":
        return <Collection/>;
    }
  };
  //渲染--歌曲列表
  const Content = () => {
    return (
      <div className="content">
        <ul className="content-header">
          <li className="content-header-item txtCenter flex4 txtLightGray">
            音乐标题
          </li>
          <li className="content-header-item txtCenter flex2 txtLightGray">
            歌手
          </li>
          <li className="content-header-item txtCenter flex2 txtLightGray">
            专辑
          </li>
          <li className="content-header-item txtCenter flex2 txtLightGray">
            时长
          </li>
        </ul>
        {songsData.map((item, index) => {
          return <ListItem key={item.id} data={item} index={index} />;
        })}
        <Pagination total={allSongsData.length} showSizeChanger showQuickJumper current={currentPage} pageSize={pageSize} hideOnSinglePage onChange={changeCurrentPage} onShowSizeChange={changePageSize}></Pagination>
      </div>
    );
  };
  //评论页面
  const Comment = () => {
    return (
      <div className="comment">
        <MyTextarea comment={submitComment}/>
        <div className="comment-list">
          <p style={{ fontWeight: "bold", fontSize: 20 }}>精彩评论</p>
          <div>
            {hotCommentData.map((item, index) => {
              return <CommentItem key={item.commentId + index.toString()} data={item} />;
            })}
          </div>
          <p style={{ fontWeight: "bold", fontSize: 20 }}>最新评论</p>
          <div>
            {comments.map((item, index) => {
              return <CommentItem key={item.id+ index.toString()} data={item} />;
            })}
          </div>
        </div>
      </div>
    );
  };
  //收藏者页面
  const Collection = () => {
    return (
      <div className="collection">
        {subscribersData.map((item, index) => {
          return <CollectionItem key={item.userId + index.toString()} data={item} />;
        })}
      </div>
    );
  };

  /**
   * 事件
   */
  //重置歌曲列表数据为该歌单
  const addPlaylist = () => {
    console.log('reset');
    props.resetSongsData(allSongsData)
  }
  //事件--将歌单数据加入播放列表
  const addAllSongToPlaylist = (event) => {
    console.log('add all song');
    event.stopPropagation()
    props.addSong(allSongsData)
  }
  //事件--收藏/取消收藏歌单
  const subcribePlaylist = async () => {
    let params = {
      t: 1,
      id,
    }
    let data = await HTTPUtils.playlist_subscribe(params)
    console.log('收藏歌单');
    console.log(data);
  }

  //歌单详情页面
  return (
    <div className="playlist-detail" ref={playlistDetailRef}>
      <div className="playlist-detail-header">
        <div className="header-left headerPadding5">
          <img
            className="header-left-img border-radius-20"
            src={basicData.coverImgUrl}
          />
        </div>
        <div className="header-right">
          <div className="headerPadding5 header-right-row lineheight40">
            <span
              className="border-text headerPadding5"
              style={{ borderRadius: 5 }}
            >
              歌单
            </span>
            <span className="playlist-name headerPadding5">
              {basicData.name}
            </span>
          </div>
          <div className="headerPadding5 header-right-row lineheight40">
            <img
              src={basicData.creator?.avatarUrl}
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
            <span className="headerPadding5">
              {basicData.creator?.nickname}
            </span>
            <span className="headerPadding5">
              {exchangeTime(basicData.createTime, 1)}创建
            </span>
          </div>
          <div className="headerPadding5 header-right-row ">
            <button className="defineBtn border-radius-20 headerPadding5 bkCommonColor marginVer5 whiteCol" onClick={addPlaylist}>
              <img src={PlayPng} className="img25 marginHon5" />
              <span className="height25Vertical padding5">播放全部</span>
              <img src={AddWhitePng} className="img25 marginHon5" onClick={(event) => addAllSongToPlaylist(event)}/>
            </button>
            <button className="defineBtn border-radius-20 headerPadding5 marginVer " onClick={subcribePlaylist}>
              <img src={SubPng} className="img25 " />
              <span className="height25Vertical padding5">
                收藏({subcribersTotalCount})
              </span>
            </button>
            <button className="defineBtn border-radius-20 headerPadding5 marginVer">
              <img src={SharePng} className="img25 " />
              <span className="height25Vertical padding5">
                分享({basicData.shareCount})
              </span>
            </button>
            <button className="defineBtn border-radius-20 headerPadding5 marginVer">
              <img src={DownloadPng} className="img25 " />
              <span className="height25Vertical padding5">下载全部</span>
            </button>
          </div>
          <div className="headerPadding5 header-right-row lineheight50 fongsize20">
            <span>标签:</span>
            <span style={{ padding: "0 10px" }}>
              {basicData.tags?.map((item, index) => {
                return (
                  <span key={index} style={{ padding: "0 5px" }}>
                    {index == basicData.tags?.length - 1
                      ? item
                      : item + " " + "/"}
                  </span>
                );
              })}
            </span>
          </div>
          <div className="headerPadding5 header-right-row lineheight50 fongsize20">
            <span>歌曲数目: {basicData.trackCount}首</span>
            <span className="marginHon10">
              播放量: {parseInt(basicData.playCount / 10000)}万
            </span>
          </div>
          <div className="headerPadding5 header-right-row playlist-des">
            <span
              style={{
                display: "inline-block",
                height: !desExpand ? 20 : "auto",
                overflow: "hidden",
                width: "90%",
              }}
            >
              {basicData.description}
            </span>
            <span
              style={{
                position: "absolute",
                right: 10,
                top: 5,
                display: "inline-block",
                width: 60,
                textAlign: "center",
              }}
              onClick={changeDesExpand}
            >
              <img src={!desExpand ? DownPng : UpPng} className="img15" />
            </span>
          </div>
        </div>
      </div>
      <div className="playlist-detail-content">
        <ul className="tabs" onClick={changeTabIndex}>
          <li
            id="1"
            className={`tab ${tabIndex === "1" ? "tab-active" : null}`}
          >
            歌曲列表
          </li>
          <li
            id="2"
            className={`tab ${tabIndex === "2" ? "tab-active" : null}`}
          >
            评论({basicData.commentCount})
          </li>
          <li
            id="3"
            className={`tab ${tabIndex === "3" ? "tab-active" : null}`}
          >
            收藏者
          </li>
        </ul>
        <RenderContent />
        {/* <Comment/> */}
        
      </div>
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
    addSong: (data) => {
      dispatch(addToPlaylist(data));
    },
    deleteSong: (data) => {
      dispatch(deleteSong(data))
    },
    deleteAllSongs: () => {
      dispatch(deleteAllSongs())
    },
    resetSongsData: data => {
      //重新赋值播放列表
      dispatch(setSongs(data))
    },
    setActiveSong: data => {
      dispatch(setActive(data))
    }
  }
}

const playlistDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaylistDetail)

export default withRouter(playlistDetailContainer)
// export default withRouter(PlaylistDetail)
