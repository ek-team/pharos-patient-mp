// pages/exerciseData/exerciseData.js
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
      // url:'https://pharos3.ewj100.com/record.html#/ucenter/recovery/userPage/recoveryInfo?idCard='+options.idCard, 
      // url:'https://api.jhxiao-school.com/record.html#/newPharosTest/aliPay?orderNo=1656550545244028928', 
      url: 'https://api.jhxiao-school.com/record.html#/newPharosTest/aliPay?orderNo=' + options.orderNo,
    })
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