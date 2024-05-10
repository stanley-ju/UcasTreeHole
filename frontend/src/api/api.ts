import request from "@/utils/request";
import { interfaceToFormData } from "@/utils/request";

export function axiosPostApi(requestData:any, url:string){
    const formData = interfaceToFormData(requestData)

    return request({
        url:url,
        method: 'post',
        data:formData
    })
}
