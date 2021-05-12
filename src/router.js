import Vue from 'vue'
import Router from 'vue-router'

//import组件模块
import HelloWorld from './components/HelloWorld'
import DataCompare from './components/DataCompare'
import SeatMap from './components/SeatMap'
import doorTicket from './components/roomDoorTicket'


Vue.use(Router)  //使用插件

export default new Router({
    mode: 'history',  // 在创建的 router 对象中，如果不配置 mode，就会使用默认的 hash 模式，该模式下会将路径格式化为 #! 开头
    routes: [
        {
            path: '/',   //  定义为/会默认显示这个页面
            name: 'home',
            component: HelloWorld,
        },
        {
            path: '/data',
            name: 'data',
            component: DataCompare
        },
        {
            path: '/seat',
            name: 'seat',
            component: SeatMap
        },
        {
            path: '/door',
            name: 'door',
            component: doorTicket
        }
    ]
})
