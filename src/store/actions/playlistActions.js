//添加数据
export const addToPlaylist = (data, index) => {
  return {
    type: 'add',
    data: data,
    index: index
  }
}
//删除数据
export const deleteSong = (data, index) => {
  console.log('delete delte ');
  console.log(index);
  return {
    type: 'delete',
    data: data,
    index
  }
}
//清空数据
export const deleteAllSongs = () => {
  return {
    type: 'empty'
  }
}
//获取数据
export const getSongs = () => {
  return {
    type: 'get'
  }
}
//设置数据
export const setSongs = (data) => {
  return {
    type: 'set',
    data
  }
}
//设置当前播放歌曲的数据
export const setActive = data => {
  console.log('set active');
  console.log(data)
  return {
    type: 'setActive',
    data
  }
}
//获取当前播放歌曲的数据
export const getActive = () => {
  return {
    type: 'getActive',
  }
}