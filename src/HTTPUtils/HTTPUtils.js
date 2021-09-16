import Http from './HTTP';

let HTTPUtils = {};
//请求网址
let server = 'http://localhost:3000';

//登录
let Login = server + '/login';
//验证码
let Captcha = server + '/captcha';
//注册
let Register = server + '/register';
//手机号是否注册
let IsExist = server + '/cellphone/existence/check';
//初始化昵称
let InitName = server + '/activate/init/profile';
//更换绑定手机
let Rebind = server + '/rebind';
//退出登录
let Logout = server + '/logout';
//用户
let User = server + '/user';
//歌单
let Playlist = server + '/playlist'
//歌曲
let Song = server + '/song';
//动态
let Event = server + '/event';
//分享
let Share = server + '/share';
//评论
let Comment = server + '/comment';
//关注
let Follow = server + '/follow';
//热门
let Hot = server + '/hot';
//歌手
let Artist = server + '/artist';
//视频
let Video = server + '/video';
//MV
let MV = server + '/mv';

let Topic = server + '/topic';
//精品
let Top = server + '/top';
//相关推荐
let Related = server + '/related';
//搜索
let Search = server + '/search';
//歌词
let Lyric = server + '/lyric';
//首页
let Homepage = server + '/homepage';
//专辑
let Album = server + '/album';
//相似
let Simi = server + '/simi';
//推荐
let Recommend = server + '/recommend';
//喜欢
let Like = server + '/like';
//推荐
let Personalized = server + '/personalized';
//榜单
let Toplist = server + '/toplist'
//电台
let Dj = server + '/dj';
//通知
let Msg = server + '/msg';
//发送
let Send = server + '/send';

//首页接口---------------------------------------------------------------------
//首页--发现
HTTPUtils.home_block_page = async function(obj) {
    let url = Homepage + '/block/page';
    let data = await Http.Get(url, obj);
    return data;
}
//首页--发现--圆形图标接口
HTTPUtils.home_dragon_ball = async function() {
    let url = Homepage + '/dragon/ball';
    let data = await Http.Get(url);
    return data;
}
//获取banner数据
HTTPUtils.banner = async function(obj) {
    let url = server + '/banner';
    let data = await Http.Get(url, obj);
    return data;
}


//登录相关接口------------------------------------------------------------------------------------------------------------
//获取登录状态
HTTPUtils.login_status = async function() {
    let url = Login + '/status';
    let data = await Http.Get(url);
    return data;
}
//手机登录
/**
 * 
 * @param {obj: Object} obj : 必选参数: phone: 手机号; password: 密码
 */
HTTPUtils.login_cellphone = async function(obj) {
    let url = Login + '/cellphone';
    let data = await Http.Get(url, obj);
    return data;
}
//邮箱登录
/**
 * 
 * @param {obj: Object} obj : 必选参数: email: 邮箱; password: 密码;
 */
HTTPUtils.login = async function(obj) {
    let url = Login;
    let data = await Http.Get(url, obj);
    return data;
}
///二维码登录
//二维码登录生成key
HTTPUtils.login_qr_key = async function() {
    let url = Login + '/qr/key';
    let data = await Http.Get(url);
    return data;
}
//二维码登录-生成二维码
HTTPUtils.login_qr_create = async function(obj) {
    let url = Login + '/qr/create';
    let data = await Http.Get(url, obj);
    return data;
}
//二维码登录-检查二维码
HTTPUtils.login_qr_check = async function(obj) {
    let url = Login + '/qr/check';
    let data = await Http.Get(url, obj);
    return data;
}
//刷新登录状态
HTTPUtils.login_refresh = async function() {
    let url = Login + '/refresh';
    let data = await Http.Get(url);
    return data;
}
//发送手机验证码
HTTPUtils.captcha_sent = async function(obj) {
    let url = Captcha + '/sent';
    let data = await Http.Get(url, obj);
    return data;
}
//验证手机验证码
HTTPUtils.captcha_verify = async function(obj) {
    let url = Captcha + '/verify';
    let data = await Http.Get(url, obj);
    return data;
}
//注册(修改密码)
HTTPUtils.register_cellphone = async function(obj) {
    let url = Register + '/cellphone';
    let data = await Http.Get(url, obj);
    return data;
}
//检测手机是否已经注册
HTTPUtils.isExist = async function(obj) {
    let url = IsExist;
    let data = await Http.Get(url, obj);
    return data;
}
//初始化昵称
HTTPUtils.initName = async function(obj) {
    let url = InitName;
    let data = await Http.Get(url, obj);
    return data;
}
//更换绑定手机
HTTPUtils.rebind = async function(obj) {
    let url = Rebind;
    let data = await Http.Get(url, obj);
    return data;
}
//退出登录
HTTPUtils.logout = async function() {
    let url = Logout;
    let data = await Http.Get(url);
    return data;
}








