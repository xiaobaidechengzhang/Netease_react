import React, { useState, useEffect, useRef, } from 'react';
import { Input, message, Button, Slider, } from 'antd';
import HTTPUtils from '../HTTPUtils/HTTPUtils';
import './Home.less';
import PersonalSuggest from './PersonalSuggest/PersonalSuggest';
import SubHome from './SubHome/SubHome';
import { RouterOutlet } from 'react-easyroute';
import { Route, Switch, Link, useParams } from 'react-router-dom'
import { renderRoutes } from 'react-router-config';
import $ from 'jquery'
const paths = {
    '/home/0': 0,
    '/home/1': 1,
    '/home/2': 2,
    '/home/3': 3,
    '/home/4': 4,
}
/**
 *
 *
 * @export
 * @param {*} props
 * @return {*} 
 */
export default function Home(props) {
    const [homeTags, setHomeTags] = useState(['个性推荐', '歌单', '排行榜', '歌手', '最新音乐']);       //首页tags
    const [activeHomeTag, setActiveHomeTag] = useState('0');            //当前active的home tag
    useEffect(() => {
        console.log(props.route.routes);
        let pathname = props.location.pathname;
        setActiveHomeTag(paths[pathname])
    })
    /**
     * 
     * @param {type: String} type : 0: 个性推荐; 1: 歌单; 2: 排行榜; 3: 歌手; 4: 最新音乐
     */
    const clickHomeTag = (type) => {
        setActiveHomeTag(type)
    }
    return (
        <div
        >
            <div
                className='catHeader'
            >
                {
                    homeTags.map((item, index) => {
                        return (
                            <Link
                                key={index}
                                className={`${activeHomeTag == index ? 'activeCatHeaderItem' : ''} catHeaderItem`}
                                onClick={() => clickHomeTag(index)}
                                to={`/home/${index}`}
                            >
                                {item}
                            </Link>
                        )
                    })
                }
            </div>
            {renderRoutes(props.route.routes)}
            {/* <Switch>
                <Route exact path='/'>
                    <PersonalSuggest/>
                </Route>
                <Route path='/:id'>
                    <SubHome/>
                </Route>
            </Switch> */}
            
        </div>
    )
}