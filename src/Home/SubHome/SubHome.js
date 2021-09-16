import React, { useState, useEffect,  } from 'react';
import { useParams } from 'react-router-dom';
import './SubHome.less'
import PersonalSuggest from '../PersonalSuggest/PersonalSuggest'
import Playlist from '../Playlist/Playlist';
import Toplist from '../Toplist/Toplist';
import Artists from '../Artists/Artists';
import NewestSong from '../NewestSong/NewestSong';
import PlaylistDetail from '../Playlist/PlaylistDetail/PlaylistDetail';
import Test from '../Test/Test';
import MusicSlider from '../../MusicSlider/MusicSlider'
import MusicSliderComponent from '../../MusicSlider/MusicSliderComponent';
import ArtistDetail from '../Artists/ArtistDetail/ArtistDetail'
import PersonalCenter from '../PersonalCenter/PersonalCenter';
import Search from '../../Search/Search';
import VideoSlider from '../../VideoSlider/VideoSlider';
import MVDetail from '../MVDetail/MVDetail';
import VideoDetail from '../VideoDetail/VideoDetail';
import Video from '../../Video/Video/Video';
import MV from '../../Video/MV/MV';


export default function SubHome(props) {
    let { id } = useParams();
    useEffect(() => {
    })

    return (
        <div
            className='subhomepage'
        >
            {
                id == 0 ?
                <PersonalSuggest/>
                :
                null
            }
            {
                id == 1 ?
                <Playlist/>
                :
                null
            }
            {
                id == 2 ?
                <Toplist/>
                :
                null
            }
            {
                id == 3?
                <Artists/>
                :
                null
            }
            {
                id!= 0 && id != 1 && id !=2 && id != 3 ?
                // <VideoDetail/>
                // <MVDetail/>
                // <VideoSlider/>
                <NewestSong/>
                // <Video/>
                // <MV/>
                // <Search/>
                // <PlaylistDetail/>
                // <PersonalCenter/>
                // <MusicSliderComponent/>
                // <MusicSlider/>
                // <ArtistDetail/>
                :
                null
            }
        </div>
    )
}