//用户相关接口----------需登录---------------------------------------------------------------------------------------------
//用户详情--需登录
HTTPUtils.user_detail = async function(obj) {
    let url = User + '/detail';
    let data = await Http.Get(url, obj);
    return data;
}
//用户账号信息--需登录
HTTPUtils.user_account = async function() {
    let url = User + '/account';
    let data = await Http.Get(url);
    return data;
}
//获取用户信息 , 歌单，收藏，mv, dj 数量--需登录
HTTPUtils.user_subcount = async function() {
    let url = User + '/subcount';
    let data = await Http.Get(url);
    return data;
}
//获取用户等级信息,包含当前登录天数,听歌次数,下一等级需要的登录天数和听歌次数,当前等级进度---需登录
HTTPUtils.user_level = async function() {
    let url = User + '/level';
    let data = await Http.Get(url);
    return data;
}
//获取用户绑定信息--需登录
HTTPUtils.user_binding = async function(obj) {
    let url = User + '/binding';
    let data = await Http.Get(url, obj);
    return data;
}
//用户更改绑定手机---需登录
HTTPUtils.user_replacephone = async function(obj) {
    let url = User + '/replacephone';
    let data = await Http.Get(url, obj);
    return data;
}
//更新用户信息
HTTPUtils.user_update = async function(obj) {
    let url = User + '/update';
    let data = await Http.Get(url, obj);
    return data;
}
//更新用户头像
HTTPUtils.user_avatar_upload = async function(obj) {
    let url = server + '/avatar/upload';
    let data = await Http.Post(url, obj);
    return data;
}
//国家编码列表
HTTPUtils.countries_list = async function() {
    let url = server + '/countries/code/list';
    let data = await Http.Get(url);
    return data;
}
//获取用户歌单
HTTPUtils.user_playlist = async function(obj) {
    let url = User + '/playlist';
    let data = await Http.Get(url, obj);
    return data;
}
//更新用户歌单
HTTPUtils.user_update_playlist = async function(obj) {
    let url = Playlist + '/update';
    let data = await Http.Get(url, obj);
    return data;
}
//更新用户歌单描述
HTTPUtils.user_playlist_desc = async function(obj) {
    let url = Playlist + 'desc/update';
    let data = await Http.Get(url, obj);
    return data;
}
//更新用户歌单名字
HTTPUtils.user_update_playlist_name = async function(obj) {
    let url = Playlist + '/name/update';
    let data = await Http.Get(url, obj);
    return data;
}
//更新用户歌单标签
HTTPUtils.user_update_playlist_tag = async function(obj) {
    let url = Playlist + '/tags/update';
    let data = await Http.Get(url, obj);
    return data;
}
//更新用户歌单封面
HTTPUtils.user_update_playlist_cover = async function(obj) {
    let url = Playlist + '/cover/update';
    let data = await Http.Get(url, obj);
    return data;
}
//调整用户歌单顺序
HTTPUtils.user_update_playlist_order = async function(obj) {
    let url = Playlist + '/order/update';
    let data = await Http.Get(url, obj);
    return data;
}
//调整用户歌单中歌曲顺序
HTTPUtils.user_update_song_order = async function(obj) {
    let url = Song + '/order/update';
    let data = await Http.Get(url, obj);
    return data;
}
//获取用户电台
HTTPUtils.user_dj = async function(obj) {
    let url = User + '/dj';
    let data = await Http.Get(url, obj);
    return data;
}
//获取用户关注列表
HTTPUtils.user_follows = async function(obj) {
    let url = User + '/follows';
    let data = await Http.Get(url, obj);
    return data;
}
//获取用户粉丝列表
HTTPUtils.user_followeds = async function(obj) {
    let url = User + '/followeds';
    let data = await Http.Get(url, obj);
    return data;
}
//获取用户动态
HTTPUtils.user_event = async function(obj) {
    let url = User + '/event';
    let data = await Http.Get(url, obj);
    return data;
}
//转发用户动态
HTTPUtils.user_forward_event = async function(obj) {
    let url = Event + '/forward';
    let data = await Http.Get(url, obj);
    return data;
}
//删除用户动态
HTTPUtils.user_del_event = async function(obj) {
    let url = Event + '/del';
    let data = await Http.Get(url, obj);
    return data;
}
//分享歌曲、歌单、mv、电台、电台节目到动态
HTTPUtils.user_share_to_event = async function(obj) {
    let url = Share + '/resource';
    let data = await Http.Get(url, obj);
    return data;
}
//获取动态评论
HTTPUtils.event_comment = async function(obj) {
    let url = Comment + '/event';
    let data = await Http.Get(url, obj);
    return data;
}
//关注/取消关注用户
HTTPUtils.follow = async function(obj) {
    let url = Follow;
    let data = await Http.Get(url, obj);
    return data;
}
//获取用户播放记录
HTTPUtils.user_record = async function(obj) {
    let url = User + '/record';
    let data = await Http.Get(url, obj);
    return data;
}


