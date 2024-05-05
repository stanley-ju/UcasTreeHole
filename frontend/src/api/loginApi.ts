import { loginRequest } from "@/types/type";
import request from "@/utils/request";

function interfaceToFormData(data:any) {
    const formData = new FormData();
    
    for (const [key, value] of Object.entries(data)) {
      // 检查 value 是否为对象，如果是，则递归转换
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          // 如果是数组，遍历数组元素
          value.forEach((item, index) => {
            const arrayKey = `${key}[${index}]`;
            formData.append(arrayKey, item);
          });
        } else {
          // 如果是对象，递归转换对象
          const nestedFormData = interfaceToFormData(value);
          for (const [nestedKey, nestedValue] of nestedFormData.entries()) {
            formData.append(nestedKey, nestedValue);
          }
        }
      } else {
        // 如果是基本数据类型，则直接添加到 formData 中
        formData.append(key, String(value));
      }
    }
  
    return formData;
  }

export function userLogin(requestData:loginRequest){
    const formData = interfaceToFormData(requestData)

    return request({
        url:'/user/login',
        method: 'post',
        data:formData
    })
}

export function userRegister(requestData:loginRequest){
    const formData = interfaceToFormData(requestData)
    
    return request({
        url:'/user/signup',
        method: 'post',
        data:formData
    })
}
