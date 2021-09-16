import React, { useState, useEffect, useRef } from 'react';
import VideoSlider from '../../VideoSlider/VideoSlider';
import MyTextarea from '../Playlist/PlaylistDetail/MyTextarea';
import './MVDetail.less'
import { exchangeDuration, exchangeTime } from '../../Utils';
import { Button } from 'antd';

//图片资源
import NoZanPng from "@/images/Playlist/no-zan.png";
import ShareRound from "@/images/Playlist/share-round.png";
import CommentRoundPng from "@/images/Playlist/comment-round.png";
import HTTPUtils from '../../HTTPUtils/HTTPUtils';
import { useParams } from 'react-router';

export default function MVDetail(props) {

  //页面ref
  const mvDetailRef = useRef();
  /**
   * MV相关数据
   */
  //传过来的id
  const { id } = useParams()
  //MV详情数据
  const [mvDetailData, setMVDetailData] = useState({})
  //mv播放地址
  const [mvURL, setMVURL] = useState('')


  /**
   * 评论相关数据
   */
  //热门评论数据
  const [hotCommentData, setHotCommentData] = useState([]);
  //评论数据
  const [comments, setComments] = useState([])
  //页面是否到达底部
  const [arriveBottom, setArriveBottom] = useState(false);
  //评论每页数量
  const [commentLimit, setCommentLimit] = useState(50);
  //评论页数
  const [commentPage, setCommentPage] = useState(1);
  //是否还有更多评论数据
  const [isHasMoreComment, setIsHasMoreComment] = useState(true);




  //获取MV数据-基本信息
  const getMVData = async () => {
    let params = {
      mvid: id,
    }
    let data = await HTTPUtils.mv_detail(params);
    console.log('mv 数据');
    console.log(data);
    setMVDetailData(data.data)
  }

  //获取MV播放地址
  const getMVURL = async () => {
    let params = {
      id: id
    }
    let data = await HTTPUtils.mv_url(params);
    console.log('mv 播放地址');
    console.log(data);
    setMVURL(data.data?.url || '');
  }


  const getSuggestMV = async () => {
    let data = await HTTPUtils.personalized_mv();
    console.log('推荐MV');
    console.log(data);
  }

  /**
   * 防抖事件 处理滚动加载事件
   */
  //防抖事件
  const debounceHandleScroll = (func, timeDelay) => {
    let timer = null;
    return function () {
      console.log('scjjjjjjjjjjjjjjjjjjjjj');
      if (timer) {
        return;
      }
      timer = setTimeout(() => {
        func();
        timer = null;
      }, timeDelay)
    }
  }

  //事件-- 处理滚动事件
  const handleScroll = () => {
    if (mvDetailRef.current) {
      //标签在评论列表
      let currentElem = mvDetailRef.current;
      //整个页面的滚动高度-即实际高度
      let scrollHeight = currentElem.scrollHeight;
      //整个页面已滚动的高度
      let scrollTop = currentElem.scrollTop;
      //整个页面的可视高度
      const { height } = currentElem.getBoundingClientRect();
      let scroll_to_bottom_distance = scrollHeight - scrollTop - height;
      console.log(scroll_to_bottom_distance);
      if (scroll_to_bottom_distance < 100) {
        //当距离底部还有100px的时候, 执行加载评论操作
        console.log('已经到达底部');
        setArriveBottom(bottom => !bottom)

      }
    }
  }

  useEffect(() => {
    getMVData();
    getMVComments()
    getMVURL();
    getSuggestMV()
  }, [props.id])

  //页面加载一次
  useEffect(() => {
    //id: id
    getMVData();
    getMVComments()
    getMVURL();
    getSuggestMV()
    mvDetailRef.current?.addEventListener('scroll', debounceHandleScroll(handleScroll, 300))
  }, [])


  /**
   * 评论组件和事件
   */

  //依赖 arriveBottom, 是否到达底部, 到达底部获取更多评论数据
  useEffect(() => {
    setCommentPage(commentPage + 1);
  }, [arriveBottom])

  //依赖commentPage 评论当前页数, 变化时, 需要加载更多评论数据
  useEffect(() => {
    getMVComments();
  }, [commentPage])

  //获取mv点赞/收藏/评论数据
  const getMVComments = async () => {
    let params = {
      id: id,
      limit: commentLimit,
      offset: (commentPage - 1) * commentLimit
    }
    if (!isHasMoreComment) {
      return;
    }
    let data = await HTTPUtils.comment_mv(params);
    if (commentPage == 1) {
      setComments(data.comments)
      setHotCommentData(data.hotComments)
    } else {
      setComments(comments.concat(data.comments))
    }
    if (!data.more) {
      setIsHasMoreComment(false)
    }
  }

  //评论页面
  const Comment = () => {
    return (
      <div className="comment">
        <MyTextarea comment={submitComment} />
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
              return <CommentItem key={item.id + index.toString()} data={item} />;
            })}
          </div>
        </div>
      </div>
    );
  };

  //评论item
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

  //事件---提交评论
  const submitComment = (val) => {
    console.log('提交评论')
    console.log(val)
  }


  return (
    <div ref={mvDetailRef} className='mvDetail'>
      <div className='mvDetailContainer'>
        <div className='mvAndSuggest'>
          <div className="mvContainer">
            <VideoSlider path={mvURL} basicInfo={mvDetailData}/>
            <div className='mvArtistInfo'>
              <img src={(mvDetailData.artists && mvDetailData.artists[0]?.img1v1Url) || ''} className="mvArtistInfoImg" />
              <p>{mvDetailData.artistName || '无名氏'}</p>
            </div>
            <p className='mvName'>{mvDetailData.name || ''}</p>
            <p className='mvTime'><span>发布: {mvDetailData.publishTime || '2021-08-31'}</span><span>播放: {mvDetailData.playCount || 0}</span></p>
            <ul className="mvDetailActions">
              <li className='mvDetailAction'><Button type='text'>点赞</Button></li>
              <li className='mvDetailAction'><Button type='text'>收藏{mvDetailData.subCount || 999}</Button></li>
              <li className='mvDetailAction'><Button type='text'>分享{mvDetailData.shareCount || 999}</Button></li>
              <li className='mvDetailAction'><Button type='text'>下载MV</Button></li>
            </ul>
          </div>
        </div>
        <Comment />
      </div>
    </div>
  )
}

/**
 * <div className="suggestMVContainer">
          <p style={{height: 30, lineHeight: '30px', fontWeight: 'bold', fontSize: 18}}>相关推荐</p>
          <ul className="suggestMVList">
            {
              [1, 2, 3, 4, 5, 6].map((item, index) => {
                return (
                  <li className="suggestMVListItem" key={index}>
                    <div style={{height: '100%'}}>
                      <div className="toplistItem">
                        <img className="toplistItemImg" src='https://p1.music.126.net/r07w1BhVrVI1pKaPsS0nbQ==/109951166365255547.jpg?param=200y200' />
                        <div className="toplistItemRight"> */
/* <span>{Math.floor(item.playCount / 10000) + '万'}</span> */
        //                   <span>5万</span>
        //                 </div>
        //                 <div className="toplistItemCenter">
        //                   <img className="toplistItemCenterImg" />
        //                 </div>
        //               </div>
        //               <div className='listItemDesc'>
        //                 <p>岁末特别企划 EP04房东的猫X于翔北：不曾长大 重逢童年</p>
        //                 <p>by 小怪兽</p>
        //               </div>
        //             </div>
        //           </li>
        //         )
        //       })
        //     }
        //   </ul>
        // </div>