//播放模式-------------------需登录--------------------------------------------------------------------------------------
//心动模式/智能模式
HTTPUtils.mode_intelligence = async function(obj) {
    let url = server + '/playmode/intelligence/list';
    let data = await Http.Get(url, obj);
    return data;
}
//动态---------------------不需要登录----------------------------------------------------------------------------------
//获取各种动态
HTTPUtils.event = async function(obj) {
    let url = Event;
    let data = await Http.Get(url, obj);
    return data;
}


//===不需要登录====
//获取热门话题
HTTPUtils.hot_topic = async function(obj) {
    let url = Hot + '/topic';
    let data = await Http.Get(url);
    return data;
}


//歌手相关接口--------------------------------------------------------------------------------------
//歌手分类列表
HTTPUtils.artist_list = async function(obj) {
    let url = Artist + '/list';
    let data = await Http.Get(url, obj);
    return data;
}
//收藏/取消收藏歌手--需登录
HTTPUtils.artist_sub = async function(obj) {
    let url = Artist + '/sub';
    let data = await Http.Get(url, obj);
    return data;
}
//某个歌手热门50首歌曲
HTTPUtils.artist_top_song = async function(obj) {
    let url = Artist + '/top/song';
    let data = await Http.Get(url, obj);
    return data;
}
//歌手全部歌曲
HTTPUtils.artist_songs = async function(obj) {
    let url = Artist + '/songs';
    let data = await Http.Get(url, obj);
    return data;
}
//获取歌手单曲(可获得歌手部分信息和热门歌曲)
HTMLPictureElement.artists = async function(obj) {
    let url = server + '/artists';
    let data = await Http.Get(url, obj);
    return data;
}
//获取歌手MV
HTTPUtils.artist_mv = async function(obj) {
    let url = Artist + '/mv';
    let data = await Http.Get(url, obj);
    return data;
}
//获取歌手专辑
HTTPUtils.artist_album = async function(obj) {
    let url = Artist + '/album';
    let data = await Http.Get(url, obj);
    return data;
}
//获取歌手描述
HTTPUtils.artist_desc = async function(obj) {
    let url = Artist + '/desc';
    let data = await Http.Get(url, obj);
    return data;
}
//获取歌手详情
HTTPUtils.artist_detail = async function(obj) {
    let url = Artist + '/detail';
    let data = await Http.Get(url, obj);
    return data;
}
//关注歌手新歌
HTTPUtils.artist_new_song = async function(obj) {
    let url = Artist + '/new/song';
    let data = await Http.Get(url, obj);
    return data;
}
//关注歌手mv
HTTPUtils.artist_new_mv = async function(obj) {
    let url = Artist + '/new/mv';
    let data = await Http.Get(url, obj);
    return data;
}







//收藏系列接口-----------------------------------------------需登录------------------------
//收藏的歌手列表---需登录
HTTPUtils.artist_sublist = async function() {
    let url = Artist + '/sublist';
    let data = await Http.Get(url);
    return data;
}
//收藏专栏---需登录
HTTPUtils.topic_sublist = async function(obj) {
    let url = Topic + '/sublist';
    let data = await Http.Get(url, obj);
    return data;
}
//收藏视频
HTTPUtils.video_sub = async function(obj) {
    let url = Video + '/sub';
    let data = await Http.Get(url, obj);
    return data;
}
//收藏/取消收藏MV
HTTPUtils.mv_sub = async function(obj) {
    let url = MV + '/sub';
    let data = await Http.Get(url, obj);
    return data;
}


