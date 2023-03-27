// pages/service/service.js
const { http } = require("../../utils/http");
const app = getApp();
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
    idCard:null,
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
          idCard:app.globalData.idCard,
      })
    //   console.log('身份证',this.data.idCard)
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
    http('userServicePackageInfo/listByIdCard','get','',{
      useStatus:this.data.activeIndex==1?1:this.data.activeIndex==2?2:'',
      idCard:this.data.idCard
    }).then(res=>{
        this.setData({
            serviceList:res.data,
            noLoading:true,
            isTrigger:false,
        })
        if(res.data&&res.data.length>0){
            wx.setStorageSync('id',res.data[0].userId)
            wx.setStorageSync('nickname',res.data[0].user.nickname)
            wx.setStorageSync('token',res.data[0].user.token)
            app.linkInit()
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
  backFaros(){
    wx.navigateToMiniProgram({
        appId: 'wx5e46dffdc68e71cd',
        // extraData: data,
        path: 'pages/consulting/consulting',
        success: res => {
        console.log('打开成功')
        },
        fail: res => {
        console.log('打开失败',res)
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