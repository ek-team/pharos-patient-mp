// pages/decorationService/decorationService.js
import { http } from "../../utils/http"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,//产品id
    introductionsContent:'',//服务说明

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
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
    this.getServicePackById();

  },
  // 获得富文本
  getServicePackById(){
    http('servicePack/getServicePackById','get','',{
      id:this.data.id
    }).then(res=>{
      this.setData({
        introductionsContent:res.data.introductionsContent
      })
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