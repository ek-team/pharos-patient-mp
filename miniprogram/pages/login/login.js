// pages/login/login.js
const { http } = require("../../utils/http");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},//用户信息

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 登录
  getUserProfile(e) {
    var that = this;
    // 获取用户信息
    wx.getUserProfile({
      desc: '获取你的昵称、头像',
      success: (res) => {
        console.log('获取头像',res.userInfo)
        let userInfo=res.userInfo
        if(userInfo.nickName=='微信用户'&&userInfo.avatarUrl=='https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'){
          res.userInfo.avatarUrl='https://ewj-pharos.oss-cn-hangzhou.aliyuncs.com/image/I1lUJHY3kx2Jeb029b45223cf0b345e93c5aba955867.png'
          // https://thirdwx.qlogo.cn/mmopen/vi_32/3ibjhMNTPzZA06rHicBvLSh5HOlRY8q7kQloTX2dfZ9qAoGdEqCprz3BHBdyBONKiaia85kKWq4SMOqGlYhZXOGk7A/132
          // https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132
        }
        // console.log('获取到的用户信息',res)
        that.setData({
          userInfo: res.userInfo
        })
        // 获取code
        wx.login({
          success(res) {
            if (res.code) {
              console.log(res.code)
              // 登录获取token
              http('social/token', 'post', 'Basic dGVzdDp0ZXNO', {
                social: 'MA@' + res.code
              }).then(res => {
                // console.log('登录后',res.data)
                wx.setStorageSync('nickname', res.data.nickname)
                wx.setStorageSync('token', res.data.access_token)
                wx.setStorageSync('id', res.data.user_id)
                app.linkInit()
                that.updateUserInfoById();
                // 修改身份信息
              })
            } else {
              console.log('登陆失败')
            }
          }
        })
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: '您拒绝了请求'
        })
        return;
      }
    })
  },
  // 更新身份信息
  updateUserInfoById() {
    http('user/updateById', 'post', '', {
      id: wx.getStorageSync('id'),
      nickname: this.data.userInfo.nickName,
      avatar: this.data.userInfo.avatarUrl,
      token:wx.getStorageSync('token'),
    }).then(res => {
      console.log(res.data)
      let pages = getCurrentPages();
      if (pages[pages.length - 2]) {
        //如果有上一页，就返回上一页
        wx.navigateBack({//返回
          delta: 1
        })
      } else {
        wx.switchTab({
          url: '../my/my',
        });
      }
    })
  },
  // 查看隐私政策
  readPolicy(){
    wx.navigateTo({
      url: '../privacy/privacy',
    })
  },

  //同意隐私协议
  checkAgreeProtocol(){

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
