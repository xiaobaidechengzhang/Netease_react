
const Cookies = {
  getItem: function(name) {
    let cookie_str = document.cookie;
    //首先, 看有没有对应的name
    let is_have = cookie_str.indexOf(name);
    console.log(is_have)
    if(is_have != -1) {
      //如果存在, 截取位置以后的字符串
      let str = cookie_str.substring(is_have);
      //分割后, 取第一个值, 
      let str_arr = str.split(';');
      let cookie = str_arr[0];
      //截取该cookie等号后面的值
      let cookie_val = cookie.substring(name.length+1);
      //分割字符串, 第一个就是需要的value
      console.log(cookie_val.split(';')[0])
      let val = cookie_val.split(';')[0];
      return val;
    }
    //如果不存在, 返回-1;
    return -1;
  },
  setItem: function(name, value, expire) {
    let str = name+'='+value+';';
    switch(expire.constructor) {
      //Number: 默认以小时为单位
      case Number:
        let expires = new Date(Date.now() + expire * 60 * 60 * 1000);
        str += 'expires=' + expires;
        break;
      case Date:
        str += 'expires=' + expire;
        break;
      default:
        break;
    }
    document.cookie = str;
  },
  hasItem: function(name) {
    //是否存在某cookie
    let cookie_str = document.cookie;
    let is_have = cookie_str.indexOf(name);
    return is_have == -1 ? false : true;
  },
  removeItem: function(name) {
    //首先检查是否存在
    let is_have = this.hasItem(name);
    if(is_have) {
      let val = this.getItem(name);
      this.setItem(name, val, new Date(1970, 1, 1));
      //存在返回true;
      return true;
    }
    //不存在返回false
    return false;
  }
};

export {Cookies};
