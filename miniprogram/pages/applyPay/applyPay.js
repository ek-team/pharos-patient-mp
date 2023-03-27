// pages/applyPay/applyPay.js
const { http,baseUrl } = require("../../utils/http");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderMoney: 0,//订单金额
    totalMoney: 0,//合计
    payMethods: 1,//1--微信支付，2--找朋友帮忙付
    payInfo:{},
    type:null,//团队或医生
    id:null,//医生id或chstUserId
    chatUserId:null,
    userServiceId:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderMoney:options.money,
      totalMoney:options.money,
      type:options.type,
      id:options.id,
      chatUserId:options.chatUserId,
      userServiceId:options.userServiceId,
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
  // 选择支付方式
  payChange(e) {
    this.setData({
      payMethods: e.detail.value
    })
  },
  // 立即支付
  toPay(){
    let that=this
    if(that.data.payMethods==1){
      // 微信支付
    }else{
      // 找朋友帮忙付
    }
    let form=wx.getStorageSync('commitForm')
    http('doctorPoint/addPatientOtherOrder','post','',form,true).then(res=>{
      // console.log('提交咨询',res.data)
      wx.setStorageSync('noClose', true)
      let payData=res.data
      wx.requestPayment({
        nonceStr: payData.nonceStr,
        package: payData.packageValue,
        paySign: payData.paySign,
        timeStamp: payData.timeStamp,
        signType: payData.signType,
        success(res) {
          wx.showToast({
            title: '支付成功',
            icon: 'none',
            duration: 2000,
             mask: true
          })
          wx.removeStorageSync('commitForm')
          let payMsg={
            msgType: "PIC_CONSULTATION",
            str1:payData.orderId,//订单id
            // chatUserId:that.data.chatUserId
          }
          if(that.data.type=='团队'){
            payMsg.chatUserId=that.data.chatUserId
            // console.log('团队')
          }else{
            payMsg.targetUid=that.data.id
            // console.log('个人')
          }
          app.sendMessage(payMsg)
          // console.log('发送的消息参数',payMsg)
          if(that.data.type=='团队'){
            wx.navigateTo({
              url: '../chatPage/chatPage?userServiceId='+that.data.userServiceId+'&str1='+payData.orderId+'&chatUserId='+that.data.chatUserId+'&typeFrom=request', //+'&from=free'
            })
          }else{
            wx.navigateTo({
              url: '../chatPage/chatPage?userServiceId='+that.data.userServiceId+'&str1='+payData.orderId+'&targetUid='+that.data.id+'&typeFrom=request'+'&chatUserId='+that.data.chatUserId, //+'&from=free'
            })
          }
          
          wx.setStorageSync('chatBack', true)
          // console.log('发送图文咨询消息',payMsg)
          // wx.switchTab({
          //   url: '../news/news',
          // })
          // that.getOrderList()
        },
        fail(err) {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 2000,
            mask: true
          })
          wx.removeStorageSync('commitForm')
          wx.removeStorageSync('noClose')
          wx.switchTab({
            url: '../news/news',
          })
        }
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
    wx.removeStorageSync('commitForm')
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
