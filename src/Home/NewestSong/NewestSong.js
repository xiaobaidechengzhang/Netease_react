import React, { useState, useEffect, useRef } from "react";
import "./NewestSong.less";
import HTTPUtils from "../../HTTPUtils/HTTPUtils";
import PlayActiveImg from "../../images/music/play-active.png";
import SubImg from "../../images/NewestSong/sub.png";
import PlayHoverImg from "../../images/Playlist/play_hover.png";
import { withRouter } from "react-router";

const getDate = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let obj = {
    year,
    month,
  };
  return obj;
};
function NewestSong(props) {
  //组件ref
  const NewSongRef = useRef()
  const [activeTab, setActiveTab] = useState(1); //当前选中的tab; 1为新歌速递; 2位新碟上架
  const [areaCat, setAreaCat] = useState([
    {
      id: 0,
      value: "全部",
    },
    {
      id: 7,
      value: "华语",
    },
    {
      id: 96,
      value: "欧美",
    },
    {
      id: 16,
      value: "韩国",
    },
    {
      id: 8,
      value: "日本",
    },
  ]);
  const [activeCat, setActiveCat] = useState(0); //当前active的area type
  const [paramsDate, setParamsDate] = useState({
    year: getDate().year,
    month: getDate().month,
  }); //请求新碟上架数据所需要的参数year和month
  const [temMonthData, setTemMonthData] = useState({}); //存储每次数据请求返回的月数据monthData;
  const [allData, setAllData] = useState([]); //所有新碟上架数据
  const [arriveBottom, setArriveBottom] = useState(false);//是否到达底部, 用于滚动加在数据
  /**
   *
   * @param {Number} tab : 选择的tab; 1为新歌速递; 2位新碟上架
   */
  const selectTab = (tab) => {
    setActiveTab(tab);
  };
  /**
   *
   * @param {Number} cat :选择的地区;
   */
  const selectCat = (cat) => {
    setActiveCat(cat);
  };
  /**
   *
   * @param {Object} item : 新歌速递每个item的数据
   * @returns item的元素element
   */
  const SongsListItem = (item) => {
    return (
      <div tabIndex="1" className="songsListItem">
        <div style={{ flex: 2 }} className="padItem lightColorItem centerItem">
          01
        </div>
        <div
          style={{ flex: 3, position: "relative" }}
          className="padItem centerItem "
        >
          <img
            className="itemImg"
            src="http://p4.music.126.net/slF9RoIs27y3dR73tkmmEg==/109951165599739964.jpg"
          />
          <img className="centerImg" src={PlayHoverImg} />
        </div>
        <div style={{ flex: 16 }} className="padItem leftItem">
          Run
        </div>
        <div style={{ flex: 6 }} className="padItem leftItem colorItem">
          OneRepublic
        </div>
        <div style={{ flex: 8 }} className="padItem leftItem colorItem">
          Run
        </div>
        <div style={{ flex: 2 }} className="padItem centerItem colorItem">
          02:49
        </div>
      </div>
    );
  };
  /**
   *
   * @param {Object} data : 生成指定结构的数据{title(标题): String, year(年份): String, month(月份): String, week(是否是周数据): Boolean, list(数据): Array}
   * 组合数据, 同一时间段, 在相应时间的对象中, 滑动加载, 添加数据; 如果没有更多数据, 那么添加更早时间段, 并请求相应时间段数据, 以此循环
   * 第一次加载时, 会返回本周新碟和本月数据, , 
   */
  const geneCorStucData = async (data) => {
    //如果是最新数据, 则有weekData数据,
    //这里判断是否传入data, 是因为第一次加载数据, 会有本周新碟数据和本月新碟数据, 先处理本周新碟数据, 本月新碟数据会先存入临时月数据temMonthData中
    console.log(temMonthData);
    let tem = data ? data : temMonthData;
    let newTemData = JSON.parse(JSON.stringify(tem));
    let newAllData = JSON.parse(JSON.stringify(allData));
    //是否是第一次加载数据, 如果有weekData这个字段, 说明是最新数据, 
    let isNewest = newTemData.hasOwnProperty("weekData");
    let newData = [];
    let obj = {};
    console.log(isNewest);
    console.log(newTemData);
    console.log(data);
    if (isNewest) {
      if (newAllData.length == 0) {
        //第一次加载数据, 
        obj.title = "本周新碟";
        obj.week = true;
        obj.year = paramsDate.year;
        obj.month = paramsDate.month;
        obj.list = [];
        obj.list = newTemData.weekData.splice(0, 20);
        newAllData.push(obj);
      } else {
        console.log('new all data length not 0');
        if (newAllData[newAllData.length - 1].week) {
          if (newTemData.weekData.length != 0) {
            newAllData[newAllData.length - 1].list = newAllData[
              newAllData.length - 1
            ].list.concat(newTemData.weekData.splice(0, 20));
          } else {
            obj.title = paramsDate.year + "-" + paramsDate.month;
            obj.week = false;
            obj.year = paramsDate.year;
            obj.month = paramsDate.month;
            obj.list = [];
            obj.list = newTemData.monthData.splice(0, 20);
            newAllData.push(obj);
          }
        } else {
          if (newTemData.monthData.length != 0) {
            newAllData[newAllData.length - 1].list = newAllData[
              newAllData.length - 1
            ].list.concat(newTemData.monthData.splice(0, 20));
          } else {
            let params = {
              year: paramsDate.year,
              month: (parseInt(paramsDate.month) - 1).toString(),
              area: "ALL",
              type: "new",
            };
            let p = {
              year: paramsDate.year,
              month: (parseInt(paramsDate.month) - 1).toString(),
            };
            setParamsDate(p);
            getTopAlbum(params);
          }
        }
      }
    } else {
      if (
        newAllData[newAllData.length - 1]?.year == paramsDate.year &&
        newAllData[newAllData.length - 1]?.month == paramsDate.month
      ) {
        if (newTemData.monthData.length != 0) {
          newAllData[newAllData.length - 1].list = newAllData[
            newAllData.length - 1
          ].list.concat(newTemData.monthData.splice(0, 20));
        } else {
          let params = {};
          let p = {};
          if(parseInt(paramsDate.month > 1)) {
            params = {
              year: paramsDate.year,
              month: (parseInt(paramsDate.month) - 1).toString(),
              area: "ALL",
              type: "new",
            };
            p = {
              year: paramsDate.year,
              month: (parseInt(paramsDate.month) - 1).toString(),
            };
          }else {
            params = {
              year: (parseInt(paramsDate.year)-1).toString,
              month: '12',
              area: "ALL",
              type: "new",
            };
            p = {
              year: paramsDate.year,
              month: (parseInt(paramsDate.month) - 1).toString(),
            };
          }
          setParamsDate(p);
          getTopAlbum(params);
        }
      } else {
        obj.title = paramsDate.year + "-" + paramsDate.month;
        obj.week = false;
        obj.year = paramsDate.year;
        obj.month = paramsDate.month;
        obj.list = [];
        obj.list = newTemData.monthData?.splice(0, 20);
        newAllData.push(obj);
      }
    }
    console.log(newTemData);
    setTemMonthData(newTemData);
    setAllData(newAllData);
    let intersectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach((item, index) => {
        if(item.intersectionRatio > 0) {
          let realUrl = item.target.getAttribute('data-imgurl');
          let temUrl = item.target.src;
          if(temUrl != realUrl) {
            realUrl = realUrl +'?param=240y240';
            item.target.setAttribute('src', realUrl)
          }
        }
      })
    })
    let eles = document.querySelectorAll('#pp');
    eles.forEach((item, index) => {
      intersectionObserver.observe(item)
    })
  };
  /**
   *
   * @param {Object} params : 请求新碟数据所需要的参数{limit, type, area, year, month, offset}
   */
  const getTopAlbum = async (params) => {
    let data = await HTTPUtils.top_album(params);
    console.log('获取新碟上架数据');
    console.log(data);
    geneCorStucData(data);
    // setTemMonthData(data);
    // setTemMonthData(async (x) => {
    //   await geneCorStucData(data);
    // })
    // let obj = {a: 1};
    // console.log(data)
    // setTemMonthData(data);
    // await setTemMonthData((x) => {
    //   console.log('临时数据')
    //   console.log(x)
    //   return x;
    // })
    // console.log('444444444444444')
    // await console.log(temMonthData)
  };
  /**
   *
   * @returns 返回新碟上架请求参数area
   */
  const getAlbumArea = () => {
    let val = "";
    switch (activeCat) {
      case 0:
        val = "ALL";
        break;
      case 7:
        val = "ZH";
        break;
      case 96:
        val = "EA";
        break;
      case 16:
        val = "KR";
        break;
      case 8:
        val = "JP";
        break;
      default:
        val = "ALL";
        break;
    }
    return val;
  };

  //点击碟item, 进入专辑详情页面
  const navigateAlbumDetail = (item) => {
    props.history.push('/album/'+item.id)
  }

  /**
   * 依赖项paramsDate, 每次变化都要重新获取新碟数据(第一次请求或者获取上一月新碟上架数据)
   */
  useEffect(async () => {
    let params = JSON.parse(JSON.stringify(paramsDate));
    params.type = "new";
    params.area = getAlbumArea();
    await getTopAlbum(params)
  }, [paramsDate]);
  /**
   * 依赖项activeCat, 每次变化, 都要将请求参数paramsDate中的year和month更新成最新年月
   */
  useEffect(() => {
    let obj = getDate()
    setParamsDate(obj);
    setTemMonthData({})
    setAllData([])
    setArriveBottom(false)
  }, [activeCat]);
  /**
   * 页面加载完成后, 请求数据, 只执行一次
   */
  useEffect(async () => {
    let intersectionObserver = new IntersectionObserver(function(entries) {
      //监听elem是否到达可视区域,
      entries.forEach((item, index) => {
        if(item.intersectionRatio > 0) {
          let realUrl = item.target.getAttribute('data-imgurl');
          let temUrl = item.target.src;
          if(temUrl != realUrl) {
            realUrl = realUrl +'?param=280y280';
            item.target.setAttribute('src', realUrl)
          }
        }
      })
    })
    let eles = document.querySelectorAll('#pp');
    eles.forEach((item, index) => {
      intersectionObserver.observe(item)
    })
    console.log(getDate().year);
    console.log(getDate().month);
    let params = {
      limit: "10",
      area: "ALL",
      type: "new",
      year: getDate().year.toString(),
      month: getDate().month.toString(),
    };
    await getTopAlbum(params);
    if(NewSongRef.current) {
      //   NewSongRef.current.onscroll = throttle(doSomething, 500);
        NewSongRef.current.addEventListener('scroll', throttle(doSomething, 500))
      }
  }, []);
  

  //依赖--arriveBottom, 是否到达底部, 用于滚动加载数据的一句
  useEffect(() => {
    if(arriveBottom) {
      geneCorStucData()
      setArriveBottom(false)
    }
  }, [arriveBottom])


  const throttle = (func, delay) => {
    let isValid = false;
    return function () {
      if (isValid) {
        return false;
      }
      isValid = true;
      let timer = setTimeout(() => {
        func();
        isValid = false;
      }, delay);
    };
  };
  //滚动加载-到达底部事件, 设置arriveBottom为true
  const doSomething = () => {
    let scrH =
    NewSongRef.current.scrollHeight;
    let cliH =
      NewSongRef.current.clientHeight;
    let scrTop = NewSongRef.current.scrollTop;
    if (scrTop + 100 > scrH - cliH) {
      // geneCorStucData();
      console.log('到达底部1111');
      setArriveBottom(true)
    }
  };
  
  return (
    <div className="newestSong" ref={NewSongRef}>
      <div className="newestSongTabs">
        <span className="newestSongTabsCon">
          <span
            className={`newestSongTabsConTab ${
              activeTab == 1 ? "newestSongTabsConTabActive" : ""
            } `}
            onClick={() => selectTab(1)}
          >
            新歌速递
          </span>
          <span
            className={`newestSongTabsConTab ${
              activeTab == 2 ? "newestSongTabsConTabActive" : ""
            } `}
            onClick={() => selectTab(2)}
          >
            新碟上架
          </span>
        </span>
      </div>
      <div className="newestSongArea">
        <div className="newestSongAreaLeft">
          {areaCat.map((item, index) => {
            return (
              <span
                key={item.id}
                className={`newestSongAreaLeftItem ${
                  item.id == activeCat ? "newestSongAreaLeftItemActive" : ""
                }`}
                onClick={() => selectCat(item.id)}
              >
                {item.value}
              </span>
            );
          })}
        </div>
        <div className="newestSongAreaRight">
          <span className="newestSongAreaRightItem newestSongAreaRightItemRed">
            <img className="newestSongAreaRightItemImg" src={PlayActiveImg} />
            <span>播放全部</span>
          </span>
          <span className="newestSongAreaRightItem newestSongAreaRightItemBor">
            <img className="newestSongAreaRightItemImg" src={SubImg} />
            <span>收藏全部</span>
          </span>
        </div>
      </div>
      <div className="songsList">
        {allData.map((item, index) => {
          return (
            <div className='songsListNewItem' key={index}>
              <div
                className='songsListNewItemTitleCon'
                >
                <div
                  className='songsListNewItemTitleDiv'
                >
                  <p 
                  className='songsListNewItemTitleDivTitle'
                  >
                    {item.title}
                  </p>
                </div>
              </div>
              <div
                className='songsListNewItemRight'
              >
                <div
                  className='songsListNewItemRightCon'
                >
                  {item.list && item.list.map((zItem, zIndex) => {
                    return (
                      <div id="ele" className='songsListNewItemRightItem is_album' data-album={zItem.id} key={zItem.id+'-'+zIndex} onClick={navigateAlbumDetail.bind(this, zItem)}>
                        <div
                          className='songsListNewItemRightItemImgCon'
                        >
                          <img
                            id="pp"
                            className='songsListNewItemRightItemImgSrc'
                            src='https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2879430259,1145403574&fm=26&gp=0.jpg'
                            data-imgurl={zItem.picUrl}
                          />
                          <img
                            className='songsListNewItemRightItemImgStatic'
                            src={PlayHoverImg}
                          />
                        </div>
                        <div className='songsListNewItemRightItemDescCon'>
                          <p className='songsListNewItemRightItemDescName'>
                            {zItem.name}
                          </p>
                          <p className='songsListNewItemRightItemDescArtist'>
                            {zItem.artist.name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
           );
        })} 
      </div>
    </div>
  );
}

export default withRouter(NewestSong)