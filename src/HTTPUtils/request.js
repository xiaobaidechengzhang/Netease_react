import c_fetch from './fetch';

c_fetch.interceptors.request.use(
  function(url, config) {
    //发送请求前, 为每个请求添加timestamp;
    let is_have_timestamp = url.indexOf('timestamp');
    let is_have_wenhao = url.indexOf('?');
    if(is_have_wenhao == -1) {
      url += '?' + 'timestamp=' + Date.now();
    }else {
      url += '&' + 'timestamp=' + Date.now();
    }
    return {url, config};
  }
)
//返回数据前, 处理数据, 
c_fetch.interceptors.response.use(function(res) {
  if(res.status == 301) {
    console.log('需要重新登录')
    //这里可以reject, 不返回数据
  }
  return res;
});

const request = () => {
  return c_fetch;
}
export default request;