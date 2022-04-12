import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';

export function getDeviceTree(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/getdevicegastree', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getPlanList(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/getctrlplanlist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getPlanDetail(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/getctrlplandetail', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getPlanMachs(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/getctrlmach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addPlan(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/addctrlplan', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updatePlan(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/updatectrlplan', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function delPlan(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/deletectrlplan', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function pushPlan(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/pushctrlplan', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}






