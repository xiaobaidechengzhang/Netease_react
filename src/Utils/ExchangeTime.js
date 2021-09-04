/**
 * 
 * @param {String} time : 传过来的毫秒数
 * @param {Number} type : undefined返回2021-05-12 07:25:21; 1返回2021-05-12
 * @returns 几秒前/几分钟前/几小时前/具体时间
 */
function exchangeTime(time, type) {
  let differTime = Date.now() - time;
  let onesecTime = 1000;
  let oneminTime = 60*1000;
  let onehourTime = 3600000;
  let onedayTime = 60*60*24*1000;
  let title = ''
  if(differTime<= oneminTime) {
      title = Math.floor(differTime/onesecTime) + '秒前';
  }else if(differTime > oneminTime && differTime<onehourTime) {
      title = Math.floor(differTime/oneminTime) + '分钟前';
  }else if(differTime >= onehourTime && differTime < onedayTime) {
      title = Math.floor(differTime/onehourTime) + '小时前';
  }else {
      //具体时间
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? '0'+month : month;
      let day = date.getDate();
      day = day < 10 ? '0'+day : day;
      let hour = date.getHours();
      hour = hour < 10 ? '0'+hour : hour;
      let min = date.getMinutes();
      min = min < 10 ? '0'+min : min;
      let sec = date.getSeconds();
      sec = sec < 10 ? '0'+sec : sec;
      title = !type ?  year + ' - ' + month + ' - ' + day + ' ' + hour + ' : ' + min + ' : ' +sec : year + ' - ' + month + ' - ' + day;
  }
  return title;
}
/**
 * 返回音乐/视频/MV时间duration
 * @param {Number | String} time : 例如212000毫秒数
 * @returns 05:36:25 || 05:36
 */
function exchangeDuration(time) {
    time = parseInt(time);
    let dur = 212000;
    time = time / 1000;
    if(time < 1){
        // return '小于1s';
        return '00:00';
    }
    if(time > 24*60*60) {
        // return '大于一天'
        return '23:59:59'
    }
    let h,
        m,
        sec,
        allMin;
    allMin = Math.floor(time / 60);
    sec = time - allMin*60;
    //转换成整数, 因为很有可能有许多位的小数
    sec = parseInt(sec)
    sec = sec < 10 ? '0'+sec : sec;
    h = Math.floor(time / 3600);
    m = h < 1 ? Math.floor(time / 60) : (time - h*3600 - sec)/60;
    m = m<10 ? '0'+m : m;
    let title = '';
    title = h < 1 ? m + ':' + sec : h+':'+m+':'+sec;
    return title;
}
/**
 * 返回音乐/榜单/视频/MV播放量, 例如588888-->58万; 201-->201; 
 */
export { exchangeTime, exchangeDuration };