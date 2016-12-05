/**
 * Created by Administrator on 2016/9/21 0021.
 */
var path = require('path');
var cachepath = path.join(__dirname, '../data');
module.exports = function() {
    // 输入你的配置
    return {
        appId: 'wx16ff32407d9292cb',
        appSecret: '8052991dfd97289bac5cb0b6512b1000',
        appToken: 'thusports',
        //cache_json_file:'./data'
        cache_json_file:cachepath
    };
};