//歌单系列接口----------------------------------------------------------------------------------
//歌单分类
HTTPUtils.playlist_catlist = async function() {
    let url = Playlist + '/catlist';
    let data = await Http.Get(url);
    return data;
}
//热门歌单分类
HTTPUtils.playlist_hot = async function() {
    let url = Playlist + '/hot';
    let data = await Http.Get(url);
    return data;
}
//歌单(网友精选碟)
HTTPUtils.top_playlist = async function(obj) {
    let url = Top + '/playlist';
    let data = await Http.Get(url, obj);
    return data;
}
//精品歌单标签列表
HTTPUtils.playlist_highquality_tags = async function(obj) {
    let url = Playlist + '/highquality/tags';
    let data = await Http.Get(url, obj);
    return data;
}
//获取精品歌单
HTTPUtils.top_playlist_highquality = async function(obj) {
    let url = Top + '/playlist/highquality';
    let data = await Http.Get(url, obj);
    return data;
}
//相关歌单推荐
HTTPUtils.related_playlist = async function(obj) {
    let url = Related + '/playlist';
    let data = await Http.Get(url, obj);
    return data;
}
//获取歌单详情
HTTPUtils.playlist_detail = async function(obj) {
    let url = Playlist + '/detail';
    let data = await Http.Get(url, obj);
    return data;
}
//获取歌单中音乐url
HTTPUtils.song_url = async function(obj) {
    let url = Song + '/url';
    let data= await Http.Get(url, obj);
    return data;
}
//获取歌曲详情
HTTPUtils.song_detail = async function(obj) {
    let url = Song + '/detail';
    let data = await Http.Get(url, obj);
    return data;
}
//检查音乐是否可用
HTTPUtils.check_music = async function(obj) {
    let url = server + '/check/music';
    let data = await Http.Get(url, obj);
    return data;
}
//新建歌单
HTTPUtils.playlist_create = async function(obj) {
    let url = Playlist + '/create';
    let data = await Http.Get(url, obj);
    return data;
}
//删除歌单
HTTPUtils.playlist_delete = async function(obj) {
    let url = Playlist + '/delete';
    let data = await Http.Get(url, obj);
    return data;
}
//收藏/取消收藏歌单
HTTPUtils.playlist_subscribe = async function(obj) {
    let url = Playlist + '/subscribe';
    let data = await Http.Get(url, obj);
    return data;
}
//歌单收藏者--需登录
HTTPUtils.playlist_subscribers = async function(obj) {
    let url = Playlist + '/subscribers';
    let data = await Http.Get(url, obj);
    return data;
}
//对歌单添加/删除歌曲
HTTPUtils.playlist_tracks = async function(obj) {
    let url = Playlist + '/tracks';
    let data = await Http.Get(url, obj);
    return data;
}
//收藏视频到视频歌单---需登录
HTTPUtils.playlist_track_add = async function(obj) {
    let url = Playlist + '/track/add';
    let data = await Http.Get(url, obj);
    return data;
}
//删除视频歌单里的视频---需登录
HTTPUtils.playlist_track_delete = async function(obj) {
    let url = Playlist + '/track/delete';
    let data = await Http.Get(url, obj);
    return data;
}
//最近播放的视频---需登录
HTTPUtils.playlist_video_recent = async function() {
    let url = Playlist + '/video/recent';
    let data = await Http.Get(url);
    return data;
}

//歌词------------------------------------------------------------------------
//获取歌词
HTTPUtils.lyric = async function(obj) {
    let url = Lyric;
    let data = await Http.Get(url, obj);
    return data;
}

//新歌速递
HTTPUtils.top_song = async function(obj) {
    let url = Top + '/song';
    let data = await Http.Get(url, obj);
    return data;
}



//搜索相关接口---------------------------------------------
//搜索
HTTPUtils.search = async function(obj) {
    let url = Search;
    let data = await Http.Get(url, obj);
    return data;
}
//默认搜索关键词
HTTPUtils.search_default = async function() {
    let url = Search + '/default';
    let data = await Http.Get(url);
    return data;
}
//热搜列表(简略)
HTTPUtils.search_hot = async function() {
    let url = Search + '/hot';
    let data = await Http.Get(url);
    return data;
}
//热搜列表(详细)
HTTPUtils.search_hot_detail = async function() {
    let url = Search + '/hot/detail';
    let data = await Http.Get(url);
    return data;
}
//搜索建议
HTTPUtils.search_suggest = async function(obj) {
    let url = Search + '/suggest';
    let data = await Http.Get(url, obj);
    return data;
}
//搜索多重匹配
HTTPUtils.search_multimatch = async function(obj) {
    let url = Search + '/multimatch';
    let data = await Http.Get(url, obj);
    return data;
}



