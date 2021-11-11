import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import $ from 'jquery'
import { addToPlaylist, deleteSong, deleteAllSongs, setActive, setSongs, next } from '../../store/actions/playlistActions';
import './ContextMenu.less'
import HTTPUtils from '../../HTTPUtils/HTTPUtils';

function ContextMenu(props) {

  //歌曲评论总数
  const [songCommentsCount, setSongCommentsCount] = useState(0);
  //歌曲详细数据
  const [songData, setSongData] = useState({})

  
  //获取歌曲(们)详情数据
  const getSongsDetail = async (ids) => {
    let song = await HTTPUtils.song_detail({ids});
    return song;
  }
  //获取歌单详情
  const getArtistDetail = async(id, next = false) => {
    let params = {
      id,
    };
    let data = await HTTPUtils.playlist_detail(params);
    //获取所有歌曲id信息
    let ids = data?.playlist.trackIds;
    let idStr = '';
    ids.map(item => {
      idStr = idStr == '' ? item.id : idStr + ',' + item.id
    })
    let song = await getSongsDetail(idStr);
    if((song.songs instanceof Array) && song.songs.length > 0) {
      if(!next) {
        //覆盖全部歌曲, 将获取的歌单所有歌曲, 全部赋给播放列表, 同时设置当前播放歌曲为歌单中第一首歌曲
        props.setAllSong(song.songs);
        props.setActiveSong(song.songs[0]);
      }else {
        props.nextPlay(song.songs)
      }
    }
  }


  //
  useEffect(async() => {
    if(props.type > 0) {
      console.log('传递来的类型type');
      console.log(props.type);
      console.log(props.data);
      if(props.data) {
        if(props.type == 1) {
          //如果右键点击的是歌曲
          if(props.data.id) {
            //并且id有值的情况下
            let params = {
              id: props.data.id
            }
            //获取该歌曲的评论数据
            let data = await HTTPUtils.comment_music(params);
            console.log('歌曲评论');
            console.log(data);
            setSongCommentsCount(data.total)
            //设置歌曲的基本信息
            let song = await getSongsDetail(props.data.id)
            // setSongData(props.data)
            if(song.songs instanceof Array && song.songs.length > 0) {
              console.log('歌曲信息');
              console.log(song.songs[0]);
              setSongData(song.songs[0])
            }
          }
        }else if(props.type == 2) {
          console.log(props.data);
          setSongData(props.data)
        }
      }
    }
  }, [props.type, props.data.id])

  /**
   * context menu item点击事件
   */
  const actionList = (event) => {
    console.log('action list');
    console.log(event);
    $('#contextmenu').hide()
    event.stopPropagation()
    let itemID = event.target.id;
    switch(itemID) {
      case '1':
        console.log('歌曲 查看评论');
        break;
      case '2':
        console.log('歌曲 播放');
        props.addSong(songData)
        props.setActiveSong(songData)
        break;
      case '10':
        console.log('歌曲 播放');
        props.nextPlay(songData)
        break;
      case '3':
        console.log('歌曲 专辑');
        console.log(props.data)
        let albumID = props.data.al ? props.data.al.id : '';
        try {
          //歌单中歌曲专辑信息为props.data.al, 专辑中为props.data.song.album
          if(props.data.hasOwnProperty('song') && props.data.song.hasOwnProperty('album')) {
            albumID = props.data.song.album ? props.data.song.album.id : albumID;
          }
        } catch(e) {

        }
        props.history.push('/album/'+albumID)
        break;
      case '4':
        console.log('歌曲 歌手');
        console.log(props);
        props.history.push('/artist/'+songData.ar[0].id)
        break;
      case '5':
        console.log('歌曲 从列表中删除');
        console.log(songData);
        console.log(props);
        props.deleteSong(songData)
        break;
      case '6':
        console.log('歌单 查看歌单');
        props.history.push('/playlist/'+songData.id)
        break;
      case '7':
        console.log('歌单 播放');
        getArtistDetail(songData.id)
        break;
      case '8':
        console.log('歌单 下一首播放');
        getArtistDetail(songData.id, true)
        break;
      case '9':
        console.log('MV');
        console.log(songData.id);
        console.log(props.data);
        props.history.push('/mv/'+props.data.id)
        break;
      case '11':
        console.log('video');
        console.log(props.data.id);
        props.history.push('/video/'+props.data.id)
        break;
      case '12':
        props.history.push('/album/'+props.data.id)
      default:
        break;
    }
  }

  const Content = () => {
    console.log('content conten t');
    console.log(props.data.delete);
    switch (props.type) {
      case 1:
        return (
          <ul className='actionList'>
            <li className='actionListItem' id='1'>查看评论{songCommentsCount && songCommentsCount > 0 ? '(' + songCommentsCount + ')' : null}</li>
            <li className='actionListItem' id='2'>播放</li>
            <li className='actionListItem' id='10'>下一首播放</li>
            <li className='actionListItem' id='3'>专辑: {songData.al && songData.al?.name}</li>
            <li className='actionListItem' id='4'>歌手: {songData.ar && songData.ar[0]?.name}</li>
            {props.data.delete ?<li className='actionListItem' id='5'>从列表中删除</li> : null}
          </ul>
        )
      case 2:
        return (
          <ul className='actionList'>
            <li className='actionListItem' id='6'>查看歌单</li>
            <li className='actionListItem' id='7'>播放</li>
            <li className='actionListItem' id='8'>下一首播放</li>
          </ul>
        )
      case 3:
        return(
          <ul className='actionList'>
            <li className='actionListItem' id='9'>播放MV</li>
          </ul>
        )
      case 4:
        return(
          <ul className='actionList'>
            <li className='actionListItem' id='11'>播放视频</li>
          </ul>
        )
      case 5:
        return (
          <ul className='actionList'>
            <li className='actionListItem' id='12'>查看专辑</li>
          </ul>
        )
      default:
        return null
    }
  }

  return (
    <div className='contextmenu' onClick={actionList}>
      <Content />
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
    addSong: (data) => {
      dispatch(addToPlaylist(data))
    },
    deleteSong: data => {
      dispatch(deleteSong(data));
    },
    deleteAllSongs: () => {
      dispatch(deleteAllSongs())
    },
    setActiveSong: data => {
      dispatch(setActive(data))
    },
    setAllSong: data => {
      dispatch(setSongs(data))
    },
    nextPlay: data => {
      dispatch(next(data))
    }
  }
}

const ContextMenuContainer = connect(mapStateToProps, mapDispatchToProps)(ContextMenu);

export default withRouter(ContextMenuContainer);