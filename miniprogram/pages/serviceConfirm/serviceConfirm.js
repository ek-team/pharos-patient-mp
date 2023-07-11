// pages/serviceConfirm/serviceConfirm.js
const {
  http
} = require("../../utils/http");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {}, //订单详情
    doctorTeam: {}, //选择的医生信息
    patient: {}, //选择的就诊人信息
    teamDiseases: [], //病种
    diseasesPopup: false, //病种弹框
    checkedDiseases: {}, //选择的病种
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
    let orderDetail = wx.getStorageSync('orderDetail')

    console.log(orderDetail)
    this.setData({
      orderDetail: orderDetail
    })
    if (wx.getStorageSync('doctorTeam')) {
      this.setData({
        doctorTeam: wx.getStorageSync('doctorTeam')
      })
    }
    if (wx.getStorageSync('patient')) {
      this.setData({
        patient: wx.getStorageSync('patient')
      })
    }

  },
  // 选择团队
  chooseTeam() {
    wx.navigateTo({
      url: '../chooseServiceTeam/chooseServiceTeam',
    })
  },
  // 选择就诊人
  choosePatient() {
    wx.navigateTo({
      url: '../choosePatient/choosePatient',
    })
  },
  // 选择病种
  chooseDisease() {
    // if (!this.data.doctorTeam.doctorTeamId) {
    //   wx.showToast({
    //     title: '请选择您的医生服务团队',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // } else {
    this.setData({
      diseasesPopup: true
    })
    http('servicePack/queryDiseasesByServicePackId', 'get', '', {
      servicePackId: this.data.orderDetail.servicePackId
    }).then(res => {






      if (res.code == 0) {




        this.setData({
          teamDiseases: res.data
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


    })
    // }
  },
  //关闭病种弹框
  closeDiseasesPopup() {
    this.setData({
      diseasesPopup: false
    })
  },
  // 确认选择病种
  confirmDiseases(e) {
    console.log(e.detail.value)
    this.setData({
      checkedDiseases: e.detail.value,
      diseasesPopup: false
    })
    wx.setStorageSync('diseasesId', e.detail.value.id)

  },
  // 下一步
  nextStep() {
    if (!this.data.doctorTeam.doctorTeamId) {
      wx.showToast({
        title: '请选择主治医生',
        icon: 'none',
        duration: 2000
      })
    } else if (!this.data.patient.patientId) {
      wx.showToast({
        title: '请选择就诊人',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../orderConfirm/orderConfirm',
      })
    }
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