//评论相关接口-----------------------------------------------------------------------
//获取歌曲评论
HTTPUtils.comment_music = async function(obj) {
    let url = Comment + '/music';
    let data = await Http.Get(url, obj);
    return data;
}
//楼层评论
HTTPUtils.comment_floor = async function(obj) {
    let url = Comment + '/floor';
    let data = await Http.Get(url, obj);
    return data;
}
//专辑评论
HTTPUtils.comment_album = async function(obj) {
    let url = Comment + '/album';
    let data = await Http.Get(url, obj);
    return data;
}
//歌单评论
HTTPUtils.comment_playlist = async function(obj) {
    let url = Comment + '/playlist';
    let data = await Http.Get(url, obj);
    return data;
}
//MV评论
HTTPUtils.comment_mv = async function(obj) {
    let url = Comment + '/mv';
    let data = await Http.Get(url, obj);
    return data;
}
//电台节目评论
HTTPUtils.comment_dj = async function(obj) {
    let url = Comment + '/dj';
    let data = await Http.Get(url, obj);
    return data;
}
//视频评论
HTTPUtils.comment_video = async function(obj) {
    let url = Comment + '/video';
    let data = await Http.Get(url, obj);
    return data;
}
//热门评论
HTTPUtils.comment_hot = async function(obj) {
    let url = Comment + '/hot';
    let data = await Http.Get(url, obj);
    return data;
}
//新版评论接口
HTTPUtils.comment_new = async function(obj) {
    let url = Comment + '/new';
    let data = await Http.Get(url, obj);
    return data;
}
//给评论点赞---需登录
HTTPUtils.comment_like = async function(obj) {
    let url = Comment + '/like';
    let data = await Http.Get(url, obj);
    return data;
}
//抱一抱评论
HTTPUtils.hug_comment = async function(obj) {
    let url = server + '/hut/comment';
    let data = await Http.Get(url, obj);
    return data;
}
//评论抱一抱列表
HTTPUtils.comment_hug_list = async function(obj) {
    let url = Comment + '/hug/list';
    let data = await Http.Get(url, obj);
    return data;
}
//发送/删除评论--------------注意：如给动态发送评论，则不需要传 id，需要传动态的 threadId
HTTPUtils.comment = async function(obj) {
    let url = Comment;
    let data = await Http.Get(url, obj);
    return data;
}
//云村热评
HTTPUtils.comment_hotwall = async function(obj) {
    let url = Comment + '/hotwall/list';
    let data = await Http.Get(url, obj);
    return data;
}

//点赞-------
//资源点赞(MV, 电台, 视频)
HTTPUtils.resource_like = async function(obj) {
    let url = server + '/resource/like';
    let data = await Http.Get(url, obj);
    return data;
}
//获取点赞过的视频
HTTPUtils.playlist_mylike = async function() {
    let url = Playlist + '/mylike';
    let data = await Http.Get(url);
    return data;
}



//专辑相关接口-------------------------------------------------
//获取专辑内容
HTTPUtils.album = async function(obj) {
    let url = Album;
    let data = await Http.Get(url, obj);
    return data;
}
//专辑动态信息
HTTPUtils.album_detail_dynamic = async function(obj) {
    let url = Album + '/detail/dynamic';
    let data = await Http.Get(url, obj);
    return data;
}
//收藏/取消收藏专辑
HTTPUtils.album_sub = async function(obj) {
    let url = Album + '/sub';
    let data = await Http.Get(url, obj);
    return data;
}
//获取已收藏专辑列表
HTTPUtils.album_sublist = async function(obj) {
    let url = Album + '/sublist';
    let data = await Http.Get(url, obj);
    return data;
}




//相似相关接口-----------------------------------------------------------------------
//获取相似歌手
HTTPUtils.simi_artist = async function(obj) {
    let url = Simi + '/artist';
    let data = await Http.Get(url, obj);
    return data;
}
//获取相似歌单
HTTPUtils.simi_playlist = async function(obj) {
    let url = Simi + '/playlist';
    let data = await Http.Get(url, obj);
    return data;
}
//获取相似mv
HTTPUtils.simi_mv = async function(obj) {
    let url = Simi + '/mv';
    let data = await Http.Get(url, obj);
    return data;
}
//获取相似歌曲
HTTPUtils.simi_song = async function(obj) {
    let url = Simi + '/song';
    let data = await Http.Get(url, obj);
    return data;
}
//获取最近5个听了这首歌的用户
HTTPUtils.simi_user = async function(obj) {
    let url = Simi + '/user';
    let data = await Http.Get(url, obj);
    return data;
}


