import './App.less';
import 'antd/dist/antd.css';
import 'moment/locale/zh-cn';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { Button, } from 'antd'
import React, { useEffect } from 'react';
import Login from './Login/Login'
import Home from './Home/Home'
import MusicSlider from './MusicSlider/MusicSlider'
import Search from './Search/Search';
import IconListItem from './widgets/IconListItem/IconListItem';
import Carousel from './widgets/Carousel/Carousel'
import { RouterOutlet } from 'react-easyroute';
import { withRouter, Switch, Route, } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

function App(props) {
  return (
    <ConfigProvider locale={zh_CN}>
      <div className="App">
        {renderRoutes(props.routes)}
        {/* <Login/> */}
        {/* <Search/> */}
        {/* <IconListItem/> */}
        {/* <Carousel/> */}
        {/* <MusicSlider /> */}
        {/* <Home/> */}
        {/* <RouterOutlet/> */}
      </div>
    </ConfigProvider>
  );
}

export default withRouter(App);
