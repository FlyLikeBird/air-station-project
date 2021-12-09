import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';
import config from '../../../config';

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



