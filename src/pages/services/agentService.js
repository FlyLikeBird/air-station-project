import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';

export function getAgentIndex(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/gas/agenthome', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getCompanyTree(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/getcompanytree', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function getDeviceModel(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/getmodel', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}



