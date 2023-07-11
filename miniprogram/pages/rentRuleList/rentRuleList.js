// pages/rentRuleList/rentRuleList.js

const {
  http
} = require("../../utils/http");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    orderDetail: {}, //订单详情
    rentRuleOrderList: [],
    isTrigger: true,

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,

    })
    console.log(options.orderNo)

    this.getwindowHeight();

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderDetailById();
  },
  // 订单详情
  getOrderDetailById() {
    http('purchase/order/user/orderDetail', 'get', '', {
      orderId: this.data.orderId
    }).then(res => {


      if (res.code == 0) {


        console.log(res.data)
        this.setData({
          orderDetail: res.data,
          rentRuleOrderList: res.data.rentRuleOrderList.reverse(),
          isTrigger: false
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
          title: '获取订单详情失败',
          icon: 'none'
        })
      }







    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  torentRuleOrder(e) {



    wx.navigateTo({
      url: '../rentRuleOrder/rentRuleOrder?orderNo=' + this.data.orderDetail.orderNo + '&servicePackId=' + this.data.orderDetail.servicePack.id,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  //   下拉刷新
  pullRefresher() {
    this.getOrderDetailById();
  },
  getwindowHeight() {
    let res = wx.getSystemInfoSync();
    let boxHeight = res.windowHeight - 50;
    this.setData({
      boxHeight: boxHeight
    });

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})