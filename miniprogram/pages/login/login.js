// pages/login/login.js
const {
  http
} = require("../../utils/http");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    agreeProtocol: false, //隐私协议
    code: null,
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


    var that = this;
    // 获取code
    wx.login({
      success(res) {
        if (res.code) {

          that.setData({
            agreeProtocol: wx.getStorageSync('privacyOk', false),
            code: res.code
          })


        } else {
          wx.showToast({
            title: '微信授权登录失败',
            icon: 'none'
          })


          that.setData({
            agreeProtocol: wx.getStorageSync('privacyOk', false),

          })
        }
      }
    })

    that.setData({

    })

  },


  getCode() {
    var that = this;
    // 获取code
    wx.login({
      success(res) {
        if (res.code) {
          that.setData({
            code: res.code
          })
        } else {
          wx.showToast({
            title: '微信授权登录失败',
            icon: 'none'
          })
        }
      }
    })
  },
  // 登录
  getUserProfile(e) {


    var that = this;
    console.log(this.data.agreeProtocol)

    if (!this.data.agreeProtocol) {

      wx.showModal({
        title: '隐私协议',
        content: '查看并同意隐私协议',
        showCancel: true, //是否显示取消按钮
        cancelText: "否", //默认是“取消”
        // cancelColor:'skyblue',//取消文字的颜色
        confirmText: "查看", //默认是“确定”
        // confirmColor: 'skyblue',//确定文字的颜色
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {

            wx.setStorageSync('privacyOk', true)
            wx.navigateTo({
              url: '../privacy/privacy',
            })
            that.setData({
              agreeProtocol: true,
            })
          }
        },
        fail: function (res) {}, //接口调用失败的回调函数
        complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
      })

      return

    }



        // 获取用户信息
        wx.getUserProfile({
          desc: '获取你的昵称、头像',
          success: (res) => {
            console.log('获取头像', res.userInfo)
            let userInfo = res.userInfo
            if (userInfo.nickName == '微信用户' && userInfo.avatarUrl == 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132') {
              res.userInfo.avatarUrl = 'https://oss.ekang.tech/image/I1lUJHY3kx2Jeb029b45223cf0b345e93c5aba955867.png'
              // https://thirdwx.qlogo.cn/mmopen/vi_32/3ibjhMNTPzZA06rHicBvLSh5HOlRY8q7kQloTX2dfZ9qAoGdEqCprz3BHBdyBONKiaia85kKWq4SMOqGlYhZXOGk7A/132
              // https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132
            }
            // console.log('获取到的用户信息',res)
            that.setData({
              userInfo: res.userInfo
            })
            // 获取code
            // 登录获取token
            http('social/token', 'post', 'Basic dGVzdDp0ZXNO', {
              social: 'MA@' + that.data.code
            }).then(res => {
              if (res.code == 0) {
                wx.setStorageSync('privacyOk', false)
                // console.log('登录后',res.data)
                wx.setStorageSync('nickname', res.data.nickname)
                wx.setStorageSync('token', res.data.access_token)
                wx.setStorageSync('id', res.data.user_id)
                app.linkInit()
                that.updateUserInfoById();


              } else if (res.code == 1) {
                wx.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              } else if (res.code == 401) {
                wx.showToast({
                  title: '账号过期',
                  icon: 'none'
                })
              } else if (res.code == 500) {
                wx.showToast({
                  title: '服务器出现异常',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                })
              }
              // 修改身份信息
            })

          },
          fail: (res) => {

            console.log(res)
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
      token: wx.getStorageSync('token'),
    }).then(res => {
      console.log(res.data)
      let pages = getCurrentPages();
      if (pages[pages.length - 2]) {
        //如果有上一页，就返回上一页
        wx.navigateBack({ //返回
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
  readPolicy() {
    wx.navigateTo({
      url: '../privacy/privacy',
    })
  },

  //同意隐私协议
  checkAgreeProtocol() {
    // let agree = e.currentTarget.dataset.agree;
    // if ( !this.data.hasRead) {


    if (this.data.agreeProtocol) {
      this.setData({
        agreeProtocol: false
      })
    } else {
      this.setData({
        agreeProtocol: true
      })
    }

    // } else {
    //     this.setData({
    //         agreeProtocol: agree
    //     })
    // }
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
