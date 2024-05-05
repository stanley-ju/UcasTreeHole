import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:8088', // 替换为你的API服务的基础URL
  timeout: 10000, // 请求超时时间
  // headers: {
  //   'Content-Type': 'application/json'
  // },
  // responseType: 'json', // 默认响应类型
  // responseEncoding: 'utf8', // 默认编码
});

const NETWORK_ERROR = '网络错误，请联系开发人员'

/**
 * 请求拦截器
 */
request.interceptors.request.use((req) => {
  console.log('请求拦截器 =>', req)
  return req;
}, (error) => {
  return Promise.reject(error);
});

/**
 * 响应拦截器
 */
request.interceptors.response.use(function (res) {
  console.log('响应拦截器 =>', res)
  if (res.status == 200) {
    return res.data
  } else {
    return Promise.reject(NETWORK_ERROR)
  }
});

export default request;
