// pages/service/service.js
const { http } = require("../../utils/http");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:0,
    navList:[{title:'全部',id:1},{title:'待使用',id:2},{title:'已使用',id:3}],
    serviceList:[],
    isTrigger:false,
    noLoading:false,
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
    this.getwindowHeight()
    this.getServiceList()
  },

  checkNav(e){
    this.setData({
        activeIndex:e.currentTarget.dataset.index,
        serviceList:[],
    })
    this.getServiceList()
  },
  // 服务列表
  getServiceList(){
    this.setData({
      noLoading:false,
    })
    http('userServicePackageInfo/listByUserId','get','',{
      useStatus:this.data.activeIndex==1?1:this.data.activeIndex==2?2:''
    }).then(res=>{
      this.setData({
        serviceList:res.data,
        noLoading:true,
        isTrigger:false,
      })
    })
  },
  getwindowHeight() {
    let res = wx.getSystemInfoSync();
    let boxHeight = res.windowHeight - 50;
    this.setData({
      boxHeight: boxHeight
    });
    
  },
  toServiceDetail(e){
    wx.navigateTo({
      url: '../serviceDetail/serviceDetail?id='+e.currentTarget.dataset.item.id,
    })
  },
  // 下拉刷新
  pullRefresher(){
      this.setData({
        serviceList:[]
      })
      this.getServiceList()
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