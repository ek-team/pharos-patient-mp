// pages/orderDetail/orderDetail.js
const {
  http
} = require("../../utils/http");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0, //订单id
    orderDetail: {}, //订单详情
    showProtocol: false,
    protocoDetail: {},
    codeImg: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      orderId: options.id
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
    this.getOrderDetailById();

    this.getOrderQr();

  },

  copyOrder() {
    http('user/copyUser', 'get', '', {
      id: this.data.orderId
    }).then(res => {




      if (res.code == 0) {

        wx.showToast({
          title: '复制成功,等待跳转',
          icon: 'none',

        })
        setTimeout(function () {

          wx.navigateTo({
            url: '../selectPatient/selectPatient',
          })



        }, 2000)




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
          title: '复制失败',
          icon: 'none'
        })
      }







    })




  },
  // 订单详情
  getOrderDetailById() {
    http('purchase/order/user/orderDetail', 'get', '', {
      orderId: this.data.orderId
    }).then(res => {



      if (res.code == 0) {

        this.setData({
          orderDetail: res.data
        })
        this.getProtocolDetail()



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



      // console.log('协议id',res.data.servicePack.protocolId)
    })


  },

  getOrderQr() {

    http('wxMa/getMaQrCOdeByCopyUser', 'get', '', {
      id: this.data.orderId
    }).then(res => {


      if (res.code == 0) {


        console.log(res.data)


        // let url = 'data:image/png;base64,' + wx.arrayBufferToBase64(res.data)
        this.setData({
          codeImg: res.data
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
          title: '获取二维码失败',
          icon: 'none'
        })
      }


    })
  },

  toApplyDetail(e) {
    // let item=e.currentTarget.dataset.item




    console.log(this.data.orderDetail)


    if (this.data.orderDetail.status == 1) {



      wx.showModal({
        content: '当前订单还未支付，请先支付',
        cancelText: '取消',
        confirmText: '去付款',
        complete: (res) => {
          if (res.cancel) {

          } else if (res.confirm) {

            this.toPay()
          }
        }
      })


      return
    }

    wx.navigateTo({
      url: '../serviceDetail/serviceDetail?id=' + this.data.orderDetail.userServicePackageInfoId,
    })
  },
  // 协议详情
  getProtocolDetail() {
    let protocolId = this.data.orderDetail.servicePack.protocolId
    // let url=
    http('protocols/getById/' + protocolId, 'get').then(res => {



      if (res.code == 0) {

        this.setData({
          protocolDetail: res.data
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
          title: '获取协议详情失败',
          icon: 'none'
        })
      }



      // console.log('协议内容',this.data.showProtocol)
    })
  },
  // 产品详情购买页
  toGoodsDetail() {
    console.log('订单详情', this.data.orderDetail)
    // return
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?id=' + this.data.orderDetail.servicePackId,
    })
  },
  // 去支付
  toPay() {
    // console.log(this.data.orderDetail.orderNo);
    var that = this;
    http('wxpay/unifiedOrder', 'get', '', {
      orderNo: that.data.orderDetail.orderNo,
    }, true).then(res => {




      if (res.code == 0) {




        let payData = res.data
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
            that.getOrderDetailById();
          },
          fail(err) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }
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
          title: '支付订单失败',
          icon: 'none'
        })
      }








    })

  },
  // 查看协议
  viewProtocol() {

    this.setData({
      showProtocol: true
    })
  },
  closeProrocol() {
    this.setData({
      showProtocol: false
    })
  },
  // 拨打客服电话
  callToService(e) {
    let serviceinfo = e.currentTarget.dataset.serviceinfo
    if (!serviceinfo) {
      return
    }
    // console.log('服务信息',serviceinfo.afterSaleMobile)
    var that = this;
    wx.showModal({
      title: serviceinfo.afterSaleText + '\n' + serviceinfo.afterSaleMobile,
      cancelText: '暂不',
      cancelColor: '#666666',
      confirmText: '立即拨打',
      confirmColor: '#576B95',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: serviceinfo.afterSaleMobile,
            success: function () {
              console.log('拨打电话成功')
            },
            fail: function () {
              console.log('拨打电话失败')
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //  查看发票
  viewBillImage() {
    wx.previewImage({
      urls: [this.data.orderDetail.billImage],
    })
  },
  // 查看物流
  toLogisticInfo() {
    wx.navigateTo({
      url: '../logisticInfo/logisticInfo?id=' + this.data.orderId,
    })
  },
  // 回收
  toRetrieveOrder() {
    wx.navigateTo({
      url: '../createRetrieveOrder/createRetrieveOrder?deptId=' + this.data.orderDetail.deptId + '&orderId=' + this.data.orderId,
    })
  },
  // 确认收货
  receipt() {
    let that = this
    wx.showModal({
      content: '确保实际收到货后再确认收货',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          http('purchase/order/confirmReceieve', 'get', '', {
            id: that.data.orderId
          }, true).then(res => {






            if (res.code == 0) {


              that.getOrderDetailById();
              wx.setStorageSync('listRefresh', true)

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
                title: '确认收货失败',
                icon: 'none'
              })
            }



          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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