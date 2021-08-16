import request from "./hppt.js"

// 获取全部的mv
export function getAllMv(){
    return request ({
        url:'/mv/all',
        method:'get',
        params:{limit:100}
    })
}

// 获取mv的视频
export function getMvUrl(id){
    return request ({
        url:'/mv/url',
        method:'get',
        params:id
    })
}

// 获取mv的评论点赞数据
export function getMvdetailInfo(mvid){
    return request ({
        url:'/mv/detail/info',
        method:'get',
        params:mvid
    })
}
// 获取mv的评论
export function getMvComment(id){
    return request ({
        url:'/comment/mv',
        method:'get',
        params:id
    })
}
// 获取相似mv
export function getMvsimi(id){
    return request ({
        url:'/simi/mv',
        method:'get',
        params:id
    })
}
// 获取mv的歌手等具体信息
export function getMvdetail(mvid){
    return request ({
        url:'/mv/detail',
        method:'get',
        params:mvid
    })
}