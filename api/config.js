/*
 * @Author: your name
 * @Date: 2020-07-06 17:32:51
 * @LastEditTime: 2021-01-14 09:23:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \offline.fandow.com\api\config.js
 */
/**
 * 接口配置，api服务器接口根地址
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgbaseUrl: 图片所在域名地址
 * refactorBaseUrl: 重构新接口
 *
 */
import ENV from './env'
let baseURL = '//api-offline.fandow.com';
// let baseURL = '//api-offlinefixbug.fandow.com';
let fileURL = 'https://api.fandow.com'

if (ENV === 'production') {
  console.log('---- production ----');
} else if (ENV === 'test') {
  // baseURL = 'http://api-offlinefixbug.fandow.com';
  // baseURL = 'http://api-offlinefixbug.fandow.com';
  baseURL = 'http://api-offlinetest.fandow.com';
  // baseURL = 'http://api-offlinebeta.fandow.com';
  fileURL = 'http://apitest.fandow.com'
  console.log('---- test ----');
} else if (ENV === 'beta') {
  baseURL = 'http://api-offlinetest.fandow.com';
  // baseURL = 'http://api-offlinefixbug.fandow.com';
  fileURL = 'http://apitest.fandow.com'
  console.log('---- beta ----');
} else if (ENV === 'fixbug') {
  baseURL = 'http://api-offlinefixbug.fandow.com';
  fileURL = 'http://apitest.fandow.com'
  console.log('---- fixbug ----');
} else if (ENV === 'qa') {
  baseURL = 'http://api-offline.qa.fandow.com';
  fileURL = 'http://apitest.fandow.com'
  console.log('---- qa ----');
} else if (ENV === 'sit') {
  baseURL = 'http://api-offline.sit.fandow.com';
  fileURL = 'http://apitest.fandow.com'
  console.log('---- sit ----');
} else {
  // baseURL = 'http://api-offlinefixbug.fandow.com';
  // baseURL = 'http://api-offline.qa.fandow.com';
  baseURL = 'http://api-offlinetest.fandow.com';
  // baseURL = 'http://api-offlinebeta.fandow.com';
  fileURL = 'http://apitest.fandow.com'
  // fileURL = 'http://api-offlinefixbug.fandow.com'
  // baseURL = 'http://ruiblog.vipgz6.idcfengye.com'
  console.log('---- develop ----');
}

export const SERVER_BASE_URL = baseURL
export const SERVER_FILE_URL = fileURL
export const ERR_OK = 0
// export const DOWN = down
// export const REFACTOR_BASE_URL = refactorBaseUrl
