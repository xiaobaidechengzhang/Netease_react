import React, { useState, useEffect } from "react";
import HTTPUtils from "../../HTTPUtils/HTTPUtils";
import "./Toplist.less";
import RightImg from "../../images/Toplist/right.png";
import PauseImg from "../../images/Playlist/play.png";
import PlayHoverImg from "../../images/Playlist/play_hover.png";
import { withRouter } from "react-router";

function Toplist(props) {
  const [allToplist, setAllToplist] = useState([]); //所有排行榜数据
  const [topFiveData, setTopFiveData] = useState([]); //要显示的top5数据, 以及每个排行榜的top5歌曲
  /**
   * 获取所有排行榜数据
   */
  const getAllToplist = async () => {
    let data = await HTTPUtils.toplist();
    let list = data.list;
    setAllToplist(list);
  };
  /**
   * 获取某个排行榜歌曲数据
   * @param {NUMBER : STRING} id 排行榜id
   * @returns 
   */
  const getTopFiveData = async (id) => {
    let obj = {
      id: id,
    };
    let data = await HTTPUtils.playlist_detail(obj);
    return data.playlist;
  };
  //当获取所有排行榜数据, 只要前5个, 循环获取这5个排行榜的热门歌曲, 也只取前5首歌, 然后更新数据---依赖alltoplist
  useEffect(async () => {
    if (allToplist.length == 0) {
      return;
    }
    let newList = JSON.parse(JSON.stringify(allToplist));
    newList.length = 5;
    let arr = [];
    let i = 0;
    while (i < 5) {
      let data = await getTopFiveData(newList[i].id);
      arr.push(data);
      i++;
    }
    setTopFiveData(arr)
  }, [allToplist]);


  /**
   * 进入榜单详情
   */
  const navigateDetail = (item) => {
    console.log('navigate detail')
    console.log(item);
    props.history.push("/playlist/"+item.id)
  }

  //页面加载时, 执行一次获取所有排行榜数据
  useEffect(async () => {
    await getAllToplist();
  }, []);
  return (
    <div>
      <div
        className='topfive'
      >
        {topFiveData.map((item, index) => {
            let sub = JSON.parse(JSON.stringify(item.tracks));
            sub.length = 5;
            
          return (
            <div
              key={item.id}
              className='topfiveView'
            >
              <div 
                className='topfiveViewLeft'
              >
                <img
                  className='topfiveViewLeftImg'
                  src={item.coverImgUrl}
                />
              </div>
              <div 
                className='topfiveViewRight'
              >
                <div>
                  {sub.map((zItem, zIndex) => {
                      let arts = [];
                      zItem.ar && zItem.ar.map((z, i) => {
                          arts.push(z.name)
                      })
                      let artStr = arts.join('/');
                    return (
                      <div
                        key={zItem.id}
                        tabIndex='1'
                        className={`topFiveItem ${
                          zIndex % 2 == 0 ? "topFiveItemIndex" : ""
                        }`} 
                      >
                        <div>
                          <span
                            className={`${
                              zIndex == 0 || zIndex == 1 || zIndex == 2
                                ? "txtRed"
                                : ""
                            }`}
                          >
                            {zIndex}
                          </span>
                          <span style={{ marginLeft: 10 }}>{zItem.name}</span>
                        </div>
                        <div>
                          <span>{artStr}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='topfiveViewRightMore' onClick={() => navigateDetail(item)}>
                  <span>查看全部</span>
                  <img src={RightImg} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className='toplistView'
      >
        {allToplist.map((item, index) => {
          return (
            <div key={item.id} onClick={() => navigateDetail(item)}>
              <div className="toplistItem">
                <img className="toplistItemImg" src={item.coverImgUrl} />
                <div className="toplistItemRight">
                  <img className="toplistItemRightImg" src={PauseImg} />
                  <span>{Math.floor(item.playCount / 10000) + '万'}</span>
                </div>
                <div className="toplistItemCenter">
                  <img className="toplistItemCenterImg" src={PlayHoverImg} />
                </div>
              </div>
              <div style={{ fontSize: 18, padding: 10, textAlign: "left" }}>
                <p>{item.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default withRouter(Toplist)
