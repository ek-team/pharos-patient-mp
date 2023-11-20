import {
  http
} from "../../utils/http"

// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 订单状态 1-待付款 2-待发货 3-待收货 4-使用中
    orderStatus: [{
        id: 0,
        name: '待付款',
        status: 1,
        pic: '../../images/icon_fukuan.png',
        num: 0
      }, {
        id: 1,
        name: '待发货',
        status: 2,
        pic: '../../images/icon_fahuo.png',
        num: 0
      }, {
        id: 2,
        name: '待收货',
        status: 3,
        pic: '../../images/icon_shouhuo.png',
        num: 0
      }, {
        id: 3,
        name: ' 使用中',
        status: 4,
        pic: '../../images/icon_shiyong.png',
        num: 0
      },
      // {
      //   id:4,
      //   name:'待回收',
      //   status:4,
      //   pic:'../../images/icon_huishou.png'
      // }
    ],
    // 回收订单 0-待邮寄 1-待收货 2-待审核 3-待打款 4-待收款 5-回收完成
    retrieveOrderStatus: [
      //   {
      //   id: 0,
      //   name: '待邮寄',
      //   status: 0,
      //   pic: '../../images/icon_fukuan.png',
      //   num: 0
      // },
      {
        id: 1,
        name: '待收货',
        status: 1,
        pic: '../../images/icon_fahuo.png',
        num: 0
      }, {
        id: 2,
        name: '待审核',
        status: 2,
        pic: '../../images/icon_shouhuo.png',
        num: 0
      }, {
        id: 3,
        name: ' 待打款',
        status: 3,
        pic: '../../images/icon_shiyong.png',
        num: 0
      },
      {
        id: 4,
        name: '待收款',
        status: 4,
        pic: '../../images/icon_huishou.png',
        num: 0
      }
    ],
    // mene
    menuList: [{
        id: 0,
        name: '就诊人管理',
        pic: '../../images/icon_mine_1.png',
        path: '../choosePatient/choosePatient'
      }, {
        id: 1,
        name: '地址管理',
        pic: '../../images/icon_mine_2.png',
        path: '../myAddress/myAddress'
      },
      // {
      //   id: 2,
      //   name: '锻炼数据',
      //   pic: '../../images/icon_mine_1.png',
      //   path: '../exerciseData/exerciseData'
      // },
      {
        id: 3,
        name: '联系客服',
        pic: '../../images/icon_mine_3.png',
        path: '../help/help'

      },
      //  {
      //   id: 4,
      //   name: '意见反馈',
      //   pic: '../../images/icon_mine_4.png'
      // }
      //, 

      {
        id: 5,
        name: '隐私政策',
        pic: '../../images/icon_mine_6.png',
        path: '../privacy/privacy'
      }
      // ,
      
      // {
      //   id: 6,
      //   name: '问题解答',
      //   pic: '../../images/icon_mine_5.png',
      //   path: '../question/question'
      // }

    ],
    info: {}, //用户信息

    trainCardId: null,
    settingPhone: '021-63056365'

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
    this.getUserInfo();


  },

  toMyOrder(e) {
    let status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: '../myOrder/myOrder?status=' + status,
    })

    // wx.navigateTo({
    //   url: '../servicePage/servicePage',
    // })

    //  wx.navigateTo({
    //       url: '../servicePage/servicePage?idCard=340123199403255796',
    //     })
    // wx.navigateTo({
    //   url: '../bindDoctor/bindDoctor?doctorId=2000',
    // })

  },

  toUpdateUser(e) {

    wx.navigateTo({
      url: '../savePersonInfo/savePersonInfo',
    })
  },

  toMyRetrieveOrder(e) {
    let status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: '../myRetrieveOrder/myRetrieveOrder?status=' + status,
    })
  },
  toMySportData() {


    http('user/listPatientUser', 'get', '').then(res => {
      let patientList = res.data;

      if (res.code == 0) {
        if (patientList) {

          if (patientList.length == 0) {

            if (this.data.trainCardId != null) {

              wx.navigateTo({
                url: '../exerciseData/exerciseData?idCard=' + this.data.trainCardId

              })


            } else {

              wx.showModal({
                title: '暂无就诊人以及未绑定设备用户',
                cancelText: '暂不',
                cancelColor: '#666666',
                confirmText: '添加',
                confirmColor: '#576B95',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../addPatient/addPatient',

                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }




          } else {


            if (patientList.length == 1) {
              console.log(patientList[0].idCard)

              wx.navigateTo({
                url: '../exerciseData/exerciseData?idCard=' + patientList[0].idCard + '&phone=' + patientList[0].phone,

              })



            } else {
              wx.navigateTo({
                url: '../selectPatient/selectPatient',

              })
            }
          }

        } else {

          wx.showToast({
            title: '获取就诊人失败',
            icon: 'none'
          })
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
          title: '获取就诊人失败',
          icon: 'none'
        })
      }


    })

  },
  toPage(e) {
    let url = e.currentTarget.dataset.url
    if (url) {
      // if (url == '../privacy/privacy') {
      //   wx.redirectTo({
      //     url: url,
      //   })
      // } else {
      if (url == '../choosePatient/choosePatient') {
        url = '../choosePatient/choosePatient?type=edit'
      }
      if (url == '../exerciseData/exerciseData') { //用户锻炼数据

        if (this.data.info.idCard) {
          url = '../exerciseData/exerciseData?idCard=' + this.data.info.idCard
        } else {
          wx.showToast({
            title: '暂无数据！',
            icon: 'none'
          })
          return
        }
      }



      if (url == '../help/help') {




        http('dept/getSettingPhone', 'get', '', {

          deptId: this.data.info.deptId

        }).then(resp => {



          let phone = this.data.settingPhone
          if (resp.code == 0) {
            if (resp.data != null) {

              phone=resp.data
            }
          }

          wx.showModal({
            title: '拨打客服电话' + '\n' + phone,
            cancelText: '暂不',
            cancelColor: '#666666',
            confirmText: '立即拨打',
            confirmColor: '#576B95',
            success(res) {
              if (res.confirm) {
                wx.makePhoneCall({
                  phoneNumber: phone,
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

        })



        return
      }
      wx.navigateTo({
        url: url,
      })
      // }
    }
  },
  // 获取用户信息
  getUserInfo() {
    http('user/info', 'get').then(res => {



      if (res.code == 0) {

        console.log(res.data)
        this.setData({
          info: res.data
        })


        this.getOrderNum();
        this.getRetrieveOrder();
        this.getByXtUserId();


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
          title: '获取用户信息失败',
          icon: 'none'
        })
      }

    })
  },
  // 获取设备用户
  getByXtUserId() {
    http('/palnUser/getByXtUserId', 'get').then(res => {

      console.log(res.data)

      res.data && this.setData({

        trainCardId: res.data.idCard

      })
    })
  },
  // 获取订单
  getOrderNum() {
    http('/purchase/order/user/listMyStateCount', 'get').then(res => {




      if (res.code == 0) {

        let orderStatus = this.data.orderStatus;
        orderStatus[0].num = res.data.pendingPayment;
        orderStatus[1].num = res.data.pendingDelivery;
        orderStatus[2].num = res.data.pendingReward;
        orderStatus[3].num = res.data.usedCount;
        this.setData({
          orderStatus: orderStatus
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
          title: '获取数据失败',
          icon: 'none'
        })
      }



      // console.log(res.data)
      //   private int pendingPayment;//待付款
      // private int pendingDelivery;//待发货
      // private int pendingReward;//待收货
      // private int usedCount;//使用种
      // private int pendingRecycle;//待回收

    })
  },
  // 回收单
  getRetrieveOrder() {
    http('retrieveOrder/listRetrieveOrderMyStateCount', 'get').then(res => {





      if (res.code == 0) {
        let retrieveOrderStatus = this.data.retrieveOrderStatus;
        retrieveOrderStatus[0].num = res.data.pendingPayment;
        retrieveOrderStatus[1].num = res.data.pendingDelivery;
        retrieveOrderStatus[2].num = res.data.pendingReward;
        retrieveOrderStatus[3].num = res.data.usedCount;
        this.setData({
          retrieveOrderStatus: retrieveOrderStatus
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
          title: '获取数据失败',
          icon: 'none'
        })
      }

      // console.log(res.data)
      // private int pendingPayment;//待收货
      // private int pendingDelivery;///待审核
      // private int pendingReward;//待大款
      // private int usedCount;//待收款
      // private int pendingRecycle//回收完成

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