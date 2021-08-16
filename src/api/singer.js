import request from './hppt.js'

// 获取华国歌手
export function getArtistList(params){
    return request ({
        url:'/artist/list',
        mmethod:'get',
        params:params
    })
}
// 获取热门歌曲
export function getHotSingerList(){
    return request ({
        url:'/top/artists',
        mmethod:'get',
        params:{offset:0,limit:10}
    })
}