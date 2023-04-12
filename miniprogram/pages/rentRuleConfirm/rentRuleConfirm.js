// pages/orderConfirm/orderConfirm.js
const {
  http
} = require("../../utils/http");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payMethods: 1,
    agreeProtocol: false, //同意协议
    orderDetail: {}, //选择的订单详情

    protocoDetail: {}, //协议内容

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

    this.getAgreement()
    this.setData({
      orderDetail: wx.getStorageSync('rentRuleDetail'),
    })


  },

  // 选择支付方式
  checkPayMethods(e) {
    this.setData({
      payMethods: e.currentTarget.dataset.type == 'self' ? 1 : 0
    })
    // console.log(this.data.payMethods)
  },

  // 查询协议
  getAgreement() {
    http('protocols/getById/' + this.data.orderDetail.protocolId, 'get', '').then(res => {
      this.setData({
        protocoDetail: res.data
      })
    })
  },

  // 取消同意协议
  checkAgreeProtocol(e) {
    let agree = e.currentTarget.dataset.agree;
    if (this.data.orderDetail.protocolType == 2 && !this.data.hasRead) {
      // wx.showToast({
      //     title: '请阅读产品协议',
      //     icon: 'none',
      //     duration: 2000
      // })
      this.setData({
        showProtocol: true
      })
    } else {
      this.setData({
        agreeProtocol: agree
      })
    }

  },
  // 查看产品协议
  watchProtocol() {
    this.setData({
      showProtocol: true
    })
  },
  // 关闭产品协议弹框
  closeProrocol() {
    this.setData({
      showProtocol: false
    })
  },
  // 协议滑动到底部
  read() {
    this.setData({
      hasRead: true
    })
  },
  // 点击阅读按钮
  hasRead() {
    if (!this.data.hasRead) {
      wx.showToast({
        title: '请下滑完整阅读使用协议',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        agreeProtocol: true,
        showProtocol: false,
      })
    }
  },
  // 查询协议
  getAgreement() {
    http('protocols/getById/' + this.data.orderDetail.protocolId, 'get', '').then(res => {
      this.setData({
        protocoDetail: res.data
      })
    })
  },



  // 去支付
  toPay() {

    if (!this.data.agreeProtocol) {
      wx.showToast({
        title: '请同意产品协议',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.getOrder();
    }



  },
  // 生成订单
  getOrder() {
    if (this.data.payMethods == 1) { //微信支付

      http('purchase/order/rentRuleOrder', 'get', '', {
        rentRuleId: this.data.orderDetail.rentRuleId,
        userOrderNo: this.data.orderDetail.orderNo
      }).then(res => {
        console.log(res.data)
        let payData = res.data;
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
            wx.redirectTo({
              url: '../myOrder/myOrder',
            })

          },
          fail(err) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 2000,
              mask: true
            })
            wx.redirectTo({
              url: '../myOrder/myOrder',
            })
          }
        })
      })
    } else { //好友代付
      if (this.data.disablePay) {
        wx.showToast({
          title: '请勿重复点击！',
          icon: 'none'
        })
        return
      }
      this.setData({
        disablePay: true
      })
      wx.showLoading({
        title: '加载中',
      })
      http('purchase/order/createOrder', 'post', '', {
        patientUserId: this.data.patient.patientId,
        servicePackId: this.data.orderDetail.servicePackId,
        doctorTeamId: this.data.doctorTeam.doctorTeamId,
        saleSpecDescIds: this.data.orderDetail.saleSpecId,
        productSpec: this.data.orderDetail.productSpec,
        addressId: this.data.address.id,
        deliveryDate: this.data.chooseDate,
        orderType: this.data.orderDetail.buy,
        diseasesId: this.data.diseasesId,
        rentDay: this.data.orderDetail.rentDay,
        operationTime: this.data.operateTime + ' 00:00:00',
      }).then(resp => {
        wx.hideLoading()
        let that = this
        // console.log('好友代付返回图片链接',resp)
        if (resp.data) {
          wx.downloadFile({
            // url:'https://ewj-pharos.oss-cn-hangzhou.aliyuncs.com/avatar/1673839083879_94a380d7.png',//分享的图片的链接
            url: resp.data, //分享的图片的链接
            success: (res) => {
              // wx.hideLoading()
              wx.showShareImageMenu({
                path: res.tempFilePath,
                success: () => {
                  wx.showToast({
                    title: '成功！',
                    icon: 'none'
                  })
                },
                fail: () => {

                },
                complete: () => {
                  setTimeout(() => {
                    // that.setData({
                    //     disablePay:false
                    // })
                    wx.navigateTo({
                      url: '../myOrder/myOrder',
                    })
                  }, 500)
                }
              })
              wx.hideLoading()
              console.log('分享图片', res)
            },
            fail: () => {
              wx.hideLoading()
            },
          })
        }

      })
    }

  },

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