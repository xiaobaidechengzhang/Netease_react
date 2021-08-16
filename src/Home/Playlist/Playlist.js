import React, { useState, useEffect } from "react";
import HTTPUtils from "../../HTTPUtils/HTTPUtils";
import "./Playlist.less";
import VipImg from "../../images/Playlist/vip.png"; //歌单item---vip图片
import HeaderImg from "../../images/Playlist/header.png"; //歌单item---头像图片
import PlayImg from "../../images/Playlist/play.png"; //歌单item---播放图片
import PlayHoverImg from "../../images/Playlist/play_hover.png"; //歌单item---hover时现实的播放图片
import LanguageImg from "../../images/Playlist/language.png"; //歌单标签下拉列表---语种图片
import { withRouter } from "react-router";

function Playlist(props) {
  const [allCatList, setAllCatList] = useState([]); //歌单分类
  const [hotCatList, setHotCatList] = useState([]); //热门歌单分类
  const [allPlaylist, setAllPlayList] = useState([]); //歌单(网友精选碟)
  const [hgquaPlaylist, setHgquaPlaylist] = useState([]); //精品歌单

  const [catlistHotActiveItem, setCatlistHotActiveItem] = useState({
    id: 0,
    name: "",
  }); //当前热门标签item.id---用于active class
  const [expandIndex, setExpandIndex] = useState(-1); //歌单列表item expand
  /**
   * 歌单标签下拉列表数据
   */
  const [showDropCatlist, setShowDropCatlist] = useState(false); //是否显示歌单标签下拉列表
  const [catlistActiveItem, setCatlistActiveItem] = useState({
    id: 0,
    name: "全部",
  }); //当前点击item.id--用于active class

  const playlistDetail = (item) => {
    console.log("查看歌单详情");
    console.log(item)
    console.log(props)
    props.history.push('/playlist/'+item.id)
  };
  const playTheList = (e) => {
    //阻止冒泡
    e.stopPropagation();
    console.log("播放歌单");
  };

  /**
   * 获取歌单标签列表
   */
  const getPlaylistCatlist = async () => {
    let data = await HTTPUtils.playlist_catlist();
    let allData = [];
    let cats = data.categories;
    let subs = data.sub;
    //为每个子标签加个id, 用于active class
    subs.map((item, index) => {
      item.id = index + 1;
    });
    //重组数据, 重组后结构为[{cat: {id, name}, sub: Array}]
    Object.entries(cats).map((item, index) => {
      let sinData = {};
      let cat = {};
      cat.id = item[0];
      cat.val = item[1];
      let newSub = subs.filter((s) => s.category == cat.id);
      sinData.cat = cat;
      sinData.sub = newSub;
      allData.push(sinData);
    });
    //更新歌单列表
    setAllCatList(allData);
  };
  /**
   * 获取歌单热门标签列表
   */
  const getPlaylistHot = async () => {
    let data = await HTTPUtils.playlist_hot();
    setHotCatList(data.tags);
  };
  /**
   * 获取对应标签下, 歌单列表; 默认全部
   * @param {obj: Object} obj :标签信息
   */
  const getAllPlaylist = async (obj) => {
    let data = await HTTPUtils.top_playlist(obj);
    console.log("歌单数据");
    console.log(data);
    setAllPlayList(data.playlists);
  };

  const getHGPlaylsit = async (item) => {
    let obj = {
      limit: 1,
    };
    if (item) {
      obj.cat = item.name;
    }
    let data = await HTTPUtils.top_playlist_highquality(obj);
    console.log(data);
    setHgquaPlaylist(data.playlists);
  };

  /**
   * 页面加载后调用, 只执行一次;
   */
  useEffect(async () => {
    await getPlaylistCatlist();
    await getPlaylistHot();
    await getAllPlaylist();
    await getHGPlaylsit();
  }, []);

  /**
   * 初始化热门标签列表, 选中对应标签, 获取对应标签歌单列表
   * @param {item: Object} item : 点击的item
   */
  const selectDropItem = async (item) => {
    setCatlistActiveItem(item);
    setCatlistHotActiveItem({ id: 0, name: "" });
    let obj = {
      cat: item.name,
    };
    // showAllCatlist();
    await getAllPlaylist(obj);
  };
  /**
   * 初始化所有标签列表, 选中对应热门标签, 获取对应标签歌单列表
   * @param {item: Object} item: 热门标签active的item
   */
  const selectHotItem = async (item) => {
    setCatlistHotActiveItem(item);
    setCatlistActiveItem({ id: 0, name: "全部" });
    let obj = {
      cat: item.name,
    };
    await getAllPlaylist(obj);
  };
  /**
   * 开启/关闭所有标签列表dropdown
   */
  const showAllCatlist = () => {
    setShowDropCatlist(!showDropCatlist);
  };

  /**
   * 当该item处于onmouseover事件中, 改变该item和当前行其他item的宽度, 通过expandindex计算
   * @param {index: Number} index : 歌单列表item的index
   */
  const expandOver = (index) => {
    setExpandIndex(index);
  };
  /**
   * 当该item处于onmouseout事件中, 重置改变该item和当前行其他item的宽度, 设置expandindex为-1即可
   * @param {index: Number} index : 歌单列表item的index
   */
  const expandOut = () => {
    setExpandIndex(-1);
  };
  return (
    <div className="allPl">
      <div className="allPlHeader" style={{ position: "relative" }}>
        <img
          src={hgquaPlaylist.length > 0 ? hgquaPlaylist[0].coverImgUrl : ""}
          className="allPlHeaderBackImg"
        />
        <div className="allPlHeaderFront">
          <div className="allPlHeaderFrontLeft">
            <img
              className="allPlHeaderFrontLeftImg"
              src={hgquaPlaylist.length > 0 ? hgquaPlaylist[0].coverImgUrl : ""}
            />
          </div>
          <div className="allPlHeaderFrontRight">
            <span className="allPlHeaderFrontRightTop">精品歌单</span>
            <p className="allPlHeaderFrontRightName">
              {hgquaPlaylist.length > 0 ? hgquaPlaylist[0].name : ""}
            </p>
          </div>
        </div>
      </div>
      <div className="allPlTags">
        <div className="allPlTagsSelRow">
          <div className="allPlTagsSel" onClick={showAllCatlist}>
            <span>{catlistActiveItem.name}</span>
          </div>
          {showDropCatlist ? (
            <div className="allPlTagsSelDrop">
              <div className="allPlTagsSelDropHeader">
                <span
                  className={`${
                    catlistActiveItem.id == 0
                      ? "allPlTagsSelDropRowRightItemActive"
                      : ""
                  }  allPlTagsSelDropHeaderTitle`}
                  onClick={() => selectDropItem({ id: 0, name: "全部" })}
                >
                  全部歌单
                </span>
              </div>
              {allCatList.map((item, index) => {
                return (
                  <div key={index} className="allPlTagsSelDropRow">
                    <div
                      key={index + "_" + item.cat.id}
                      className="allPlTagsSelDropRowLeft"
                    >
                      <img
                        src={LanguageImg}
                        style={{ width: 30, height: 30 }}
                      />
                      <span>{item.cat.val} </span>
                    </div>
                    <div className="allPlTagsSelDropRowRight">
                      {item.sub.map((zItem, zIndex) => {
                        return (
                          <p
                            key={zItem.id}
                            className={`${
                              catlistActiveItem.id == zItem.id
                                ? "allPlTagsSelDropRowRightItemActive"
                                : ""
                            } allPlTagsSelDropRowRightItem`}
                            onClick={() => selectDropItem(zItem)}
                          >
                            {zItem.name}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        <ul className="allPlTagsHot">
          {hotCatList.map((item, index) => {
            return (
              <li
                key={item.id}
                className={`${
                  catlistHotActiveItem.id == item.id
                    ? "allPlTagsHotItemActive"
                    : ""
                } allPlTagsHotItem`}
                onClick={() => selectHotItem(item.playlistTag)}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>
      <div style={{ padding: 20 }}>
        {allPlaylist.map((item, index) => {
          //Math.floor(expandIndex/5) == Math.floor(index/5)---是否是当前行, 因为默认一行有5个元素
          //expandIndex == index : 是否是当前行, hover元素, 如果是当前元素, 加宽类expand; 如果不是, 缩小宽度类noexpand
          return (
            <div
              key={item.id + "-" + index}
              className={`${
                Math.floor(expandIndex / 5) == Math.floor(index / 5)
                  ? expandIndex == index
                    ? "expand"
                    : "noexpand"
                  : ""
              } allPlItem`}
            >
              <div
                className="allPlItemImgContainer"
                onClick={() => playlistDetail(item)}
                onMouseOver={() => expandOver(index)}
                onMouseOut={expandOut}
              >
                <img
                  src={item.coverImgUrl + "?param=280y280"}
                  className="allPlItemImgConMain"
                />
                <div className="allPlItemImgContainerTL">
                  <img src={PlayImg} className="deImg" />
                  <span>{item.playCount}</span>
                </div>
                <div className="allPlItemImgContainerLB">
                  <img src={HeaderImg} className="deImg" />
                  <span>{item.creator.nickname}</span>
                  <img src={VipImg} className="deImg" />
                </div>
                <div
                  className="allPlItemImgContainerRB"
                  onClick={(e) => playTheList(e)}
                >
                  <img src={PlayHoverImg} className="rbImg" />
                </div>
              </div>
              <p className="allPlItemDesc">{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default withRouter(Playlist)