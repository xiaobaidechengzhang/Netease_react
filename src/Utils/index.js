// import * as tt from './ExchangeTime';
const {exchangeTime} = require('./ExchangeTime')
const {Cookies} = require('./Cookies');
// import exchangeTime from './ExchangeTime'
console.log(exchangeTime)
let pp = 'module export'
let dd = 'ddddd'
module.exports = {
  pp,
  dd,
  exchangeTime,
  Cookies,
}