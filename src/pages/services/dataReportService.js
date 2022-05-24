import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';


export function getCostReport(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/costreposrt', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getEleReport(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/elereposrt', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getGasReport(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/airreposrt', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getRunningReport(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/runreposrt', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}


export function getBasicRatioReport(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/notaireport', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getSaveReport(data = {}){
    data.token = apiToken();
    let str = translateObj(data);
    return request('/gas/savereport', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

