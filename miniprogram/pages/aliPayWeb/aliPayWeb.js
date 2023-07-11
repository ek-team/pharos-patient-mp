// pages/exerciseData/exerciseData.js

const {
  baseUrl,
  http
} = require("../../utils/http");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: null,
    url: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNo: options.orderNo,

      url: baseUrl + 'record.html#/newPharosTest/aliPay?orderNo=' + options.orderNo,
    })

    console.log(this.data.url)
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


    this.getAliPayStatus();

  },


  getAliPayStatus() {
    http('purchase/order/user/orderDetailByOrderNo', 'get', '', {
      orderNo: this.data.orderNo
    }).then(res => {



      if (res.code == 0) {
        if (res.data.status != 1) {
          wx.showToast({
            title: '当前订单已经支付了,2秒后跳转',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '../myOrder/myOrder',
            })
          }, 2000)
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
          title: '获取订单状态失败',
          icon: 'none'
        })
      }




    })
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