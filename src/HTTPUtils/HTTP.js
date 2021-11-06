import { message, } from 'antd';
import request from './request'

let Http = {};
Http.Get = function(url, params) {
    const method = 'GET';
    let fetchUrl = url;
    if(params) {
        fetchUrl += stringParams(params);
    }
    //credentials: 'include', 设置此项, 是为了fetch在请求时带上cookie, 
    const fetchParams = {method: method, credentials: 'include',};
    return Http.handleFetchData(fetchUrl, fetchParams);
}
Http.Post = function(url, params = {}) {
    const method = 'POST';
    const body = JSON.stringify(params);
    const fetchParams = {
        method: method,
        body: body,

    }
    return Http.handleFetchData(url, fetchParams);
}

Http.handleFetchData = (url, fetchParams) => {
    const fetchPromise = new Promise((resolve, reject) => {
        request()(url, fetchParams).then(
            response => {
                response.json().then(jsonBody => {
                    if(response.ok) {
                        if(jsonBody.code != 200) {
                            reject(Http.handleFailedResult(jsonBody))
                        }else {
                            resolve(Http.handleResult(jsonBody));
                        }
                    }
                    else {
                        let msg = '服务器繁忙, 请稍后再试!';
                        if(response.code === 404) {
                            msg = '你访问的页面走丢了'
                        }
                        // resolve(Http.handleResult({fetchStatus: 'error', netStatus: response.status, error: msg}))
                        reject(Http.handleFailedResult({code: response.code, error: msg}))
                        // message.error(msg);
                    }
                })
                .catch(e => {
                    const errMsg = e.name + ' ' + e.message;
                    reject(Http.handleFailedResult({code: response.code, error: errMsg}))
                    // message.error(errMsg);
                })
            }
        )
        .catch(e => {
            console.log('最后捕捉错误')
            console.log(e)
            console.log(e.name)
            console.log(e.message)
            const errMsg = e.name + ' ' + e.message;
            // reject(Http.handleFailedResult({fetchStatus: 'error', error: errMsg}))
            message.error(errMsg)
        })
    })
    return Promise.race([fetchPromise])
}

Http.handleResult = (result) => {
    if(result.code != 200 && result.data?.code != 200) {
        console.log('处理结果')
        console.log(result)
        // const errMsg= result.msg || result.message || '服务器开了小差, 请稍后再试!';
        const errMsg= result.error;
        const errStr = `${errMsg} (${result.code})`;
        message.error(errStr)
        return;
    }
    return result;
}

Http.handleFailedResult = (result) => {
    if(result.code != 200 && result.data?.code != 200) {
        const errMsg= result.msg || result.message || '服务器开了小差, 请稍后再试!';
        const errStr = `${errMsg} (${result.code})`;
        message.error(errStr)
        return;
    }
    const errorMsg = 'Uncaught PromiseError: ' + (result.netcode || '') + ' ' + (result.error || result.msg || result.message);
    return errorMsg; 
}


function stringParams(params) {
    let paramsArr = [];
    Object.keys(params).map(item => {
        let str = item + '=' +params[item];
        paramsArr.push(str);
    })
    let paramsStr = '?' + paramsArr.join('&');
    return paramsStr;
}

export default Http;