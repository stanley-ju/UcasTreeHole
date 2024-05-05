import { loginRequest } from "@/types/type";
import request from "@/utils/request";

function interfaceToFormData(data:any) {
    const formData = new FormData();
    
    for (const [key, value] of Object.entries(data)) {
      // ��� value �Ƿ�Ϊ��������ǣ���ݹ�ת��
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          // ��������飬��������Ԫ��
          value.forEach((item, index) => {
            const arrayKey = `${key}[${index}]`;
            formData.append(arrayKey, item);
          });
        } else {
          // ����Ƕ��󣬵ݹ�ת������
          const nestedFormData = interfaceToFormData(value);
          for (const [nestedKey, nestedValue] of nestedFormData.entries()) {
            formData.append(nestedKey, nestedValue);
          }
        }
      } else {
        // ����ǻ����������ͣ���ֱ����ӵ� formData ��
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
