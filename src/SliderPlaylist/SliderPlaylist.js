import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { exchangeTime, exchangeDuration } from '@/Utils'
import { addToPlaylist, deleteAllSongs, deleteSong, setActive, } from '../store/actions/playlistActions'
import './SliderPlaylist.less';
import { Button } from 'antd'

//引入图标
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

function SliderPlaylist(props) {
  useEffect(() => {
  })

  //添加歌曲
  const addSong = () => {
    let songs = props.songs;

    props.addSong(songs[1], 3)
  }

  //删除歌曲
  const deleteSong = () => {
    let songs = props.songs;

    props.deleteSong([songs[1], songs[2], songs[3]], 1)
  }

  //清空播放列表
  const clearPlaylist = (event) => {
    props.deleteAllSongs()
  }

  //双击播放歌曲
  const playThisSong = (data, index) => {
    console.log('props');
    console.log(props);
    console.log(data);
    console.log(index);
    props.setActiveSong(data)
  }

  useEffect(() => {
    console.log('use effect');
    console.log(props);
  })
  //渲染--渲染歌单列表item
  const ListItem = ({ data, index }) => {
    index += 1;
    index = index < 10 ? "0" + index : index;
    let activeId = props.activeSong?.data?.id ? props.activeSong?.data?.id : null
    return (
      <ul
        className={`content-header fontsize18 canSelectItem ${
          (index - 1) % 2 == 0 ? "backGray" : ""
        } ${activeId == data.id ? "activeListItem" : ""}`}
        tabIndex={index}
        onDoubleClick={playThisSong.bind(this, data, index)}
      >
        <li className="content-header-item flex4">
          <ul className="item-flex">
            <li className="item-flex-item">
              <img src={NoShoucangPng} className="img15" />
            </li>
            <li className="item-flex-item" style={{minWidth: 0}}>
              <p style={{ margin: 0, padding: 0 }}>{data?.name}</p>
            </li>
            {/* <ul className="header-item-right">
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
            </ul> */}
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
  return (
    <div className='playlist'>
      <div style={{height: '50px',lineHeight: '50px', padding: '0px 20px'}}>
        <div style={{display: 'inline-block'}}>
          总共{props.songs.length}首
        </div>
        <Button danger type="text" onClick={clearPlaylist}>清空</Button>
      </div>
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
        <div style={{flex: 1, overflowY: 'auto'}}>
        {(props.songs instanceof Array) && props.songs.map((item, index) => {
            return <ListItem key={item.id + index} data={item} index={index} />;
          })}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    songs: state.playlistReducer.data,
    activeSong: state.playlistReducer.active
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addSong: (data, index) => {
      dispatch(addToPlaylist(data, index));
    },
    deleteSong: (data, index) => {
      dispatch(deleteSong(data, index))
    },
    deleteAllSongs: () => {
      dispatch(deleteAllSongs())
    },
    setActiveSong: data => {
      console.log(dispatch);
      dispatch(setActive(data))
    }
  }
}

const SliderPlaylistContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SliderPlaylist)

export default SliderPlaylistContainer