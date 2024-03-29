const {noticeLogin}=require("../utils/noticeLogin");
// const baseUrl = 'https://pharos3.ewj100.com/';
const  baseUrl = 'https://home.ekang.tech/';
const app = getApp();
function http(url, method, auth,data = {}, isShowLoading = false) {
    // data.token = wx.getStorageSync('token')
    if (isShowLoading) {
        wx.showLoading({
            title: '加载中...'
        })
    }
    let headerData={}
    if(auth||wx.getStorageSync('token')){
        headerData={
            'content-type': 'application/json ',
            'Authorization':auth||'Bearer '+wx.getStorageSync('token')
        }
    }else{
        headerData={
            'content-type': 'application/json ',
        }
    }
    return new Promise(function (resolve, reject) {
        wx.request({
            url: `${baseUrl}${url.replace(/^\/?(.*)/, '$1')}`, //仅为示例，并非真实接口地址。
            data: data,
            header: headerData,
            method: method || 'GET',
            success: (res) => {
                if (res.data.code == 200) {
                    resolve(res.data)
                } else if (res.data.code == 401) {

                  
                  
                    wx.clearStorageSync();
                    noticeLogin();
                    wx.showToast({
                      title: '账号认证'+res.data.msg,
                      icon: 'none'
                    })
                } else {
                    resolve(res.data)
                }
            },
            fail() {
                wx.showToast({
                    icon: 'none',
                    title: '加载失败,请稍后重试'
                })
                reject()
            },
            complete() {
                if (isShowLoading) {
                    wx.hideLoading();
                }
            }
        });
    })

}
export {
    http,
    baseUrl
};
