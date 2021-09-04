import React, { useState, useEffect, useRef, } from 'react';
import { Input, message, Button, } from 'antd';
import HTTPUtils from '../HTTPUtils/HTTPUtils';
import './Search.less';
import $ from 'jquery'
/**
 *
 *
 * @export 搜索框组件
 * @param {*} props
 * @return {*} 
 */
export default function Search(props) {
    const searchRef = useRef();
    //state---默认搜索词--placeholder
    const [searchDefault, setSearchDefault] = useState({
        realkeyword: '',
        showKeyword: ''
    })
    //state---搜索keyword
    const [searchKeyword, setSearchKeyword] = useState('')
    //state---热搜列表
    const [searchHot, setSearchHot] = useState([]);
    //state---搜索input是否聚焦
    const [isSearchFocus, setIsSearchFocus] = useState(false);

    //search focus 时,获取热搜列表
    useEffect(async () => {
        await search_default();
        // searchRef.current.focus();
        // console.log(searchRef.current.onBlur())
    }, [searchDefault.showKeyword]);

    //search input keyword改变所触发的事件
    useEffect(async () => {
        if (searchKeyword) {
            await search_suggest();
        }else {
            await search_hot();
        }
    }, [searchKeyword])
    //search input focus触发事件
    useEffect(async () => {
        if (isSearchFocus) {
            if (searchKeyword) {
                await search_suggest();
            } else {
                await search_hot();
            }
        }
    }, [isSearchFocus])
    //事件---默认搜索词
    const search_default = async () => {
        let data = await HTTPUtils.search_default();
        // console.log(data)
        setSearchDefault({
            realkeyword: data.data.realkeyword,
            showKeyword: data.data.showKeyword,
        })
    }

    //事件---热搜列表
    const search_hot = async () => {
        let data = await HTTPUtils.search_hot();
        setSearchHot(data.result.hots)
    }

    //事件---搜索聚焦
    const searchFocus = async () => {
        setIsSearchFocus(true)
        // await search_hot();
    }

    //事件---搜索失去焦点
    const searchBlur = async () => {
        // setIsSearchFocus(false)
    }

    //事件---点击search_list_item
    const list_item_click = async (value) => {
        setSearchKeyword(value)
        console.log('ppp');
        setIsSearchFocus(false)
    }

    //事件---search enter
    const searchEnter = async () => {
        // console.log(searchKeyword)
    }

    //事件---search input onChange
    const searchChange = async (e) => {
        let value = e.target.value
        setSearchKeyword(value)
    }

    //事件---请求搜索建议
    const search_suggest = async () => {
        let obj = {
            keywords: searchKeyword,
        }
        let search_hot = [];
        let data = await HTTPUtils.search_suggest(obj)
        // console.log(data.result.playlists)
        console.log(data.result.songs)
        // console.log(data.result.albums)
        // console.log(data.result.artists)
        let res = data.result;
        if (res.songs) {
            let len = search_hot.length;
            search_hot[len] = {}
            search_hot[len].type = 'songs';
            search_hot[len].category = '歌曲';
            search_hot[len].list = [];
            res.songs.map((item, index) => {
                let list_item = {};
                list_item.id = item.id;
                list_item.title = item.name + '-' + item.artists[0].name;
                search_hot[len].list.push(list_item);
            })
        }
        if(res.albums) {
            let len = search_hot.length;
            let item = {};
            item.type = 'albums';
            item.category = '专辑';
            item.list = [];
            res.albums.map(zItem => {
                let list_item = {};
                list_item.id = zItem.id;
                list_item.title = zItem.name + '-' + zItem.artist.name;
                // console.log(item)
                // console.log(item.list instanceof Array)
                item.list.push(list_item);
            })
            search_hot[len] = item;
        }
        if(res.artists) {
            let len = search_hot.length;
            let item = {};
            item.type = 'artists';
            item.category = '歌手';
            item.list = [];
            res.artists.map(zItem => {
                let list_item = {};
                list_item.id = zItem.id;
                list_item.title = zItem.name;
                item.list.push(list_item)
            })
            search_hot[len] = item;
        }
        if(res.playlists) {
            let len = search_hot.length;
            let item = {};
            item.type = 'playlists';
            item.category = '歌单';
            item.list = [];
            res.playlists.map(zItem => {
                let list_item = {};
                list_item.id = zItem.id;
                list_item.title = zItem.name;
                item.list.push(list_item)
            })
            search_hot[len] = item
        }
        setSearchHot(search_hot)
    }
    //渲染---不同情况下的热搜列表
    const renderHotItem = (item) => {
        // console.log(item)
        if (!item.type) {
            return (
                <p
                    style={{ paddingLeft: 10 }}
                    className='p_no_pad p_line_height'
                    onClick={() => list_item_click(item.first)}
                >
                    {item.first}
                </p>
            )
        }
        return (
            <div className='hot_arr_item' style={{ display: 'flex', flexDirection: 'row' }}>
                <p style={{ flex: 1 }} className='p_line_height p_center'>
                    {item.category}
                </p>
                <div style={{ flex: 3, flexDirection: 'column', borderBottom: '1px solid gray' }}>
                    {
                        item.list.length && item.list.map((zItem, zIndex) => {
                            return (
                                <p
                                    key={zItem.id}
                                    style={{ paddingLeft: 10 }}
                                    className='p_no_pad p_line_height'
                                    onClick={() => list_item_click(zItem.title)}
                                >
                                    {zItem.title}
                                </p>
                            )
                        })
                    }
                </div>
            </div>
        )

    }
    return (
        <div>
            <div
                className='header'
            >
                <div className='header_search'>
                    <Input
                        ref={searchRef}
                        placeholder={searchDefault.showKeyword}
                        value={searchKeyword}
                        style={{ width: '350px', height: '40px', borderRadius: '10px' }}
                        allowClear
                        onFocus={searchFocus} onBlur={searchBlur}
                        onChange={searchChange}
                        onPressEnter={searchEnter}
                    />
                    <div className={`header_search_list ${isSearchFocus ? 'header_search_list_active' : null}`}>
                        {
                            searchHot.length > 0 && searchHot.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className='header_search_list_item'
                                    >
                                        {renderHotItem(item)}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}