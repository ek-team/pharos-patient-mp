// pages/logisticInfo/logisticInfo.js
const { http } = require("../../utils/http");
const {noticeLogin}=require("../../utils/noticeLogin");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // logisticsName:'',//快递公司
        // logisticsNo:'',//快递单号
        // courierNo: '',//快递单号
        // orderno:'',//订单编号
        // logisticsData:{},
        // phone:'',
        // address:'',
        // status:'',
        id:null,
        logisticsInfo:{},
        logisticsCom:null,
        userOrder:{},
        type:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id:options.id
          })
          // console.log(options.orderno)
          if(options.type){
            this.getRetrieveLogistics();
          }else{
            this.getLogistics();
          }

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
    // 复制
  copy() {
    var that=this;
    wx.setClipboardData({
      data: that.data.id,
      success (res) {
          console.log('物流信息',res.data)
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  // 回收订单物流
  getRetrieveLogistics(){
    wx.showLoading({
      title: '加载中',
    })
    http('/express/user/retrieveExpressData','get','',{
      id:this.data.id
    }).then(res=>{
      // console.log(res.data,'回收单物流信息')
      if(!res.data){
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
          return
      }
      wx.hideLoading()
      let logisticsInfo=res.data
      this.setData({
        logisticsInfo:res.data.data,
        // logisticsInfo:[res.data.data[1]],
        userOrder:res.data.userOrder,
        logisticsCom:logisticsInfo.com=='zhongtong'?'中通':logisticsInfo.com=='jd'?'京东':logisticsInfo.com=='debangkuaidi'? '德邦':logisticsInfo.com=='shunfeng'?
        '顺丰':logisticsInfo.com=='jtexpress'?'极兔':logisticsInfo.com=='yuantong'?'圆通':logisticsInfo.com=='shentong'?'申通': logisticsInfo.com=='yunda'?'韵达':
        logisticsInfo.com=='youzhengguonei'?'邮政':logisticsInfo.com=='huitongkuaidi'?'百世':logisticsInfo.com=='annengwuliu'?'安能':logisticsInfo.com=='yousuwuliu'?'优速':''

    })
    })
  },
  // 订单物流信息
  getLogistics(){
    http('/express/user/orderMapTrace','get','',{
      id:this.data.id
    }).then(res=>{
      // console.log('订单物流信息',res)
        let logisticsInfo=res.data
        this.setData({
            logisticsInfo:res.data.data,
            // logisticsInfo:[res.data.data[1]],
            userOrder:res.data.userOrder,
            logisticsCom:logisticsInfo.com=='zhongtong'?'中通':logisticsInfo.com=='jd'?'京东':logisticsInfo.com=='debangkuaidi'? '德邦':logisticsInfo.com=='shunfeng'?
            '顺丰':logisticsInfo.com=='jtexpress'?'极兔':logisticsInfo.com=='yuantong'?'圆通':logisticsInfo.com=='shentong'?'申通': logisticsInfo.com=='yunda'?'韵达':
            logisticsInfo.com=='youzhengguonei'?'邮政':logisticsInfo.com=='huitongkuaidi'?'百世':logisticsInfo.com=='annengwuliu'?'安能':logisticsInfo.com=='yousuwuliu'?'优速':''

        })
    console.log('物流信息',res.data)
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
