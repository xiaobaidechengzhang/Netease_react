import React, { useState, useEffect,  } from "react";
import { Input } from 'antd'
import { useParams } from 'react-router-dom'
import "./PlaylistDetail.less";
import HTTPUtils from "../../../HTTPUtils/HTTPUtils";
import { exchangeTime } from "@/Utils";
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
import { withRouter } from "react-router";

function PlaylistDetail(props) {
  //歌单id: 6781111608
  const {id} = useParams()
  //数据---歌单简介-展开与收齐(boolean);
  const [desExpand, setDesExpand] = useState(false);
  //数据---歌单详情--评论--评论输入框val
  const [commentVal, setCommentVal] = useState("");
  //数据---歌单tab index  1:歌曲列表; 2: 评论列表; 3: 收藏列表
  const [tabIndex, setTabIndex] = useState("1");
  const [basicData, setBasicData] = useState({}); //歌单基本信息(封面, 描述, 创建者etc)
  const [songsData, setSongsData] = useState([]); //获取歌单中的歌曲列表
  const [subscribersData, setSubscriberData] = useState([]); //收藏者数据
  const [hotCommentData, setHotCommentData] = useState([]); //精彩评论数据
  const [comments, setComments] = useState([]); //最新评论数据

  //事件---展开/收起歌单简介
  const changeDesExpand = () => {
    setDesExpand(!desExpand);
  };

  //事件---歌单列表相关数据
  const getPlaylistDetail = async () => {
    // let id = "5472305020";
    let params = {
      id,
      offset: '100'
    };
    let data = await HTTPUtils.playlist_detail(params);
    setBasicData(data?.playlist);
    setSongsData(data?.playlist?.tracks);
    setSubscriberData(data?.playlist?.subscribers);
  };
  //事件--歌单评论数据
  const getPlaylistComments = async () => {
    // let id = "5472305020";
    let params = {
      id,
    };
    let data = await HTTPUtils.comment_playlist(params);
    setHotCommentData(data.hotComments);
    setComments(data.comments);
  };
  //事件--改变tab index, 切换标签 歌曲列表, 评论列表, 收藏列表
  const changeTabIndex = (event) => {
    console.log(module);
    if (event.target.id) {
      console.log(typeof event.target.id);
      let id = event.target.id;
      setTabIndex(id);
    }
  };

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

  //进入页面, useEffect事件--只调用一次
  useEffect(async () => {
    console.log(exchangeTime(1621262717313));
    console.log('传过来id')
    console.log(id)
    await getPlaylistDetail();
    await getPlaylistComments();
  }, []);

  //渲染--渲染歌单列表item
  const ListItem = ({ data, index }) => {
    index += 1;
    index = index < 10 ? "0" + index : index;
    return (
      <ul
        className={`content-header fontsize18 canSelectItem ${
          (index - 1) % 2 == 0 ? "backGray" : ""
        }`}
        tabIndex={index}
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
        <li className="content-header-item flex2 txtCenter txtLightGray">
          {data?.ar.map((z, i) => {
            if (i == data?.ar.length - 1) {
              return z.name;
            }
            return z.name + "/";
          })}
        </li>
        <li className="content-header-item flex2 txtCenter txtLightGray">
          {data?.al?.name}
        </li>
        <li className="content-header-item flex2 txtCenter txtLightGray">44</li>
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
              style={{
                padding: "5px 10px",
                backgroundColor: "lightgray",
                borderRadius: 10,
                margin: "5px 0",
              }}
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
          />
          <p className="marginHon5">{data?.nickname}</p>
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
              return <CommentItem key={item.commentId} data={item} />;
            })}
          </div>
          <p style={{ fontWeight: "bold", fontSize: 20 }}>最新评论</p>
          <div>
            {comments.map((item, index) => {
              return <CommentItem key={item.id} data={item} />;
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
          return <CollectionItem key={item.userId} data={item} />;
        })}
      </div>
    );
  };
  //歌单详情页面
  return (
    <div className="playlist-detail">
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
            <button className="defineBtn border-radius-20 headerPadding5 bkCommonColor marginVer5 whiteCol">
              <img src={PlayPng} className="img25 marginHon5" />
              <span className="height25Vertical padding5">播放全部</span>
              <img src={AddWhitePng} className="img25 marginHon5" />
            </button>
            <button className="defineBtn border-radius-20 headerPadding5 marginVer ">
              <img src={SubPng} className="img25 " />
              <span className="height25Vertical padding5">
                收藏({subscribersData?.length})
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

export default withRouter(PlaylistDetail)
