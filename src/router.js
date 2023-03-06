import Vue from 'vue'
import Router from 'vue-router'

//import组件模块
import HelloWorld from './components/HelloWorld' // 忘了
import DataCompare from './components/DataCompare'
import SeatMap from './components/SeatMap'  // 生成座位图
import doorTicket from './components/roomDoorTicket'  // 生成考场门贴
import upload from './components/uploadExcel'  // 数据对比
import generateList from './components/generateList' // 生成资格复审名单
import addData from './components/addKeyItem' // 添加特定数据列
import dataScreen from './components/dataScreen' // 添加特定数据列
import generateWorkerCert from './components/generateWorkerCert'//生成工考证书
import generateAuditionList from './components/generateAuditionList'
import homePage from './components/homepage'


Vue.use(Router)  //使用插件

export default new Router({
    mode: 'history',  // 在创建的 router 对象中，如果不配置 mode，就会使用默认的 hash 模式，该模式下会将路径格式化为 #! 开头
    routes: [
        {
            path: '/',   //  定义为/会默认显示这个页面
            name: 'home',
            component: homePage,
        },
        {
            path: '/helloWorld',   //  定义为/会默认显示这个页面
            name: 'helloWorld',
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
            path: '/doorTicket',
            name: 'door',
            component: doorTicket
        },
        {
            path: '/upload',
            name: 'upload',
            component: upload
        },
        {
            path: '/generateList',
            name: 'generateList',
            component: generateList
        },
        {
            path: '/addData',
            name: 'addData',
            component: addData
        },
        {
            path: '/dataScreen',
            name: 'dataScreen',
            component: dataScreen
        },
        {
            path: '/generateWorkerCert',
            name: 'generateWorkerCert',
            component: generateWorkerCert
        },
        {
            path: '/generateAuditionList',
            name: 'generateAuditionList',
            component: generateAuditionList
        },
        {
            path: '/homePage',
            name: 'homePage',
            component: homePage
        }
    ]
})
