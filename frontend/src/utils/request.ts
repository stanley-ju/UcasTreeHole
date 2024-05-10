import axios from 'axios';
import router from '@/router';

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

/**
 * 请求拦截器
 */
request.interceptors.request.use((req) => {
  console.log('请求拦截器 =>', req)
  req.headers.Authorization = 'bearer ' + localStorage.getItem("token")
  return req;
}, (error) => {
  return Promise.reject(error);
});

/**
 * 响应拦截器
 */
request.interceptors.response.use(function (res) {
  console.log('响应拦截器 =>', res)
  return res.data
}, (error) => {
  const { response } = error;
  if (response && response.status === 401) {
    window.alert(response.data.respMessage);
    localStorage.removeItem('token');
    router.push('/login')
  }else{
    // 对其他错误状态码的处理可以放在这里
    window.alert(response.data.respMessage);
    return Promise.reject(error);
  }
});

export function interfaceToFormData(data) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof File) {
      // 如果是 File 对象，添加到 FormData 中
      // 可以选择传递文件的原始名称作为第三个参数
      formData.append(key, value);
    } else if (typeof value === 'string') {
      // 如果是字符串，直接添加到 FormData 中
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
}

export default request;
