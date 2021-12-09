import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';
import config from '../../../config';

export function getGasEffInfo(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/gassceneinfo', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getGasEffChart(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/gasscenetrend', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function getEleInfo(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/geteleinfo', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getEleChart(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/geteletrend', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}



