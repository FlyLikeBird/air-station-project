import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';


export function getDeviceModels(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/restDeviceModel', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        },'noPrefix'); 
}

export function addDeviceModel(data = {}){
    data.token = apiToken();
    delete data.photos;
    let str = translateObj(data);
    return request('/restDeviceModel/create', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        },'noPrefix'); 
}

export function updateDeviceModel(data = {}){
    let model_id = data.model_id;
    delete data.model_id;
    delete data.photos;
    data.token = apiToken();
    let str = translateObj(data);
    return request('/restDeviceModel/update/' + model_id, { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        },'noPrefix'); 
}

export function delDeviceModel(data = {}){
    let str = translateObj({ token:apiToken() });
    return request('/restDeviceModel/delete/' + data.ids.join(','), { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        },'noPrefix'); 
}

// 设备品牌 接口
export function getDeviceBrand(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/restDeviceBrand', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        },'noPrefix'); 
}

export function addBrand(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/restDeviceBrand/create', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        },'noPrefix'); 
}
export function updateBrand(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/restDeviceBrand/update/' + data.brand_id, { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        },'noPrefix'); 
}
export function delBrand(data = {}){
    let str = translateObj({ token:apiToken() });
    return request('/restDeviceBrand/delete/' + data.ids.join(','), { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        },'noPrefix'); 
}
export function getBrandTree(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/device/getBrandModel', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        },'noPrefix'); 
}

export function uploadImg(data={}){
    let token = apiToken();
    let { company_id, file } = data;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('token',token);
    return request('/upload/upload', { 
        method:'POST',
        body:formData
        }); 
}

export function getDeviceStatus(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/device/getDeviceDetail', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
