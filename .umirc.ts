import { defineConfig } from 'umi';

export default defineConfig({
    title:'智慧空压站',
    // links:[{ rel:'icon', href:'./avatar.png'}],
    nodeModulesTransform: {
        type: 'none',
    },
    metas: [
        {
          httpEquiv: 'Cache-Control',
          content: 'no-cache',
        },
        {
          httpEquiv: 'Pragma',
          content: 'no-cache',
        },
        {
          httpEquiv: 'Expires',
          content: '0',
        },
    ],
    hash:true,
    routes: [
        { path: '/login', component: '@/pages/routes/login_page' },
        { path:'/agent', component:'@/pages/routes/agent_manager'},
        { 
            path:'/', 
            component:'@/pages/index.tsx',
            routes:[
                { path:'/gas_home', component:'@/pages/routes/index_page'},
                { path:'/gas_system', component:'@/pages/routes/sys_monitor'},
                { path:'/cost_monitor', component:'@/pages/routes/cost_manager' },
                { path:'/gas_warning', component:'@/pages/routes/alarm_manager'},
                { path:'/gas_mach', component:'@/pages/routes/device_manager'},
                { path:'/gas_table', component:'@/pages/routes/data_report'},
                { path:'/gas_report', component:'@/pages/routes/analyze_report'},
                { path:'/gas_control', component:'@/pages/routes/sys_control'},
                { path:'/sys_setting', component:'@/pages/routes/sys_setting'},
                { path:'/', component:'@/pages/routes/index_page'}
                // { path:'/test', component:'@/pages/routes/Test2'}
                // { path:'/sw_meter', component:'@/pages/routes/terminal_mach'},
                // { path:'/sw_ctrl', component:'@/pages/routes/smart_manager'},
                // { path:'/sw_realtime', component:'@/pages/routes/realtime_data'},
                
            ]
        }
    ],
    fastRefresh: {},
});
