import React, { useState, useEffect, useRef } from "react";
import "./Artists.less";
import HTTPUtils from "../../HTTPUtils/HTTPUtils";
import { withRouter } from "react-router";

function Artists(props) {
  const artistsRef = useRef();
  const [types, setTypes] = useState([
    //歌手筛选分类
    {
      id: -1,
      name: "全部",
    },
    {
      id: 1,
      name: "男歌手",
    },
    {
      id: 2,
      name: "女歌手",
    },
    {
      id: 3,
      name: "乐队组合",
    },
  ]);
  const [areas, setAreas] = useState([
    //歌手筛选语种
    {
      id: -1,
      name: "全部",
    },
    {
      id: 7,
      name: "华语",
    },
    {
      id: 96,
      name: "欧美",
    },
    {
      id: 8,
      name: "日本",
    },
    {
      id: 16,
      name: "韩国",
    },
    {
      id: 0,
      name: "其他",
    },
  ]);
  const [cats, setCats] = useState([
    //筛选名字首字母信息
    { id: -1, name: "热门" },
    { id: "A", name: "A" },
    { id: "B", name: "B" },
    { id: "C", name: "C" },
    { id: "D", name: "D" },
    { id: "E", name: "E" },
    { id: "F", name: "F" },
    { id: "G", name: "G" },
    { id: "H", name: "H" },
    { id: "I", name: "I" },
    { id: "J", name: "J" },
    { id: "K", name: "K" },
    { id: "L", name: "L" },
    { id: "M", name: "M" },
    { id: "N", name: "N" },
    { id: "O", name: "O" },
    { id: "P", name: "P" },
    { id: "Q", name: "Q" },
    { id: "R", name: "R" },
    { id: "S", name: "S" },
    { id: "T", name: "T" },
    { id: "U", name: "U" },
    { id: "V", name: "V" },
    { id: "W", name: "W" },
    { id: "X", name: "X" },
    { id: "Y", name: "Y" },
    { id: "Z", name: "Z" },
    { id: "#", name: "#" },
  ]);
  const [activeType, setActiveType] = useState("-1"); //当前active的歌手分类
  const [activeArea, setActiveArea] = useState("-1"); //当前active的歌手语种
  const [activeCat, setActiveCat] = useState("-1"); //当前active的歌手筛选
  const [artistsData, setArtistsData] = useState([]); //歌手分类列表数据

  /**
   * 
   * @param {Number} id : 所选对应类别item的id
   * @param {Number} type : 1为语种; 2位性别和组合; 3为歌手首字母筛选
   */
  const selectCatItem = (id, type) => {
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

  const getArtistsList = async (obj) => {
    let data = await HTTPUtils.artist_list(obj);
    setArtistsData(data.artists)
  }
  //依赖项语种, 男/女/组合, 每次点击都要重新获取数据
  useEffect(async () => {
    let obj = {
      area: activeArea,
      type: activeType,
      initial: activeCat,
    }
    await getArtistsList(obj)
  }, [activeArea, activeType, activeCat])
  //依赖项歌手数据, 每个更新数据, 都要为每个img添加懒加载, 
  useEffect(() => {
    let imgs = document.querySelectorAll('.artistsListItemImg');
    imgs.forEach((item, index) => {
      let dataSrc = item.getAttribute('data-imgurl');
      if(item.src != dataSrc) {
        let offsetTop = item.offsetTop;
        let clientHeight = window.innerHeight;
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if(offsetTop < (clientHeight + scrollTop - 100)) {
          item.src = dataSrc;
        }
      }
    })
  }, [artistsData])


  /**
   * 歌手列表系列事件
   */
  const navigateDetail = (item) => {
    console.log(props);
    console.log(item);
    props.history.push('/artist/' + item.id)
  }


  //滚动加载图片
  window.onscroll = () => {
    //首先将真实图片url添加到data-imgurl中, 通过判断距离, 来将真实url, 添加到src中, 实现懒加载
    if(artistsRef) {
      let imgs = document.querySelectorAll('.artistsListItemImg');
      imgs.forEach((item, index) => {
        let dataSrc = item.getAttribute('data-imgurl');
        if(item.src != dataSrc) {
          let offsetTop = item.offsetTop;
          let clientHeight = window.innerHeight;
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          if(offsetTop < (clientHeight + scrollTop - 100)) {
            item.src = dataSrc;
          }
        }
      })
    }
  }
  return (
    <div
      className='artists'
      ref={artistsRef}
    >
      <div>
        <div className="itemOptions">
          <div className="itemOptionsRow itemOptionsRowLeft">语种: </div>
          <div className="itemOptionsRow itemOptionsRowRight">
            {areas.map((item, index) => {
              return (
                <span key={item.id+'_'+index} className="artistItemContainer">
                  <span
                    className={`${
                      activeArea == item.id ? "activeItem" : ""
                    } artistItem`}
                    onClick={() =>selectCatItem(item.id, 1)}
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
                      activeType == item.id ? "activeItem" : ""
                    } artistItem`}
                    onClick={() =>selectCatItem(item.id, 2)}
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
          <div className="itemOptionsRow itemOptionsRowLeft">筛选: </div>
          <div className="itemOptionsRow itemOptionsRowRight">
            {cats.map((item, index) => {
              return (
                <span key={item.id+'_'+index} className="artistItemContainer">
                  <span
                    key={item.id}
                    className={`${
                      activeCat == item.id ? "activeItem" : ""
                    } artistItem`}
                    onClick={() =>selectCatItem(item.id, 3)}
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
      <div
        className='artistsList'
      >
        {
          artistsData.map((item, index) => {
            return (
              <div
                key={item.id+'_'+index}
                className='artistsListItem'
                onClick={() => navigateDetail(item)}
              >
                <div className='artistsListItemImgCon'>
                  <img
                    className='artistsListItemImg'
                    src=''
                    data-imgurl={item.picUrl+'?param=280y280'}
                  />
                </div>
                <div>
                  <p className='artistsListItemName'>
                    {item.name}
                  </p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default withRouter(Artists)
