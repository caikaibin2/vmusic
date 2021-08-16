import request from "./hppt.js"

// 歌手详情
export function artistdetail(params){
    return request({
        url:'/artist/detail',
        method:'get',
        params
    })
}

export function getArtistSongs(params){
    return request({
        url:'/artist/songs',
        method:'get',
        params
    })
}
// 获取音乐
export function getSongUrl(params){
    return request({
        url:'/song/url',
        method:'get',
        params
    })
}

// 获取歌词
export function getLyric(params){
    return request({
        url:'/lyric',
        method:'get',
        params
    })
}

// 获取歌单详情
export function getplaylist(params){
    return request({
        url:'/playlist/detail',
        method:'get',
        params
    })
}
