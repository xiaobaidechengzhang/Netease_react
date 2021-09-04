const playlistReducer = (state = {data: [], active: {data: {}, index: -1}}, action) => {
  let data = ''
  let index = 0;
  let stateData = JSON.parse(JSON.stringify(state));
  console.log(stateData);
  switch(action.type) {
    case 'add':
      //向播放列表中添加歌曲
      //对于传过来的action.data, 下面有两种处理形式
      //1, 如果传过来的action.data 是 Array 类型, 那么, 添加数据的时候需要使用...data
      //2, 如果传过来的action.data 是 Object 类型, 那么不用使用...data;
      data = action.data;
      if(data instanceof Array) {
        if(action.hasOwnProperty('index') && index) {
          stateData.data && stateData.data.splice(action.index, 0, ...data);
        }else {
          stateData.data = [...stateData.data, ...data]
        }
      }else {
        if(action.hasOwnProperty('index') && index) {
          stateData.data && stateData.data.splice(action.index, 0, data);
          return stateData;
        }else {
          stateData.data = [...stateData.data, data]
        }
      }
      //添加歌曲后, 同时需要更新当前播放歌曲的index
      index = (stateData.data instanceof Array) && stateData.data.findIndex(item => item.id == stateData.active.data.id);
      stateData.active.index = index;
      return stateData;
    case 'delete':
      //删除播放列表中的某条数据
      //关于传过来的action.data类型, 处理方式类似于add中所描述的那样
      data = action.data;
      if(data instanceof Array) {
        //这里暂时有问题, 不能使用
        //如果传过来的是多选删除数组
        if(action.hasOwnProperty('index') && index) {
          stateData.data && stateData.data.splice(action.index, data.length);
        }else {
          //没有指定index, 那么需要先获取,该歌曲在播放列表中的位置, 再进行删除
          //
          let songIndex = (stateData.data instanceof Array) && stateData.data.findIndex(item => item.id == stateData.active.data.id)
          stateData.data && stateData.data.splice(songIndex, 1);
        }
      }else {
        if(action.hasOwnProperty('index') && index) {
          //如果有指定index, 
          stateData.data && stateData.data.splice(action.index, 1);
        }else {
          //没有指定index, 那么需要先获取,该歌曲在播放列表中的位置, 再进行删除
          let songIndex = (stateData.data instanceof Array) && stateData.data.findIndex(item => item.id == data.id)
          stateData.data && stateData.data.splice(songIndex, 1);
        }
      }
      index = (stateData.data instanceof Array) && stateData.data.findIndex(item => item.id == stateData.active.data.id);
      stateData.active.index = index;
      return stateData;
    case 'empty':
      //清空播放列表数据
      stateData.data = [];
      stateData.active = {
        data: {},
        index: -1
      };
      return stateData;
    case 'set':
      //重新设置播放列表数据
      stateData.data = action.data;
      stateData.active = {
        data: (action.data instanceof Array) && action.data.length > 0 && action.data[0] || {},
        index: (action.data instanceof Array) && action.data.length > 0 ? 0 : -1
      };
      return stateData;
    case 'setActive':
      //设置当前播放的歌曲信息, 和在整个播放列表中的位置
      index = (stateData.data instanceof Array) && stateData.data.findIndex(item => item.id == action.data.id);
      stateData.active = {
        data: action.data,
        index
      }
      return stateData;
    case 'next':
      //首先获取当前播放歌曲的位置, 如果没找到, 那么默认0
      index = (stateData.data instanceof Array) && stateData.data.findIndex(item => item.id == stateData.active.data.id);
      console.log(index);
      index = index == -1 ? 0 : index +1;
      console.log(stateData.data);
      console.log(stateData.active.data);
      data = action.data;
      //判断数组或者对象, 为的是更简单的添加歌曲数据
      if(data instanceof Array) {
        //这里做下判断, 存在redux中的stateData.data是否是数组, 如果不是, 要把它设为数组, 并添加新数据
        if(stateData.data instanceof Array) {
          stateData.data.splice(index, 0, ...data)
        }else {
          state.data = [];
          state.data = data;
        }
      }else if(data instanceof Object) {
        if(stateData.data instanceof Array) {
          let  index_will_next_song = (stateData.data instanceof Array) && stateData.data.findIndex(item => item.id == data.id);
          if(index_will_next_song == -1) {
            //如果播放列表中没有下一首播放的歌曲, 那么直接在当前播放歌曲的后面添加歌曲
            stateData.data.splice(index, 0, data)
          }else {
            if(index_will_next_song != (index - 1)) {
              //将要添加的歌曲与当前播放的歌曲不同时, 需要将已经存在的歌曲挪到当前播放歌曲的位置+1
              //当index>index_will_next_song时, 需要先在index后面添加歌曲数据, 然后在index_will_next_song处删除已存在的歌曲
              let index2 = index > index_will_next_song ? index : index_will_next_song;
              let index3 = index > index_will_next_song ? index_will_next_song : index;
              console.log(index_will_next_song);
              stateData.data.splice(index2, 0, data);
              stateData.data.splice(index3, 1)

            }
            //如果要添加的歌曲与当前播放的歌曲相同, 暂时不进行任何操作(后续会加上从头开始播放该歌曲)
          }
        }else {
          state.data = []
          state.data.push(data)
        }
      }
      return stateData;
    default:
      return state;
  }
}

export default playlistReducer;