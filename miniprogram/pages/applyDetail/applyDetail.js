// pages/applyDetail/applyDetail.js
const {
  http,
  baseUrl
} = require("../../utils/http");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    applyInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getApplyDetail()
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
  // 点击预览大图
  previewBigImg(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.src],
    })
  },

  getApplyDetail() {
    http('doctorPoint/getByPatientOtherOrderId', 'get', '', {
      id: this.data.id
    }).then(res => {


      if(res.code==0){
        this.setData({
          applyInfo: res.data
        })

      } else if(res.code==1){
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }else if(res.code==401){
        wx.showToast({
          title: '账号过期',
          icon: 'none'
        })
      }else if(res.code==500){
        wx.showToast({
          title: '服务器出现异常',
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
      }

      
     
      // console.log('图文咨询详情',res.data)
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