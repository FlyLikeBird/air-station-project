import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';
import config from '../../../config';


export function getDeviceList(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/device/getdeveicelist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addDevice(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/device/adddevice', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updateDevice(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/device/updatedevice', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function delDevice(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/device/deldevice', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getBindMeter(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/device/searchmach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 系统监控 ---- 设备监控
export function getDeviceTypes(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/getdeviceinfo', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getDeviceInfoList(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/getdeviceinfolist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getDeviceDetail(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/getdevicedetail', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getStationInfo(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/getmaininfo', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

