import React, { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { Cookies } from "../../Utils";
import "./Test.less";
import HTTPUtils from "../../HTTPUtils/HTTPUtils";
import SubPng from "@/images/NewestSong/sub.png";
import NoShoucangPng from "@/images/Playlist/noshoucang.png";
import DownloadPng from "@/images/Playlist/download.png";
import PlayPng from "@/images/Playlist/play.png";
import PlayNoActivePng from "@/images/music/play-no-active.png";
import PicListNoActivePng from "@/images/AritstDetail/pic-list-no-active.png";
import PicListActivePng from "@/images/AritstDetail/pic-list-active.png";
import PicNoActivePng from "@/images/AritstDetail/pic-no-active.png";
import PicActivePng from "@/images/AritstDetail/pic-active.png";
import ListNoActivePng from "@/images/AritstDetail/list-no-active.png";
import ListActivePng from "@/images/AritstDetail/list-active.png";
import DownPng from "@/images/Playlist/down.png";
import UpPng from "@/images/Playlist/up.png";
import GenderMail from "@/images/Playlist/gender-male.png";
import GenderFemale from "@/images/Playlist/gender-female.png";
import AddWhite from "@/images/Playlist/addWhite.png";
import { withRouter } from "react-router";

const { exchangeTime, exchagneDuration } = require("@/Utils/ExchangeTime");

function Test(props) {
  //用户id, 创建时间信息
  const [account, setAccount] = useState({});
  //用户详细信息
  const [profile, setProfile] = useState({});
  //用户等级信息
  const [userLV, setUserLV] = useState({});
  //用户各种收藏信息
  const [userSubs, setUserSubs] = useState({});
  //用户关注列表总数
  const [userFollowsCount, setUserFollowsCount] = useState(0);
  //用户关注列表数据
  const [userFollowsData, setUserFollowsData] = useState([]);
  //用户粉丝列表总数
  const [userFollowedsCount, setUserFollowedsCount] = useState(0);
  //用户粉丝列表数据
  const [userFollowedsData, setUserFollowedsData] = useState([]);
  //用户动态列表总数
  const [userEventCount, setUserEventCount] = useState(0);
  //用户动态列表数
  const [userEvents, setUserEvents] = useState([]);
  //用户创建的歌单
  const [userCreatePlaylists, setUserCreatePlaylists] = useState([]);
  //用户收藏的歌单
  const [userSubPlaylists, setUserSubPlaylists] = useState([]);

  //获取用户账户信息
  const getUserAccount = async () => {
    let data = await HTTPUtils.user_account();
    setAccount(data.account);
    setProfile(data.profile);
  };
  //获取用户等级
  const getUserLV = async () => {
    let data = await HTTPUtils.user_level();
    setUserLV(data.data);
  };
  //获取用户信息, 歌单, 收藏, mv, dj数量
  const getUserSubcount = async () => {
    let data = await HTTPUtils.user_subcount();
    setUserSubs(data);
  };
  //获取用户关注列表
  const getUserFollows = async () => {
    if (!profile.userId) {
      return false;
    }
    let params = {
      uid: profile.userId,
    };
    let data = await HTTPUtils.user_follows(params);
    setUserFollowsCount(data.follow?.length || 0);
    setUserFollowsData(data.follow);
  };
  //获取用户粉丝列表
  const getUserFolloweds = async () => {
    if (!profile.userId) {
      return false;
    }
    let params = {
      uid: profile.userId,
    };
    let data = await HTTPUtils.user_followeds(params);
    setUserFollowedsCount(data.size);
    setUserFollowedsData(data.followeds);
  };
  //获取用户动态列表
  const getUserEvent = async () => {
    if (!profile.userId) {
      return false;
    }
    let params = {
      uid: profile.userId,
    };
    let data = await HTTPUtils.user_event(params);
    setUserEventCount(data.size);
  };
  //获取用户歌单
  const getUserPlaylists = async () => {
    if (!profile.userId) {
      return false;
    }
    let params = {
      uid: profile.userId,
    };
    let data = await HTTPUtils.user_playlist(params);
    let createPlaylists = data.playlist.filter(
      (item) => item.subscribed == false
    );
    let subPlaylists = data.playlist.filter((item) => item.subscribed == true);
    setUserCreatePlaylists(createPlaylists);
    setUserSubPlaylists(subPlaylists);
  };
  //上传图片
  const headerPictureChange = async (props) => {
    console.log('图片')
    console.log(props)
    let file = props.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let url = e.target.result;
      let profileCopy = JSON.parse(JSON.stringify(profile));
      profileCopy.avatarUrl = url;
      setProfile(profileCopy)
    }
    fileReader.readAsDataURL(file)
  }
  //关注/取消关注
  const followsUser = async (userId, followed) => {
    let params = {
      userId,
    };
    params.t = followed ? 0 : 1;
    let data = await HTTPUtils.follow(params);
  };
  //事件--进入歌单详情
  const navigateDetail = (item) => {
    props.history.push('/playlist/'+item.id)
  }
  //事件--进入个人中心
  const navigatePersonalCenter = (item) => {
    console.log(item)
    props.history.push('/personal/'+item.userId)
  }
  //粉丝列表/关注列表item
  const FocusListItem = ({ data }) => {
    return (
      <div className="focus-list-item" onClick={() => navigatePersonalCenter(data)}>
        <div className="focus-list-item-image-con">
          <img
            src={data.avatarUrl + "?param=120y120"}
            alt="http://p2.music.126.net/vkAMXteRw5GHV0VNFoNxrA==/109951164751196732.jpg?param=120y120"
            className="focus-list-item-image"
          />
        </div>
        <div className="focus-list-item-detail">
          <ul className="focus-list-name-gender">
            <li>{data.nickname}</li>
            <li>
              <img
                src={data.gender == "0" ? GenderFemale : GenderMail}
                style={{
                  width: 30,
                  height: 30,
                  objectFit: "cover",
                  marginLeft: 10,
                }}
              />
            </li>
          </ul>
          <ul className="focus-list-all-count">
            <li>动态 {data.eventCount}</li>
            <li>关注 {data.follows}</li>
            <li>粉丝 {data.followeds}</li>
          </ul>
          <p className="focus-list-desc">{data.signature}</p>
        </div>
        <div className="focus-list-item-btn">
          <div className="btn-container">
            <button
              className="btn-define"
              onClick={() => followsUser(data.userId, data.followed)}
            >
              <div
                style={{
                  display: "inline-block",
                  height: "100%",
                  lineHeight: "40px",
                }}
              >
                <span style={{ float: "left" }}>
                  <img
                    src={AddWhite}
                    style={{
                      width: 30,
                      height: 30,
                      objectFit: "cover",
                    }}
                  />
                </span>
                <span style={{ float: "left" }}>
                  {data.followed ? "已关注" : "关注"}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };
  //歌单列表item
  const PlaylistItem = ({ data }) => {
    return (
      <div className="my-create-playlist-item" onClick={() => navigateDetail(data)}>
        <div>
          <div className="my-create-playlist-item-main">
            <img
              src={data.coverImgUrl + "?param=250y250"}
              alt="http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg?param=250y250"
              className="item-main-image"
            />
            <ul className="item-main-desc-row">
              <li className="item-main-desc-count">{data.playCount}</li>
              <li className="item-main-desc-play">
                <img
                  src={PlayNoActivePng}
                  style={{
                    width: 15,
                    height: 15,
                    objectFit: "cover",
                  }}
                />
              </li>
            </ul>
          </div>
        </div>
        <p className="my-create-playlist-item-name">{data.name}</p>
      </div>
    );
  };
  //有了用户信息后, 获取用户的动态, 关注, 粉丝
  useEffect(async () => {
    await getUserEvent();
    await getUserFollows();
    await getUserFolloweds();
    await getUserPlaylists();
  }, [profile]);
  useEffect(async () => {
    await getUserAccount();
    await getUserLV();
    await getUserSubcount();
  }, []);
  return (
    <div className="personal-center">
      <div className="personal-center-header">
        <div className="header-head-picture">
          <img
            src={profile.avatarUrl}
            // src={profile.avatarUrl + "?param=180y180"}
            alt="http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg?param=180y180"
            className="head-picture-img"
          />
          <div className='header-head-hover'>
            <input type='file' onChange={headerPictureChange}/>
          </div>
        </div>
        <div className="header-detail-desc">
          <div className="header-desc-name-lv">
            <span className="desc-name">{profile.nickname}</span>
            <span className="desc-lv">LV.{userLV.level}</span>
            <span className="desc-edit">编辑个人资料</span>
          </div>
          <ul className="header-desc-all-count">
            <li className="all-count-item">
              <p className="all-count-item-num">{userEventCount}</p>
              <p className="all-count-item-cat">动态</p>
            </li>
            <li className="all-count-item">
              <p className="all-count-item-num">{userFollowsCount}</p>
              <p className="all-count-item-cat">关注</p>
            </li>
            <li className="all-count-item">
              <p className="all-count-item-num">{userFollowedsCount}</p>
              <p className="all-count-item-cat">粉丝</p>
            </li>
          </ul>
          <p className="header-desc-region">所在地区: 河北石家庄市</p>
        </div>
      </div>
      <div className="listen-rank">
        <ul className="listen-rank-header">
          <li className="listen-rank-header-item">
            <span className="fontsize20">听歌排行</span>
            <span style={{ marginLeft: 10 }}>累计听歌20首</span>
          </li>
          <li className="listen-rank-header-item header-right-item">
            <span
              className="right-item-active"
              style={{
                marginRight: 10,
                padding: "0 10px",
                borderRight: "1px solid #aaa",
              }}
            >
              最近一周
            </span>
            <span className="right-item-active">所有时间</span>
          </li>
        </ul>
        <div className="listen-rank-list">
          {[1, 2, 3, 4, 5].map((item, index) => {
            return (
              <ul className="listen-rank-list-row" key={index}>
                <li className="listen-rank-list-item flex3">
                  <ul>
                    <li className="listen-rank-list-item">
                      {index < 10 ? "0" + (index + 1) : index}
                    </li>
                    <li className="listen-rank-list-item marginHon10">
                      <img
                        src={PlayNoActivePng}
                        style={{ width: 15, height: 15, objectFit: "cover" }}
                      />
                    </li>
                    <li className="listen-rank-list-item marginHon10 boldTxt">
                      不只是想你
                    </li>
                    <li className="listen-rank-list-item marginHon10">梦然</li>
                  </ul>
                </li>
                <li
                  className="listen-rank-list-item flex1"
                  style={{ borderRadius: 5, position: "relative" }}
                >
                  <div className="bgblue" style={{ height: "100%" }}></div>
                  <span className="list-item-count">6次</span>
                </li>
              </ul>
            );
          })}
        </div>
        <p className="list-rank-look-all">查看全部>></p>
        <div>
          <p className="playlist-title">
            我创建的歌单
            {userSubs.createdPlaylistCount && userSubs.createdPlaylistCount > 0
              ? `(${userSubs.createdPlaylistCount})`
              : null}
          </p>
          <div className="my-create-playlist">
            {userCreatePlaylists.length > 0 &&
              userCreatePlaylists.map((item, index) => {
                return (
                  <PlaylistItem key={item.id} data={item}/>
                );
              })}
          </div>
        </div>
        <div>
          <p className="playlist-title">
            我收藏的歌单
            {userSubs.subPlaylistCount && userSubs.subPlaylistCount > 0
              ? `(${userSubs.subPlaylistCount})`
              : null}
          </p>
          <div className="my-create-playlist">
            {userSubPlaylists.length > 0 &&
              userSubPlaylists.map((item, index) => {
                return <PlaylistItem key={item.id} data={item} />;
              })}
          </div>
        </div>
        <div>
          <p className="playlist-title">关注列表</p>
          <div className="focus-list">
            {userFollowsData &&
              userFollowsData.map((item, index) => {
                return <FocusListItem key={item.userId} data={item} />;
              })}
          </div>
        </div>
        <div>
          <p className="playlist-title">粉丝列表</p>
          <div className="focus-list">
            {userFollowedsData &&
              userFollowedsData.map((item, index) => {
                return <FocusListItem key={item.userId} data={item} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Test)