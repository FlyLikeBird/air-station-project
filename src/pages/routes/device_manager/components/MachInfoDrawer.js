import React from 'react';
import style from '../DeviceManager.css';

function MachInfoDrawer({ data }){
    let { info, realtime } = data;
    let { 
        device_name, device_model, device_no, sequence_code, factory_code, brand_name, company_name, 
        buy_date, make_date, size, weight, frequency, specific_power, guarantee, guarantee_date, buy_amount,
        maintain_date, next_maintain_date, department, install_position, factory_link, tags, depreciation, 
        rated_power, work_ele, work_volte,
        img_url } = info || {};
    let { } = realtime || {};
    return (
        <div className={style['info-container']}>
            <div className={style['info-item']}>
                <div className={style['info-item-title']}>基础信息</div>
                <div className={style['info-item-content']}>
                    <div style={{ display:'flex', alignItems:'center' }}>
                        <div style={{ width:'20%'}}><img src={img_url} style={{ width:'100%' }} /></div>
                        <div className={style['flex-container']} style={{ width:'80%' }}>
                            <div className={style['flex-item']}>
                                <span className={style['flex-item-label']}>
                                    设备名称:
                                </span>
                                <span className={style['flex-item-content']}>
                                    { device_name || '-- --' }
                                </span>
                            </div>
                            <div className={style['flex-item']}>
                                <span className={style['flex-item-label']}>
                                    所属公司:
                                </span>
                                <span className={style['flex-item-content']}>
                                    { company_name || '-- --'}
                                </span>
                            </div>
                            <div className={style['flex-item']}>
                                <span className={style['flex-item-label']}>
                                    品牌:
                                </span>
                                <span className={style['flex-item-content']}>
                                    { brand_name || '-- --' }
                                </span>
                            </div>
                            <div className={style['flex-item']}>
                                <span className={style['flex-item-label']}>
                                    型号:
                                </span>
                                <span className={style['flex-item-content']}>
                                    { device_model || '-- --'}
                                </span>
                            </div>
                            <div className={style['flex-item']}>
                                <span className={style['flex-item-label']}>
                                    资产编号:
                                </span>
                                <span className={style['flex-item-content']}>
                                    { device_no || '-- --'}
                                </span>
                            </div>
                            <div className={style['flex-item']}>
                                <span className={style['flex-item-label']}>
                                    序列码:
                                </span>
                                <span className={style['flex-item-content']}>
                                    { sequence_code || '-- --'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style['info-item']}>
                <div className={style['info-item-title']}>属性信息</div>
                <div className={style['info-item-content']}>
                    <div className={style['flex-container']}>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                出厂日期:
                            </span>
                            <span className={style['flex-item-content']}>
                                { make_date || '-- --' }
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                购买日期:
                            </span>
                            <span className={style['flex-item-content']}>
                                { buy_date || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                购买金额(元):
                            </span>
                            <span className={style['flex-item-content']}>
                                { buy_amount || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                外形尺寸:
                            </span>
                            <span className={style['flex-item-content']}>
                                { size || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                重量:
                            </span>
                            <span className={style['flex-item-content']}>
                                { weight || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                频率:
                            </span>
                            <span className={style['flex-item-content']}>
                                { frequency || '-- --' }
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                比功率:
                            </span>
                            <span className={style['flex-item-content']}>
                                { specific_power || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                额定功率:
                            </span>
                            <span className={style['flex-item-content']}>
                                { rated_power || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                工作电流(A):
                            </span>
                            <span className={style['flex-item-content']}>
                                { work_ele || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                工作电压(V)
                            </span>
                            <span className={style['flex-item-content']}>
                                { work_volte || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                部门
                            </span>
                            <span className={style['flex-item-content']}>
                                { department || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                安装位置
                            </span>
                            <span className={style['flex-item-content']}>
                                { install_position || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                厂商联系方式
                            </span>
                            <span className={style['flex-item-content']}>
                                { factory_link || '-- --'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style['info-item']}>
                <div className={style['info-item-title']}>质保信息</div>
                <div className={style['info-item-content']}>
                    <div className={style['flex-container']}>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                            最新保养时间
                            </span>
                            <span className={style['flex-item-content']}>
                                { maintain_date || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                            下次保养时间
                            </span>
                            <span className={style['flex-item-content']}>
                                { next_maintain_date || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                保修期限(月)
                            </span>
                            <span className={style['flex-item-content']}>
                                { guarantee || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                保修截止日期
                            </span>
                            <span className={style['flex-item-content']}>
                                { guarantee_date || '-- --'}
                            </span>
                        </div>
                        <div className={style['flex-item']}>
                            <span className={style['flex-item-label']}>
                                折旧年限
                            </span>
                            <span className={style['flex-item-content']}>
                                { depreciation || '-- --'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(MachInfoDrawer, areEqual);