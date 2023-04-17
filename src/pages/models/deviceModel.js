import { 
    getDeviceModels, addDeviceModel, updateDeviceModel, delDeviceModel,
    getDeviceBrand, addBrand, updateBrand, delBrand, getBrandTree,
    uploadImg,
    getDeviceStatus
} from '../services/deviceModelService';
import { getGasEffChart } from '../services/gasMonitorService';
import moment from 'moment';
import { apiToken, encryptBy } from '@/pages/utils/encryption';
const date = new Date();

const initialState = {
    isLoading:true,
    modelList:[],
    currentPage:1,
    total:0,
    brandList:[],
    brandTree:{},
    detailInfo:{},
    detailLoading:true
};

export default {
    namespace:'deviceModel',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        *cancelAll(action, { put }){
            yield put({ type:'reset'});
        },
        *initModels(action, { put }){
            yield put({ type:'fetchModelList'});
            yield put({ type:'fetchBrandList'});
        },
        *fetchModelList(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getDeviceModels, { company_id, page:currentPage, pagesize:12 });
            if ( data && data.code === '0'){
                yield put({ type:'getModelsResult', payload:{ data:data.data, currentPage, total:data.count  }});
            }
        },
        *addModelAsync(action, { put, select, call, all }){
            let { user:{ company_id }} = yield select();
            let { values, resolve, reject, forEdit } = action.payload || {};
            values.company_id = company_id;
            let imgPath;
            if ( values.photos && values.photos.length ) {
                let imagePaths = yield all([
                    ...values.photos.map(file=>call(uploadImg, { file }))
                ]);
                imgPath = imagePaths.map(i=>i.data.data.filePath)[0];
                values.img_path = imgPath;
            } 
            let { data } = yield call( forEdit ? updateDeviceModel : addDeviceModel, values);
            if ( data && data.code === '0' ){
                yield put({ type:'fetchModelList'});
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *delModelAsync(action, { put, select, call }){
            let { resolve, reject, model_id  } = action.payload || {};
            let { data } = yield call(delDeviceModel, { ids:[model_id] });
            if ( data && data.code === '0' ){
                yield put({ type:'fetchModelList'});
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *fetchBrandList(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            let { data } = yield call(getDeviceBrand, { company_id, page:currentPage, pagesize:12 });
            if ( data && data.code === '0'){
                yield put({ type:'getBrandListResult', payload:{ data:data.data, currentPage, total:data.count  }});
            }
        },
        *addBrandAsync(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { resolve, reject, brand_name } = action.payload ;
            let { data } = yield call(addBrand, { company_id, brand_name });
            if ( data && data.code === '0'){
                yield put({ type:'fetchBrandList'});
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        *updateBrandAsync(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { resolve, reject, brand_name, brand_id } = action.payload ;
            let { data } = yield call(updateBrand, { company_id, brand_name, brand_id });
            if ( data && data.code === '0'){
                yield put({ type:'fetchBrandList'});
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        *delBrandAsync(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { resolve, reject, brand_id } = action.payload ;
            let { data } = yield call(delBrand, { company_id, ids:[brand_id] });
            if ( data && data.code === '0'){
                yield put({ type:'fetchBrandList'});
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        *initDetail(action, { put }){
            yield put.resolve({ type:'gasMach/fetchGasStation', payload:{ mode:'single' } });
            yield put({ type:'fetchDeviceDetail' });
        },
        *fetchDeviceDetail(action, { put, select, call }){
            let { user:{ company_id }, gasMach:{ currentNode }} = yield select();
            yield put({ type:'toggleDetailLoading'});
            let { data } = yield call(getDeviceStatus, { company_id, device_id:currentNode.key });
            if ( data && data.code === '0'){
                yield put({ type:'getStatusResult', payload:{ data:data.data } });
            }
        }
    },
    reducers:{
        
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        toggleDetailLoading(state){
            return { ...state, detailLoading:true };
        },
        getModelsResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, modelList:data, currentPage, total, isLoading:false };
        },
        getBrandListResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, brandList:data };
        },
        getStatusResult(state, { payload:{ data }}){
            return { ...state, detailInfo:data, detailLoading:false };
        },
        reset(state){
            return initialState;
        } 
    }
}


