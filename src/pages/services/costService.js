import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';

export function getCostInfo(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/gas/costanalyzinfo', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getCostChart(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/gas/costanalyaz', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getSaveCost(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/gas/getCtrlCompare', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