//推荐相关接口----------------------------------------------------------------------
//获取每日推荐歌单----需要登录
HTTPUtils.recommend_resource = async function() {
    let url = Recommend + '/resource';
    let data = await Http.Get(url);
    return data;
}
//获取每日推荐歌曲----需登录
HTTPUtils.recomment_songs = async function() {
    let url = Recommend + '/songs';
    let data = await Http.Get(url);
    return data;
}
//获取历史日推可用日期列表
HTTPUtils.history_recommend_songs = async function() {
    let url = server + '/history/recommend/songs';
    let data = await Http.Get(url);
    return data;
}
//获取历史日推详情数据
HTTPUtils.history_recommend_song_detail = async function(obj) {
    let url = server + '/history/recommend/songs/detail';
    let data = await Http.Get(url, obj);
    return data;
}


//喜欢相关接口-------------------------------------------------------------
//喜欢音乐
HTTPUtils.like = async function(obj) {
    let url = Like;
    let data = await Http.Get(url, obj);
    return data;
}
//喜欢音乐列表
HTTPUtils.likelist = async function(obj) {
    let url = server + '/likelist';
    let data = await Http.Get(url, obj);
    return data;
}


//MV相关接口------------------------------------------------------------------------------------
//最新MV
HTTPUtils.mv_first = async function(obj) {
    let url = MV + '/first';
    let data = await Http.Get(url, obj);
    return data;
}
//全部MV
HTTPUtils.mv_all = async function(obj) {
    let url = MV + '/all';
    let data = await Http.Get(url, obj);
    return data;
}
//网易出品MV
HTTPUtils.mv_exclusive_rcmd = async function(obj) {
    let url = MV + '/exclusive/rcmd';
    let data = await Http.Get(url, obj);
    return data;
}
//MV排行
HTTPUtils.top_mv = async function(obj) {
    let url = Top + '/mv';
    let data = await Http.Get(url, obj);
    return data;
}
//获取MV数据
HTTPUtils.mv_detail = async function(obj) {
    let url = MV + '/detail';
    let data = await Http.Get(url, obj);
    return data;
}
//获取MV点赞,转发,评论数量数据
HTTPUtils.mv_detail_info = async function(obj) {
    let url = MV + '/detail/info';
    let data = await Http.Get(url, obj);
    return data;
}
//获取MV地址
HTTPUtils.mv_url = async function(obj) {
    let url = MV + '/url';
    let data = await Http.Get(url, obj);
    return data;
}




//视频相关接口-----------------------------------------------------------------------------------------------------
//获取视频标签列表
HTTPUtils.video_group_list = async function() {
    let url = Video + '/group/list';
    let data = await Http.Get(url);
    return data;
}
//获取视频分类列表
HTTPUtils.video_category_list = async function() {
    let url = Video + '/category/list';
    let data = await Http.Get(url);
    return data;
}
//获取视频标签/分类下的视频
HTTPUtils.video_group = async function(obj) {
    let url = Video + '/group';
    let data = await Http.Get(url, obj);
    return data;
}
//获取全部视频列表
HTTPUtils.video_timeline_all = async function(obj) {
    let url = Video + '/timeline/all';
    let data = await Http.Get(url, obj);
    return data;
}
//获取推荐视频
HTTPUtils.video_timeline_recommend = async function(obj) {
    let url = Video + '/timeline/recommend';
    let data = await Http.Get(url, obj);
    return data;
}
//获取相关视频
HTTPUtils.related_video = async function(obj) {
    let url = server + '/related/allvideo';
    let data = await Http.Get(url, obj);
    return data;
}
//视频详情
HTTPUtils.video_detail = async function(obj) {
    let url = Video + '/detail';
    let data = await Http.Get(url, obj);
    return data;
}
//获取视频点赞转发评论数数据
HTTPUtils.video_detail_info = async function(obj) {
    let url = Video + '/detail/info';
    let data = await Http.Get(url, obj);
    return data;
}
//获取视频播放地址
HTTPUtils.video_url = async function(obj) {
    let url = Video + '/url';
    let data = await Http.Get(url, obj);
    return data;
}
//






