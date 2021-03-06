import Router from 'react-easyroute';
import Login from '../Login/Login'
import Home from '../Home/Home';
import PersonalSuggest from '../Home/PersonalSuggest/PersonalSuggest';
import SubHome from '../Home/SubHome/SubHome';
import Playlist from '../Home/Playlist/Playlist';
import PlaylistDetail from '../Home/Playlist/PlaylistDetail/PlaylistDetail';
import Test from '../Home/Test/Test';
import ArtistDetail from '../Home/Artists/ArtistDetail/ArtistDetail'
import PersonalCenter from '../Home/PersonalCenter/PersonalCenter';
import MVDetail from '../Home/MVDetail/MVDetail';
import VideoDetail from '../Home/VideoDetail/VideoDetail';
import AlbumsDetail from '../Home/NewestSong/AlbumsDetail/AlbumsDetail';


const router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            component: Login,
            name: 'Login'
        },
        {
            path: '/home',
            component: Home,
            name: 'Home',
            children: [
                {
                    path: '/',
                    component: PersonalSuggest,
                    name: 'PersonalSuggest'
                }
            ]
        }
    ]
})

const routes = [
    {
        path: '/',
        exact: true,
        component: Login,
    },
    {
        path: '/home',
        component: Home,
        routes: [
            {
                path: '/home',
                exact: true,
                component: PersonalSuggest,
            },
            {
                path: '/home/:id',
                exact: true,
                component: SubHome,
            },
        ]
    },
    {
        path: '/playlist/:id',
        exact: true,
        component: PlaylistDetail,
    },
    {
        path: '/personal/:id',
        exact: true,
        component: PersonalCenter,
    },
    {
        path: '/personal',
        exact: true,
        component: PersonalCenter,
    },
    {
        path: '/artist/:id',
        exact: true,
        component: ArtistDetail
    },
    {
        path: '/mv/:id',
        exact: true,
        component: MVDetail
    },
    {
        path: '/video/:id',
        exact: true,
        component: VideoDetail
    },
    {
        path: '/album/:id',
        exact: true,
        component: AlbumsDetail
    },

]

export default routes;