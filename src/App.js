import './App.less';
import 'antd/dist/antd.css';
import 'moment/locale/zh-cn';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { Button, } from 'antd'
import React, { useEffect, useState } from 'react';
import Login from './Login/Login'
import Home from './Home/Home'
import MusicSlider from './MusicSlider/MusicSlider'
import ContextMenu from './widgets/ContextMenu/ContextMenu';
import Search from './Search/Search';
import IconListItem from './widgets/IconListItem/IconListItem';
import Carousel from './widgets/Carousel/Carousel'
import { RouterOutlet } from 'react-easyroute';
import { withRouter, Switch, Route, } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import $ from 'jquery'

function App(props) {
  const [showSlider, setShowSlider] = useState(true);
  //传给context menu的数据
  const [contextMenuData, setContextMenuData] = useState({})
  //context menu的类型, type: 1为歌曲; 2为歌单; 3为MV
  const [contextMenuType, setContextMenuType] = useState(0)
  useEffect(() => {
    if (props.location.pathname == '/') {
      //此时页面为登录页面, 所以不显示播放条
      setShowSlider(false);
    } else {
      setShowSlider(true)
    }
  }, [props.location])
  useEffect(() => {
    document.addEventListener('contextmenu', function (event) {

      //是否是歌曲elem, 通过判断点击的elem或其父元素中是否有类名为is_song, 如果其中一个有, 那么当前点击的elem为歌曲elem;
      let is_song = $(event.target).parents('.is_song').length > 0 || $(event.target).hasClass('is_song')

      //判断是否是歌单elem, 同样的判断方式, 来判断是否有类名is_playlist,
      let is_playlist = $(event.target).parents('.is_playlist').length > 0 || $(event.target).hasClass('is_playlist')

      //判断是否是MV, 同样的方式, 来判断是否有类名is_mv;
      let is_mv = $(event.target).parents('.is_mv').length > 0 || $(event.target).hasClass('is_mv');

      if(is_song || is_playlist || is_mv) {

        event.preventDefault();

        let menuTransferData = null;

        //获取歌曲数据
        let songData = $(event.target).hasClass('is_song') ? $(event.target).data('song') : $(event.target).parents('.is_song').data('song')
        // songData = JSON.parse(songData)
        console.log('歌曲数据');
        console.log(typeof songData);
        console.log(songData);

        //获取歌单数据
        let playlistId = $(event.target).hasClass('is_playlist') ? $(event.target).data('playlist') : $(event.target).parents('.is_playlist').data('playlist')
        let playlistData = {id: playlistId};

        //设置需要传递给context menu的类型和数据
        let type = is_song ? 1 : (is_playlist ? 2 : 3)
        menuTransferData = is_song ? songData : (is_playlist ? playlistData : {})
        menuTransferData.delete = false;
        let can_delete = false;
        if(is_song) {
          let have_sliderplay_class = $(event.target).hasClass('.is_sliderplaylist') || $(event.target).parents('.is_sliderplaylist').length > 0;
          console.log('是否可删除');
          console.log(have_sliderplay_class);
          can_delete = have_sliderplay_class
          //menuTransferData的delete字段 主要是为了歌曲的context menu中有没有从列表中删除选项, delete: true为有从列表中删除选项; false为没有从列表中删除选项
          menuTransferData.delete = have_sliderplay_class;
        }
        console.log('menu transfer data');
        console.log(menuTransferData);

        //获取鼠标的位置, clientX: 距离浏览器可视区域左边的距离; clientY: 距离浏览器可视区域顶部的距离
        let left = event.clientX;
        let top = event.clientY;

        //滚动的高度
        let scrollTop = $(document).scrollTop();

        //页面左右滚动的距离
        let scrollLeft = $(document).scrollLeft();

        //不同类型, context menu的高度高通
        let relative_type_height = type == 1 ? (can_delete ? 310 : 260) : (type == 2 ? 160 : 60)

        //将自定义的context menu的left和top设为鼠标的位置, top和left都要加上scrollTop和scrollLeft, 否则滚动后, context menu位置不对
        //下面要解决的问题: 如果鼠标位置距离底部/顶部/左边/右边距离小于自定义的context menu的高/宽, 那么要重新调整自定义context menu的位置
        //首先获取距离浏览器右边距离是否小于自定义context menu的宽度200,
        //这里需要用到#root根元素的宽度, #root的宽度是固定的, 不像document的宽/高不是固定的, $(document).height() -- 等同与 scrollHeight()
        let is_shorter_contextmenu_width = left + scrollLeft + 210 > $('#root').width();
        if(is_shorter_contextmenu_width) {
          //如果超过document的宽度, 那么left就反向朝左显示
          left -= 210
        }

        //然后获取距离浏览器底部距离是否小于自定义context menu的高度400;
        let is_shorter_contextmenu_height = top  + relative_type_height > $('#root').height();
        console.log(is_shorter_contextmenu_height);
        console.log(top);
        if(is_shorter_contextmenu_height) {
          //如果超过document的高度, 那么top就反方向朝上显示
          top -= relative_type_height;
        }
        //设置context menu 的位置和elem的高度
        console.log('css 信息');
        console.log(left);
        console.log(scrollLeft);
        console.log(top);
        console.log(scrollTop);
        console.log(relative_type_height);
        console.log($('#root').height());
        $('#contextmenu').css({left: left+ scrollLeft + 10, top: top + scrollTop + 10, height: relative_type_height})
        setContextMenuType(type)
        setContextMenuData(menuTransferData)
        $('#contextmenu').show()
        //显示的时候, 需要将焦点设为自定义的context menu
        $('#contextmenu').focus()
      }else {
        $('#contextmenu').hide()
      }
    })
    //自定义context menu失去焦点后, 需要将context menu隐藏, 注意: 触发blur事件的前提: 需要elem首先focus, (不是input select, textarea的元素如果需要focus, 必须添加tabIndex)
    $('#contextmenu').blur(function() {
      $(this).hide()
    })
  }, [])
  return (
    <ConfigProvider locale={zh_CN}>
      <div className="App" style={{ position: 'relative' }}>
        {renderRoutes(props.routes)}
        {/* <Login/> */}
        {/* <Search/> */}
        {/* <IconListItem/> */}
        {/* <Carousel/> */}
        {/* <MusicSlider /> */}
        {/* <Home/> */}
        {/* <RouterOutlet/> */}
        {showSlider ? <div style={{ height: 120 }}>

        </div> : null}
        {showSlider ? <div style={{ position: 'fixed', width: '100%', height: 100, backgroundColor: 'blue', bottom: '0', left: 0, boxShadow: '0 0 5px #ccc', zIndex: 100 }}>
          <MusicSlider />
        </div> : null}
        <div id="contextmenu" tabIndex='1'>
          <ContextMenu type={contextMenuType} data={contextMenuData}/>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default withRouter(App);
