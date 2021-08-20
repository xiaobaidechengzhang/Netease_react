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