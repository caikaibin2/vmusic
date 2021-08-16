import request from "./hppt.js"

export function getBanner(){
    return request ({
        url:'/banner?type=3',
        method:'get'
    })
}
// 获取推荐歌单
export function getRecommendsongList(){
    return request({
        url:'/personalized?limit=15',
        method:'get'
    })
}

// 获取推荐mv
export function getRecommendmMv(){
    return request({
        url:'/personalized/mv?limit=15',
        method:'get'
    })
}

// 获取推荐新音乐
export function getRecommendNewsong(){
    return request({
        url:'/personalized/newsong?limit=15',
        method:'get'
    })
}

// 获取推荐电台
export function getRecommendDjprogram(){
    return request({
        url:'/personalized/djprogram?limit=15',
        method:'get'
    })
}

// 获取推荐节目
export function getRecommendProgram(){
    return request({
        url:'/program/recommend?limit=15',
        method:'get'
    })
}
// 获取音乐的信息
export function getSongDetail(ids){
    return request({
        url:'/song/detail',
        method:'get',
        params:ids
    })
}
// 获取用户信息
export function getUserInfo(uid){
    return request({
        url:'/user/detail',
        method:'get',
        params:uid
    })
}
// 获取用户歌单之类的信息
export function getSubcount(params){
    return request({
        url:'/user/subcount',
        method:'get',
        params
    })
}
// 刷新登录状态
export function getLoginRefresh(){
    return request({
        url:'/login/refresh',
        method:'get'
    })
}