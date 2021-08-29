const playlistReducer = (state = {data: [], active: {data: {}, index: -1}}, action) => {
  let data = ''
  let index = 0;
  console.log('play list reducer');
  console.log(state);
  let stateData = JSON.parse(JSON.stringify(state));
  console.log(stateData);
  switch(action.type) {
    case 'add':
      //向播放列表中添加歌曲
      //对于传过来的action.data, 下面有两种处理形式
      //1, 如果传过来的action.data 是 Array 类型, 那么, 添加数据的时候需要使用...data
      //2, 如果传过来的action.data 是 Object 类型, 那么不用使用...data;
      console.log('add');
      console.log(action.data);
      data = action.data;
      if(data instanceof Array) {
        if(action.hasOwnProperty('index')) {
          stateData.data && stateData.data.splice(action.index, 0, ...data);
        }else {
          stateData.data = [...stateData.data, ...data]
        }
      }else {
        if(action.hasOwnProperty('index')) {
          stateData.data && stateData.data.splice(action.index, 0, data);
          return stateData;
        }else {
          stateData.data = [...stateData.data, data]
        }
        console.log('add finally');
        console.log(stateData);
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
        if(action.hasOwnProperty('index')) {
          stateData.data && stateData.data.splice(action.index, data.length);
        }else {
          stateData.data = [...stateData.data, ...data]
        }
      }else {
        if(action.hasOwnProperty('index')) {
          stateData.data && stateData.data.splice(action.index, 1);
        }else {
          stateData.data = [...stateData.data, data]
        }
      }
      index = (stateData.data instanceof Array) && stateData.data.findIndex(item => item.id == stateData.active.data.id);
      stateData.active.index = index;
      return stateData;
    case 'empty':
      //清空播放列表数据
      console.log('empty');
      console.log(stateData);
      stateData.data = [];
      stateData.active = {
        data: {},
        index: -1
      };
      return stateData;
    case 'set':
      //重新设置播放列表数据
      console.log('set list reducer');
      console.log(action.data);
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
    default:
      return state;
  }
}

export default playlistReducer;