//个性推荐相关接口--------------------------------------------------------
//推荐MV
HTTPUtils.personalized_mv = async function() {
    let url = Personalized + '/mv';
    let data = await Http.Get(url);
    return data;
}
//推荐歌单
HTTPUtils.personalized = async function(obj) {
    let url = Personalized;
    let data = await Http.Get(url, obj);
    return data;
}
//推荐新音乐
HTTPUtils.personalized_newsong = async function(obj) {
    let url = Personalized + '/newsong';
    let data = await Http.Get(url, obj);
    return data;
}
//推荐电台
HTTPUtils.personalized_djprogram = async function() {
    let url = Personalized + '/djprogram';
    let data = await Http.Get(url);
    return data;
}
//推荐节目
HTTPUtils.program_recommend = async function() {
    let url = server + '/program/recommend';
    let data = await Http.Get(url);
    return data;
}
//独家推荐(入口列表)
HTTPUtils.personalized_privatecontent = async function() {
    let url = Personalized + '/privatecontent';
    let data = await Http.Get(url);
    return data;
}
//独家推荐列表
HTTPUtils.personalized_privatecontent_list = async function(obj) {
    let url = Personalized + '/privatecontent/list';
    let data = await Http.Get(url, obj);
    return data;
}




//榜单相关接口------------------------------------------------------------------------------------
//所有榜单
HTTPUtils.toplist = async function() {
    let url = Toplist;
    let data = await Http.Get(url);
    return data;
}
//所有榜单内容摘要
HTTPUtils.toplist_detail = async function() {
    let url = Toplist + '/detail';
    let data = await Http.Get(url);
    return data;
}
//歌手榜
HTTPUtils.toplist_artist = async function(obj) {
    let url = Toplist + '/artist';
    let data = await Http.Get(url, obj);
    return data;
}




//电台相关接口----------------------------------------------------------------------
//电台banner
HTTPUtils.dj_banner = async function() {
    let url = Dj + '/banner';
    let data = await Http.Get(url);
    return data;
}
//电台个性推荐
HTTPUtils.dj_personaliz_recommend = async function(obj) {
    let url = Dj + '/personaliz/recommend';
    let data = await Http.Get(url, obj);
    return data;
}
//电台订阅者列表
HTTPUtils.dj_subscribers = async function(obj) {
    let url = Dj + '/subscribers';
    let data = await Http.Get(url, obj);
    return data;
}
//用户电台
HTTPUtils.user_audio = async function(obj) {
    let url = server + '/user/audio';
    let data = await Http.Get(url, obj);
    return data;
}
//热门电台
HTTPUtils.dj_hot = async function(obj) {
    let url = Dj + '/hot';
    let data = await Http.Get(url, obj);
    return data;
}
//电台-节目榜
HTTPUtils.dj_program_toplist = async function(obj) {
    let url = Dj + '/program/toplist';
    let data = await Http.Get(url, obj);
    return data;
}
//电台-付费精品
HTTPUtils.dj_toplist_pay = async function(obj) {
    let url = Dj + '/toplist/pay';
    let data = await Http.Get(url, obj);
    return data;
}
//电台24小时节目榜
HTTPUtils.dj_toplist_hours = async function(obj) {
    let url = Dj + '/toplist/hours';
    let data = await Http.Get(url, obj);
    return data;
}
//电台-主播新人榜
HTTPUtils.dj_toplist_newcomer = async function(obj) {
    let url = Dj + '/toplist/newcomer';
    let data = await Http.Get(url, obj);
    return data;
}
//电台-最热主播榜
HTTPUtils.dj_toplist_popular = async function(obj) {
    let url = Dj + '/toplist/popular';
    let data = await Http.Get(url, obj);
    return data;
}
//电台 - 新晋电台榜/热门电台榜
HTTPUtils.dj_toplist = async function(obj) {
    let url = Dj + '/toplist';
    let data = await Http.Get(url, obj);
    return data;
}
//电台 - 类别热门电台
HTTPUtils.dj_toplist_radio_list = async function(obj) {
    let url = Dj + '/toplist/radio/list';
    let data = await Http.Get(url, obj);
    return data;
}
//电台 - 推荐
HTTPUtils.dj_recommend = async function() {
    let url = Dj + '/recommend';
    let data = await Http.Get(url);
    return data;
}
//电台 - 分类
HTTPUtils.dj_catelist = async function() {
    let url = Dj + '/catelist';
    let data = await Http.Get(url);
    return data;
}
//电台 - 分类推荐
HTTPUtils.dj_recommend_type = async function(obj) {
    let url = Dj + '/recommend/type';
    let data = await Http.Get(url, obj);
    return data;
}
//电台 - 订阅
HTTPUtils.dj_sub = async function(obj) {
    let url = Dj + '/sub';
    let data = await Http.Get(url, obj);
    return data;
}
//电台 - 订阅列表
HTTPUtils.dj_sublist = async function() {
    let url = Dj + '/sublist';
    let data = await Http.Get(url);
    return data;
}
//电台 - 付费精选
HTTPUtils.dj_paygift = async function() {
    let url = Dj + '/paygift';
    let data = await Http.Get(url);
    return data;
}
//电台 - 非热门类型
HTTPUtils.dj_category_excludehot = async function() {
    let url = Dj + '/category/excludehot';
    let data = await Http.Get(url);
    return data;
}
//电台 - 推荐类型
HTTPUtils.dj_category_recommend = async function() {
    let url = Dj + '/category/recommend';
    let data = await Http.Get(url);
    return data;
}
//电台 - 今日优选
HTTPUtils.dj_today_perfered = async function() {
    let url = Dj + '/today/perfered';
    let data = await Http.Get(url);
    return data;
}
//电台 - 详情
HTTPUtils.dj_detail = async function() {
    let url = Dj + '/detail';
    let data = await Http.Get(url);
    return data;
}
//电台 - 节目
HTTPUtils.dj_program = async function() {
    let url = Dj + '/program';
    let data = await Http.Get(url);
    return data;
}
//电台 - 节目详情
HTTPUtils.dj_program_detail = async function() {
    let url = Dj + '/program/detail';
    let data = await Http.Get(url);
    return data;
}



