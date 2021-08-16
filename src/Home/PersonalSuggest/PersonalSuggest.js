import React, { useState, useEffect, useRef } from "react";
import { Input, message, Button, Slider } from "antd";
import HTTPUtils from "../../HTTPUtils/HTTPUtils";
import "./PersonalSuggest.less";
import PlayImg from "../../images/music/play-active.png";
import Carousel from "../../widgets/Carousel/Carousel";
/**
 *
 *
 * @export
 * @param {*} props
 * @return {*}
 */
export default function PersonalSuggest(props) {
  const [songsData, setSongsData] = useState([]); //推荐音乐
  const [perPlaylists, setPerPlaylists] = useState([]); //推荐歌单数据
  const [videoGroupList, setVideoGroupList] = useState([]); //视频标签列表数据
  const [selGroupID, setSelGroupID] = useState("0"); //选中的视频标签item ID
  const [isSpreadGroupList, setIsSpreadGroupList] = useState(false); //是否展开视频标签列表
  const [perMV, setPerMV] = useState([]); //获取推荐MV数据
  const [allMV, setAllMV] = useState([]); //获取全部MV数据
  const [newMV, setNewMV] = useState([]); //获取最新MV
  const [priContent, setPricontent] = useState([]); //独家放送
  const [priContentList, setPricontentList] = useState([]); //独家放送列表
  const [bannerData, setBannerData] = useState([]); //轮播图数据

  /**
   * 获取推荐歌曲
   * @returns
   */
  const getPersonlizedSongs = async () => {
    let data = await HTTPUtils.personalized_newsong();
    setSongsData(data.result);
  };
  /**
   * 获取推荐歌单
   * @param {limit: 获取数量, 默认30} obj
   */
  const getPersonlizedPlaylists = async (obj) => {
    let data = await HTTPUtils.personalized(obj);
    setPerPlaylists(data.result);
  };
  const getPersonlizedMV = async () => {
    let data = await HTTPUtils.personalized_mv();
    console.log(data);
    setPerMV(data.result);
  };
  /**
   * 获取独家放送列表
   */
  const getPersonlizedPrivatecontent = async () => {
    let data = await HTTPUtils.personalized_privatecontent();
    console.log("独家放送1111");
    console.log(data);
    setPricontent(data.result);
  };
  /**
   * 获取所有独家放送列表
   */
  const getPersonlizedPrivatecontentList = async () => {
    let obj = {
      limit: 19,
    };
    let data = await HTTPUtils.personalized_privatecontent_list(obj);
    console.log("独家放送列表2222");
    console.log(data);
    setPricontentList(data.result);
  };
  const getBanner = async () => {
    let obj = {
      type: 0,
    };
    let data = await HTTPUtils.banner(obj);
    console.log(data);
    if (data.code != 200) {
      message.error(data.msg || "轮播图数据出错");
      return;
    }
    let list = data.banners;
    list.length = 3;
    console.log(list);
    setBannerData(list);
  };
  /**
   * 页面加载时, 获取推荐系列数据, 只执行一次----------------------------------------|
   */
  useEffect(async () => {
    await getPersonlizedSongs();
    let obj = {
      limit: 12,
    };
    await getPersonlizedPlaylists(obj);
    await getVideoCatList();
    await getplaylistCatlist();
    await getPlaylistCat();
    await getPersonlizedPrivatecontent();
    await getPersonlizedPrivatecontentList();
    await getBanner();
    await getPersonlizedMV();
  }, []);
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
    await getVideoGroup(item.id);
  };
  //事件---展开/关闭视频标签列表
  const changeGroupListHeight = () => {
    setIsSpreadGroupList(!isSpreadGroupList);
  };
  //接口---获取相应视频标签下视频列表
  const getVideoGroup = async (id) => {
    if (id == 0) {
      return;
    }
    let obj = {
      id: id,
    };
    console.log("id id id");
    console.log(id);
    let data = await HTTPUtils.video_group(obj);
    console.log("视频");
    console.log(data);
    // let data = await HTTPUtils.video_timeline_all();
  };

  /**
   * 歌单系列接口--------------------------------------------||
   */
  /**
   * 获取歌单分类列表
   */
  const getplaylistCatlist = async () => {
    let data = await HTTPUtils.playlist_catlist();
    console.log(data);
  };
  const getPlaylistCat = async (obj) => {
    let bb = {
      cat: "古风",
      limit: 10,
    };
    let data = await HTTPUtils.top_playlist(bb);
    console.log(data);
  };
  return (
    <div>
      <div>personalsuggest</div>
      <Carousel data={bannerData} />
      <div style={{ display: "flex", flexDirection: "row", margin: "50px 0" }}>
        <div style={{ flex: 1 }}>
          <div className="headerTitle">
            <p className="headerTitleContent">最新音乐</p>
          </div>
          <div style={{ flex: 1 }}>
            {songsData.map((item, index) => {
              return (
                <div
                  className={`personSongsItem 
                                ${index == 0 && "firstImg"}
                                ${index == 1 && "secImg"}
                                ${index == 2 && "thirdImg"}
                            `}
                  key={item.id}
                >
                  <p style={{ width: 50 }}>{index}</p>
                  <img src={item.picUrl + "?param=200y200"} />
                  <div>
                    {item.name +
                      " " +
                      "-" +
                      " " +
                      item.song.album.artists[0].name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="headerTitle">
            <p className="headerTitleContent">推荐歌单</p>
          </div>
          <div className="playlist_suggest">
            {perPlaylists.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="playlistItem min30PlaylistItem"
                  // onMouseOver={() => playlistOver(item.id, 1)}
                  // onMouseOut={() => playlistOver(item.id, 2)}
                >
                  <div className="playlistItemContent">
                    <img
                      className="playlistItemContentImg"
                      src={item.picUrl + "?param=200y200"}
                    />
                    <div className="playlistItemContentImgCon">
                      <img src={PlayImg} />
                    </div>
                  </div>
                  <p className="playlistItemDes">{item.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="headerTitle">
        <p className="headerTitleContent">视频标签列表</p>
      </div>
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
                                    ${
                                      item.id == selGroupID
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
      <div className="headerTitle">
        <p className="headerTitleContent">独家放送</p>
      </div>
      <div className="playlist">
        {priContent.map((item, index) => {
          return (
            <div
              key={item.id}
              className="playlistItem min30PlaylistItem"
              // onMouseOver={() => playlistOver(item.id, 1)}
              // onMouseOut={() => playlistOver(item.id, 2)}
            >
              <div className="playlistItemContent">
                <img
                  className="playlistItemContentImg"
                  src={item.picUrl + "?param=200y200"}
                />
                <div className="playlistItemContentImgCon">
                  <img src={PlayImg} />
                </div>
              </div>
              <p className="playlistItemDes">{item.name}</p>
            </div>
          );
        })}
      </div>
      <div className="headerTitle">
        <p className="headerTitleContent">独家放送列表</p>
      </div>
      <div className="playlist">
        {priContentList.map((item, index) => {
          return (
            <div
              key={item.id}
              className="playlistItem min30PlaylistItem"
              // onMouseOver={() => playlistOver(item.id, 1)}
              // onMouseOut={() => playlistOver(item.id, 2)}
            >
              <div className="playlistItemContent">
                <img
                  className="playlistItemContentImg"
                  src={item.picUrl + "?param=200y200"}
                />
                <div className="playlistItemContentImgCon">
                  <img src={PlayImg} />
                </div>
              </div>
              <p className="playlistItemDes">{item.name}</p>
            </div>
          );
        })}
      </div>
      <div className="headerTitle">
        <p className="headerTitleContent">推荐MV</p>
      </div>
      <div className="playlist">
        {perMV.map((item, index) => {
          return (
            <div
              key={item.id}
              className="playlistItem min20PlaylistItem"
              // onMouseOver={() => playlistOver(item.id, 1)}
              // onMouseOut={() => playlistOver(item.id, 2)}
            >
              <div className="playlistItemContent">
                <img
                  className="playlistItemContentImg"
                  src={item.picUrl + "?param=200y200"}
                />
                <div className="playlistItemContentImgCon">
                  <img src={PlayImg} />
                </div>
              </div>
              <p className="playlistItemDes">{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
