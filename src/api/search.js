import request from './hppt.js'

// 获取搜索关键字推荐
export function getSearchSuggest(params){
    return request ({
        url:'/search/suggest',
        method:'get',
        params
    })
}
// 获取搜索默认关键字
export function getSearchDefault(){
    return request ({
        url:'/search/default',
        method:'get'
    })
}
// 获取热搜列表（简）
export function getSearchHot(){
    return request ({
        url:'/search/hot/detail',
        method:'get'
    })
}
// 获取搜索的结果
export function getSearch(keywords){
    return request ({
        url:'/cloudsearch',
        method:'get',
        params:{keywords,limit:100}
    })
}