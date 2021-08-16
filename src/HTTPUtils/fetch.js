let interceptors_req = [],
  interceptors_res = [];

function c_fetch(input, init = {}) {
  //默认GET方法
  if (!init.method) {
    init.method = "GET";
  }
  //发送请求前, 对url和config进行处理
  interceptors_req.forEach((interceptor) => {
    let handle_url_config = interceptor(input, init);
    input = handle_url_config.url;
    init = handle_url_config.config;
  });
  return new Promise(function (resolve, reject) {
    fetch(input, init)
      .then((res) => {
        //返回数据前, 处理response
        interceptors_res.forEach((interceptor) => {
          res = interceptor(res);
        });
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

//定义interceptors, 拦截器
c_fetch.interceptors = {
  request: {
    use: function (callback) {
      interceptors_req.push(callback);
    },
  },
  response: {
    use: function (callback) {
      interceptors_res.push(callback);
    },
  },
};
export default c_fetch;
