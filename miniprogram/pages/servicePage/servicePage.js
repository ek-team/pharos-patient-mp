// pages/service/service.js
const {
  http
} = require("../../utils/http");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    navList: [{
      title: '全部',
      id: 1
    }, {
      title: '待使用',
      id: 2
    }, {
      title: '已使用',
      id: 3
    }],
    serviceList: [],
    isTrigger: false,
    noLoading: false,
    idCard: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   idCard:options.idCard
    // })
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
    this.setData({
      idCard: app.globalData.idCard,


    })
    //   console.log('身份证',this.data.idCard)


    if (this.data.idCard !== null) {
      this.addPatient()
    }

    this.getwindowHeight()
    this.getServiceList()
  },

  checkNav(e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index,
      serviceList: [],
    })
    this.getServiceList()
  },
  // 服务列表
  getServiceList() {
    this.setData({
      noLoading: false,
    })
    http('userServicePackageInfo/listByIdCard', 'get', '', {
      useStatus: this.data.activeIndex,
      idCard: this.data.idCard
    }).then(res => {





      if (res.code == 0) {

        this.setData({
          serviceList: res.data,
          noLoading: true,
          isTrigger: false,
        })
        if (res.data && res.data.length > 0) {
          wx.setStorageSync('id', res.data[0].userId)
          wx.setStorageSync('nickname', res.data[0].user.nickname)
          wx.setStorageSync('token', res.data[0].user.token)
          app.linkInit()
        }


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
          title: '获取数据失败',
          icon: 'none'
        })
      }




    })
  },
  getwindowHeight() {
    let res = wx.getSystemInfoSync();
    let boxHeight = res.windowHeight - 50;
    this.setData({
      boxHeight: boxHeight
    });

  },
  toServiceDetail(e) {
    wx.navigateTo({
      url: '../serviceDetail/serviceDetail?id=' + e.currentTarget.dataset.item.id,
    })
  },

  addPatient() {
    http('user/addPatientUserByIdCard', 'get', '', {

      idCard: this.data.idCard
    }).then(res => {





      if (res.code == 0) {

        wx.showToast({
          title: '增加就诊人成功',
          icon: 'none'
        })

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
          title: '增加就诊人失败',
          icon: 'none'
        })
      }



    })
  },
  // 下拉刷新
  pullRefresher() {
    this.setData({
      serviceList: []
    })
    this.getServiceList()
  },
  backFaros() {
    wx.navigateToMiniProgram({
      appId: 'wx769527d269714369',
      // extraData: data,
      path: 'pages/consulting/consulting',
      success: res => {
        console.log('打开成功')
      },
      fail: res => {
        console.log('打开失败', res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

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