//通知相关接口---------------------------------------------------------------------------
//私信
HTTPUtils.msg_private = async function(obj) {
    let url = Msg + '/private';
    let data = await Http.Get(url, obj);
    return data;
}
//发送私信
HTTPUtils.send_text = async function(obj) {
    let url = Send + '/text';
    let data = await Http.Get(url, obj);
    return data;
}
//发送私信(带歌曲)
HTTPUtils.send_song = async function(obj) {
    let url = Send + '/song';
    let data = await Http.Get(url, obj);
    return data;
}
//发送私信(带专辑)
HTTPUtils.send_album = async function(obj) {
    let url = Send + '/album';
    let data = await Http.Get(url, obj);
    return data;
}
//发送私信(带歌单)
HTTPUtils.send_playlist = async function(obj) {
    let url = Send + '/playlist';
    let data = await Http.Get(url, obj);
    return data;
}
//最近联系人
HTTPUtils.msg_recentcontact = async function() {
    let url = Msg + '/recentcontact';
    let data = await Http.Get(url);
    return data;
}
//私信内容
HTTPUtils.msg_private_history = async function(obj) {
    let url = Msg + '/private/history';
    let data = await Http.Get(url, obj);
    return data;
}
//通知-评论
HTTPUtils.msg_comments = async function(obj) {
    let url = Msg + '/comments';
    let data = await Http.Get(url, obj);
    return data;
}
//通知-@我
HTTPUtils.msg_forwards = async function(obj) {
    let url = Msg + '/forwards';
    let data = await Http.Get(url, obj);
    return data;
}
//通知-通知
HTTPUtils.msg_notices = async function(obj) {
    let url = Msg + '/msg_notices';
    let data = await Http.Get(url, obj);
    return data;
}





//杂项-----接口
//私人FM----需登录
HTTPUtils.personal_fm = async function() {
    let url = server + '/personal_fm';
    let data = await Http.Get(url);
    return data;
}
//签到---需登录
HTTPUtils.daily_signin = async function() {
    let url = server + '/daily_signin';
    let data = await Http.Get(url);
    return data;
}
//垃圾桶
HTTPUtils.fm_trash = async function(obj) {
    let url = server + '/fm_trash';
    let data = await Http.Get(url, obj);
    return data;
}
//新碟上架
HTTPUtils.top_album = async function(obj) {
    let url = Top + '/album';
    let data = await Http.Get(url, obj);
    return data;
}
//全部新碟
HTTPUtils.album_new = async function(obj) {
    let url = Album + '/new';
    let data = await Http.Get(url, obj);
    return data;
}
//最新专辑
HTTPUtils.album_newest = async function() {
    let url = Album + '/newest';
    let data = await Http.Get(url);
    return data;
}
//听歌打卡
HTTPUtils.scrobble = async function(obj) {
    let url = server + '/scrobble';
    let data = await Http.Get(url, obj);
    return data;
}
//热门歌手
HTTPUtils.top_artists = async function(obj) {
    let url = Top + '/artists';
    let data = await Http.Get(url, obj);
    return data;
}
//用户设置
HTTPUtils.setting = async function(obj) {
    let url = server + '/setting';
    let data = await Http.Get(url, obj);
    return data;
}
//

export default HTTPUtils;