import request from "./hppt.js"
// 获取全部排行榜
export function gettoplist(){
    return request ({
        url:'/toplist',
        method:'get'
    })
}
// 获取排行榜详情
export function getPlaylistDetail(id){
    return request ({
        url:'/playlist/detail',
        method:'get',
        params:id
    })
}