import request  from "./hppt";
// 发送验证
export function emitCaptcha(params){
    return request({
        url:'/captcha/sent',
        method:'get',
        params
    })
}
// 注册,修改密码
export function emitCellphone(params){
    return request({
        url:'/register/cellphone',
        method:'get',
        params
    })
}
// 登录
export function Login(params){
    return request({
        url:'/login/cellphone',
        method:'get',
        params
    })
}
//检查账号是否被注册了
export function existence(params){
    return request({
        url:'/cellphone/existence/check',
        method:'get',
        params
    })
}