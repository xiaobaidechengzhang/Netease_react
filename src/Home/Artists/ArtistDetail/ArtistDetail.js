import React, { useState, useEffect, useRef } from "react";
import { useParams, withRouter } from 'react-router-dom'
import "./ArtistDetail.less";
import HTTPUtils from "@/HTTPUtils/HTTPUtils";
import SubPng from "@/images/NewestSong/sub.png";
import NoShoucangPng from "@/images/Playlist/noshoucang.png";
import DownloadPng from "@/images/Playlist/download.png";
import PlayPng from "@/images/Playlist/play.png";
import PicListNoActivePng from "@/images/AritstDetail/pic-list-no-active.png";
import PicListActivePng from "@/images/AritstDetail/pic-list-active.png";
import PicNoActivePng from "@/images/AritstDetail/pic-no-active.png";
import PicActivePng from "@/images/AritstDetail/pic-active.png";
import ListNoActivePng from "@/images/AritstDetail/list-no-active.png";
import ListActivePng from "@/images/AritstDetail/list-active.png";
import DownPng from "@/images/Playlist/down.png";
import UpPng from "@/images/Playlist/up.png";

const { exchangeTime, exchangeDuration } = require("@/Utils/ExchangeTime");

function ArtistDetail(props) {
  //歌手数据
  const { id } = useParams();
  //专辑id
  const [artistID, setArtistID] = useState(-1)
  //歌手详情中 tabs 选中哪个标签  1->4; 专辑->相似歌手
  const [tabIndex, setTabIndex] = useState("1");
  //专辑列表浏览模式--1->3; 图列模式->列表模式->大图模式
  const [modalIndex, setModalIndex] = useState("1");
  //数据---歌单简介-展开与收齐(boolean);
  const [desExpand, setDesExpand] = useState(false);
  //歌手详情--歌手数据
  const [artistDetailData, setArtistDetailData] = useState({});
  //歌手详情--相似歌手数据
  const [simiArtistData, setSimiArtistData] = useState([]);
  //歌手详情--获取歌手详细描述
  const [artistDetailDesc, setArtistDetailDest] = useState({});
  //歌手详情--获取歌手MV数据
  const [artistMV, setArtistMV] = useState([]);
  //歌手详情--获取歌手专辑列表
  const [hotAlbumsData, setHotAlbumsData] = useState([]);
  //歌手详情-专辑列表-展开全部歌曲数组 [...{id: false}]
  const [expandAlbumsArr, setExpandAlbumsArr] = useState([]);
  //歌手详情-专辑列表--请求数据offset, 默认为0
  const [albumsOffset, setAlbumOffset] = useState(0);
  //歌手详情--专辑列表--是否还有更多
  const [hasMore, setHasMore] = useState(true);
  //歌手详情-MV列表--请求数据offset, 默认为0
  const [mvsOffset, setMVOffset] = useState(0);
  //歌手详情--MV列表--是否还有更多
  const [hasMVMore, setHasMVMore] = useState(true);
  //歌手详情-整个页面ref
  const artistDetailRef = useRef();
  //是否重置数据
  const [isOnReset, setIsOnReset] = useState(false);

  //事件---展开/收起歌单简介
  const changeDesExpand = () => {
    setDesExpand(!desExpand);
  };

  //切换tab index事件
  const changeTabIndex = (event) => {
    if (event.target.id) {
      setTabIndex(event.target.id);
    }
  };

  //事件---切换专辑列表浏览模式
  const changeModalIndex = (event) => {
    if (event.target.id || event.target.parentNode.id) {
      setModalIndex(event.target.id || event.target.parentNode.id);
    }
  };

  //事件---获取歌手详情数据 例如id='3684';
  const getArtistDetail = async () => {
    console.log('id');
    console.log(id);
    let params = {
      id: id,
    };
    let data = await HTTPUtils.artist_detail(params);
    setArtistDetailData(data.data?.artist);
  };

  //事件--获取歌手详情中相似歌手 例如id='3684'
  const getSimiArtist = async () => {
    let params = {
      id: id,
    };
    let data = await HTTPUtils.simi_artist(params);
    console.log('相似歌手');
    console.log(id);
    console.log(data);
    setSimiArtistData(data.artists);
  };

  //事件--获取歌手详细描述
  const getArtistDetailDesc = async () => {
    let params = {
      id: id,
    };
    let data = await HTTPUtils.artist_desc(params);
    setArtistDetailDest(data);
  };

  //获取歌手MV数据
  const getArtistMV = async () => {
    if (!hasMVMore) {
      return false;
    }
    console.log(props);
    let params = {
      id: id,
      limit: "10",
      offset: mvsOffset * 10,
    };
    let data = await HTTPUtils.artist_mv(params);
    if (!data.hasMore) {
      setHasMVMore(false);
    }
    let newMVS = artistMV.length == 0 ? data.mvs : artistMV.concat(data.mvs);
    setArtistMV(newMVS);
  };

  //事件--获取歌手专辑列表
  const getArtistAlbum = async () => {
    //如果没有更多数据, 直接返回, 不进行操作
    if (!hasMore) {
      return false;
    }
    console.log('歌手id');
    console.log(id);
    let params = {
      id: id,
      limit: "5",
      offset: albumsOffset * 5,
    };
    let data = await HTTPUtils.artist_album(params);
    console.log(hotAlbumsData);
    let hotalbums = data.hotAlbums;
    if (!data.more) {
      setHasMore(false);
    }
    if (hotalbums.length == 0) {
      return false;
    }
    //存储每个请求专辑详细内容的promise请求
    let arr = [];
    //存储每个专辑列表是否expand
    let expandArr = [];
    hotalbums.map(async (item, index) => {
      arr.push(
        new Promise(async (resolve, reject) => {
          let data = await getAlbumDetail(item);
          return resolve(data);
        })
      );
      expandArr[index] = {};
      expandArr[index][item.id] = false;
    });
    Promise.all(arr).then((res) => {
      hotalbums.map((item, index) => {
        let filterArr = res.filter((zItem) => zItem.album?.id == item.id);
        let filterItem = filterArr[0];
        item.songs = filterItem.songs;
      });
      let newHotAlbumsData = hotAlbumsData.concat(hotalbums);
      let newExpandArr =
        expandAlbumsArr.length == 0
          ? expandArr
          : expandAlbumsArr?.concat(expandArr);
      setExpandAlbumsArr(newExpandArr);
      setHotAlbumsData(newHotAlbumsData);
    });
  };
  //事件--获取专辑具体内容
  const getAlbumDetail = async (item) => {
    let params = {
      id: item.id,
    };
    let data = await HTTPUtils.album(params);
    return data;
  };
  const expandAlbum = (item, index) => {
    let expandArr = JSON.parse(JSON.stringify(expandAlbumsArr));
    if (expandArr[index]) {
      let isExpand = expandArr[index][item.id];
      isExpand = !isExpand;
      expandArr[index][item.id] = isExpand;
    }
    setExpandAlbumsArr(expandArr);
  };

  //事件--相似歌手进入相应歌手详情页面
  const navigateArtistDetail = (item) => {
    console.log('导航');
    console.log(props.history)
    props.history.replace('/artist/' + item.id)
  }

  //重置数据
  // const resetData = async () => {
  //   setIsOnReset(true)
  //   setTabIndex('1');
  //   setModalIndex('1');
  //   setDesExpand(false);
  //   setArtistMV([]);
  //   setHotAlbumsData([]);
  //   setExpandAlbumsArr([]);
  //   setAlbumOffset(0);
  //   setHasMore(true);
  //   setMVOffset(0);
  //   setHasMVMore(true)
  //   console.log('reset data');
  // }

  // useEffect(async () => {
  //   console.log('变化 tab index');
  //   console.log(isOnReset);
  //   if (isOnReset) {
  //     await getArtistDetail();
  //     await getSimiArtist();
  //     await getArtistDetailDesc();
  //     await getArtistMV();
  //     await getArtistAlbum();
  //     setIsOnReset(false)
  //   }
  // }, [isOnReset])

  useEffect(async () => {
    await getArtistDetail();
    await getSimiArtist();
    await getArtistDetailDesc();
    await getArtistMV();
    await getArtistAlbum();
  }, [artistID])

  //依赖 歌手id变化, 也要获取新的歌手数据
  useEffect(async () => {
    console.log('变化 id id id');
    if (artistID != id) {
      //在id变化后, 获取数据之前需要将变量恢复初始状态
      setTabIndex('1');
      setModalIndex('1');
      setDesExpand(false);
      setArtistMV([]);
      setHotAlbumsData([]);
      setExpandAlbumsArr([]);
      setAlbumOffset(0);
      setHasMore(true);
      setMVOffset(0);
      setHasMVMore(true)
      setArtistID(id)
    }
    // console.log(id);
    // // await resetData()
    // setIsOnReset(true)
    // setTabIndex('1');
    // setModalIndex('1');
    // setDesExpand(false);
    // setArtistMV([]);
    // setHotAlbumsData([]);
    // setExpandAlbumsArr([]);
    // setAlbumOffset(0);
    // setHasMore(true);
    // setMVOffset(0);
    // setHasMVMore(true)
    // await getArtistDetail();
    // await getSimiArtist();
    // await getArtistDetailDesc();
    // await getArtistMV();
    // await getArtistAlbum();
  }, [id])

  //页面进入--只进行一次渲染
  useEffect(async () => {
    // setIsOnReset(false)
    console.log('id id');
    console.log(id);
    await getArtistDetail();
    await getSimiArtist();
    await getArtistDetailDesc();
    await getArtistMV();
    await getArtistAlbum();
    //不能用addEventListener, 也可以
    window.onscroll = throttle(scrollBottomLoadingAlbum, 1000);
  }, []);
  //节流-节流
  const throttle = (func, delay) => {
    let valid = true;
    return function () {
      if (!valid) {
        return false;
      }
      valid = false;
      setTimeout(() => {
        func();
        valid = true;
      }, delay);
    };
  };
  //事件--滚动到离底部100px时, 修改专辑列表依赖的offset
  const scrollBottomLoadingAlbum = async () => {
    if (artistDetailRef.current) {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      let clientHeight = window.innerHeight;
      let clientScrollHeight = artistDetailRef.current && artistDetailRef.current.scrollHeight;
      if (scrollTop + clientHeight > clientScrollHeight - 100) {
        setAlbumOffset((offset) => offset + 1);
      }
    }
  };
  //事件--滚动到离底部100px时, 修改MV列表依赖的offset
  const scrollBottomLoadingMV = async () => {
    if (artistDetailRef.current) {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      let clientHeight = window.innerHeight;
      let clientScrollHeight = artistDetailRef.current.scrollHeight;
      if (scrollTop + clientHeight > clientScrollHeight - 100) {
        setMVOffset((offset) => offset + 1);
      }
    }
  };
  //依赖albumsOffset, 属性值变化, 会重新获取专辑列表
  useEffect(async () => {
    await getArtistAlbum();
  }, [albumsOffset]);
  //依赖mvsOffset, 属性值变化, 会重新获取专辑列表
  useEffect(async () => {
    await getArtistMV();
  }, [mvsOffset]);
  //依赖tabIndex--不同tab, 切换不同的滑动底部加载
  useEffect(() => {
    if (artistDetailRef.current) {
      if (tabIndex == "2") {
        window.onscroll = throttle(scrollBottomLoadingMV, 1000);
      } else if (tabIndex == "1") {
        window.onscroll = throttle(scrollBottomLoadingAlbum, 1000);
      } else {
        window.onscroll = null;
      }
    }
  }, [tabIndex]);
  //渲染--专辑列表图列模式--item
  const PicListModalItem = ({ item, index }) => {
    index = index + 1 < 10 ? "0" + (index + 1) : index + 1;
    return (
      <ul
        // className={`content-header fontsize18 canSelectItem`}
        className={`content-header fontsize18 is_song canSelectItem ${(parseInt(index) - 1) % 2 == 0 ? "backGray" : ""
          }`}
        tabIndex="1"
        data-song={JSON.stringify(item)}
      >
        <li className="content-header-item flex6">
          <ul className="item-flex">
            <li className="item-flex-item txtLightGray">{index}</li>
            <li className="item-flex-item">
              <img src={NoShoucangPng} className="img15" />
            </li>
            <li className="item-flex-item">
              <img src={DownloadPng} className="img15" />
            </li>
            <li className="item-flex-item">
              <p style={{ margin: 0, padding: 0 }}>{item.name}</p>
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
        <li className="content-header-item flex2 txtCenter txtLightGray">44</li>
      </ul>
    );
  };
  //渲染--专辑列表--图列模式--内容
  const PiclistModal = ({ item, index }) => {
    return (
      <div style={{ position: "relative" }} className="piclistModal">
        <div className="header-left is_album" data-album={item.id}>
          <img
            key={item.picId_str}
            src={item.picUrl + "?param=150y150"}
            className="img150"
          />
        </div>
        <div
          className={`header-right list-right ${!(expandAlbumsArr[index] && expandAlbumsArr[index][item.id])
            ? "list-right-750"
            : "list-right-height-auto"
            } `}
        >
          <ul className="list-right-tabs">
            <li className="list-right-tab font-weight-20">{item.name}</li>
            <li className="list-right-tab">播放</li>
            <li className="list-right-tab">收藏</li>
          </ul>
          {item.songs.map((zItem, zIndex) => {
            if (
              zIndex == 10 &&
              !(expandAlbumsArr[index] && expandAlbumsArr[index][item.id])
            ) {
              return (
                <p
                  key={zIndex}
                  style={{
                    textAlign: "right",
                    height: 60,
                    lineHeight: "60px",
                    paddingRight: 20,
                  }}
                  className="backGray txtLightGray"
                  onClick={() => expandAlbum(item, index)}
                >
                  查看全部{item.songs.length}首
                </p>
              );
            }
            return (
              <PicListModalItem
                key={zItem.id + "_" + zIndex}
                item={zItem}
                index={zIndex}
              />
            );
          })}
        </div>
      </div>
    );
  };
  //渲染--专辑列表--列表模式-item
  const ListModalItem = ({ item, index }) => {
    return (
      <li
        className={`listModal-list-item is_ablum canSelectItem ${index % 2 == 0 ? "backGray" : ""
          }`}
        tabIndex={index}
        data-album={item.id}
      >
        <ul className="listModal-list-item-container">
          <li className="list-item list-item-left">
            <img
              src={item.picUrl + "?param=100y100"}
              className="list-item-img"
            />
            <p className="list-item-left-title">{item.name}</p>
          </li>
          <li className="list-item">
            <p className="list-item-center-title">{item.songs?.length}</p>
          </li>
          <li className="list-item">
            <p className="list-item-center-title">
              发行时间: {exchangeTime(item.publishTime, 1)}
            </p>
          </li>
        </ul>
      </li>
    );
  };
  //渲染--专辑列表--列表模式-内容
  const ListModal = () => {
    return (
      <ul className="listModal-lists">
        {hotAlbumsData.map((item, index) => {
          return (
            <ListModalItem
              key={item.id + "_" + index}
              item={item}
              index={index}
            />
          );
        })}
      </ul>
    );
  };
  //渲染--专辑列表--大图模式--item
  const PicModalItem = ({ item, index }) => {
    return (
      <li className="picmodal-list-item is_album" data-album={item.id}>
        <div className="picmodal-list-item-container">
          <img src={item.picUrl + "?param=250y150"} className="list-item-img" />
          <p className="list-item-title">{item.name}</p>
          <p className="list-item-subtitle">{exchangeTime(item.publishTime)}</p>
        </div>
      </li>
    );
  };
  //渲染--专辑列表--大图模式--内容
  const PicModal = (props) => {
    return (
      <ul className="picmodal-lists">
        {hotAlbumsData.map((item, index) => {
          return (
            <PicModalItem
              key={item.id + "_" + index}
              item={item}
              index={index}
            />
          );
        })}
      </ul>
    );
  };
  //渲染---专辑列表
  const RenderContent = () => {
    let View = null;
    switch (modalIndex) {
      case "1":
        View = hotAlbumsData.map((item, index) => {
          return (
            <PiclistModal
              key={item.id + "_" + index}
              item={item}
              index={index}
            />
          );
        });
        break;
      case "2":
        View = <ListModal />;
        break;
      case "3":
        View = <PicModal />;
        break;
      default:
        break;
    }
    return (
      <div className="artist-detail-header artist-detail-lists">{View}</div>
    );
  };
  //渲染--MV列表--item
  const MVListItem = ({ item, index }) => {
    return (
      <div className="mv-list">
        <div className="mv-list-item-container">
          <div className="mv-list-item is_mv" data-mv={item.id}>
            <img
              src={item.imgurl + "?param=200y200"}
              className="list-item-img"
            />
            <div className="list-item-count">
              <img
                src={PlayPng}
                style={{ width: 15, height: 15, objectFit: "cover" }}
              />
              <span>
                {item.playCount > 100000
                  ? Math.floor(item.playCount / 10000) + "万"
                  : item.playCount}
              </span>
            </div>
            <div className="list-item-time">
              {exchangeDuration(item.duration)}
            </div>
          </div>
          <p className="mv-list-item-name">{item.name}</p>
        </div>
      </div>
    );
  };
  //渲染--MV列表--内容
  const MVList = (props) => {
    return (
      <div className="mv-lists">
        {artistMV.map((item, index) => {
          return (
            <MVListItem key={item.id + "_" + index} item={item} index={index} />
          );
        })}
      </div>
    );
  };
  //渲染--歌手详情页面
  const DetailDesc = () => {
    return (
      <div className="detail-desc">
        <p className="detail-desc-jianjie detail-desc-title fongsize20">
          {artistDetailData.name}简介
        </p>
        <p className="desc-jianjie-content jianjie-indent-content">
          {artistDetailDesc.briefDesc}
        </p>
        {artistDetailDesc.introduction?.map((item, index) => {
          let strArr = item.txt.split("●");
          strArr.splice(0, 1);
          let newStrArr = strArr.map((i, j) => (i = "●" + i));
          return (
            <div key={index * 10}>
              <p className="detail-desc-title fongsize20">{item.ti}</p>
              {newStrArr.map((str, strIndex) => (
                <p
                  key={index * 10 + "_" + strIndex}
                  className="desc-jianjie-content"
                >
                  {str}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    );
  };
  //渲染--相似歌手--item
  const SimilarListItem = ({ item, index }) => {
    return (
      <div className="similar-artist-list" onClick={navigateArtistDetail.bind(this, item)}>
        <div className="list-item">
          <img
            key={item.picId_str}
            src={item.picUrl + "?param=380y380"}
            className="list-item-img"
          />
          <p className="list-item-title">{item.name}</p>
        </div>
      </div>
    );
  };
  //渲染--相似歌手--内容
  const SimilarList = (props) => {
    return (
      <div className="similar-artist-lists">
        {simiArtistData.map((item, index) => {
          return (
            <SimilarListItem
              key={item.id + "_" + index}
              item={item}
              index={index}
            />
          );
        })}
      </div>
    );
  };
  return (
    <div className="artist-detail" ref={artistDetailRef}>
      <div className="artist-detail-header">
        <div className="header-left">
          <img src={artistDetailData.cover} className="img200" />
        </div>
        <div className="header-right">
          <p className="header-right-title">{artistDetailData.name}</p>
          <p className="header-right-subtitle">jj lin</p>
          <button className="defineButton">收藏</button>
          <ul className="right-line">
            <li className="right-line-item">
              单曲数: {artistDetailData.musicSize}
            </li>
            <li className="right-line-item">
              专辑数: {artistDetailData.albumSize}
            </li>
            <li className="right-line-item">MV数: {artistDetailData.mvSize}</li>
          </ul>
          <div className="headerPadding5 header-right-row playlist-des">
            <span
              style={{
                display: "inline-block",
                height: !desExpand ? 30 : "auto",
                overflow: "hidden",
                width: "90%",
              }}
            >
              简介: {artistDetailData.briefDesc}
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
      <div className="artist-detail-tabs-container">
        <ul className="artist-detail-tabs" onClick={changeTabIndex}>
          <li
            className={`artist-detail-tab ${tabIndex == "1" ? "artist-detail-tab-active" : null
              }`}
            id="1"
          >
            专辑
          </li>
          <li
            className={`artist-detail-tab ${tabIndex == "2" ? "artist-detail-tab-active" : null
              }`}
            id="2"
          >
            MV
          </li>
          <li
            className={`artist-detail-tab ${tabIndex == "3" ? "artist-detail-tab-active" : null
              }`}
            id="3"
          >
            歌手详情
          </li>
          <li
            className={`artist-detail-tab ${tabIndex == "4" ? "artist-detail-tab-active" : null
              }`}
            id="4"
          >
            相似歌手
          </li>
        </ul>
        {tabIndex == "1" ? (
          <ul className="right-imgs" onClick={changeModalIndex}>
            <li
              id="3"
              className={`right-img-container ${modalIndex == "3" ? "right-img-container-active" : null
                }`}
            >
              <img
                className="right-img"
                src={modalIndex == "3" ? PicActivePng : PicNoActivePng}
              />
            </li>
            <li
              id="2"
              className={`right-img-container ${modalIndex == "2" ? "right-img-container-active" : null
                }`}
            >
              <img
                className="right-img"
                src={modalIndex == "2" ? ListActivePng : ListNoActivePng}
              />
            </li>
            <li
              id="1"
              className={`right-img-container ${modalIndex == "1" ? "right-img-container-active" : null
                }`}
            >
              <img
                className="right-img"
                src={modalIndex == "1" ? PicListActivePng : PicListNoActivePng}
              />
            </li>
          </ul>
        ) : null}
      </div>
      {tabIndex == "1" ? <RenderContent /> : null}
      {tabIndex == "2" ? <MVList /> : null}
      {tabIndex == "3" ? <DetailDesc /> : null}
      {tabIndex == "4" ? <SimilarList /> : null}
    </div>
  );
}

export default withRouter(ArtistDetail)
