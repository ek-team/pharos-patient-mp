// pages/choosePatient/choosePatient.js
const {
  http
} = require("../../utils/http");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientList: [], //就诊人列表
    patientId: null, //选择的就诊人id
    patientName: '', //选择的就诊人名字
    checkedPatient: [],
    type: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
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
    this.getPatientList();
    // 用户反复选择就诊人，就诊人页面需要回显上一次的选择
    if (wx.getStorageSync('patient')) {
      this.setData({
        patientId: wx.getStorageSync('patient').patientId,
        patientName: wx.getStorageSync('patient').patientName
      })
    }

  },

  // 查询就诊人列表
  getPatientList() {
    http('user/listPatientUser', 'get', '').then(res => {




      if (res.code == 0) {



        let patientList = res.data;
        patientList.map((item, index) => {
          if (item.id == this.data.patientId) {
            item.checked = true;
            this.data.checkedPatient = [item.id]
          } else {
            item.checked = false;
          }
        })
        this.setData({
          patientList: patientList,
          checkedPatient: this.data.checkedPatient,
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
          title: '查询就诊人列表失败',
          icon: 'none'
        })
      }








    })
  },
  // 选择就诊人
  patientChange(e) {
    for (let i = 0, len = this.data.patientList.length; i < len; ++i) {
      this.data.patientList[i].checked = this.data.patientList[i].id == e.detail.value.split('+')[0]
      if (this.data.patientList[i].checked) {
        this.data.checkedPatient = [this.data.patientList[i].id]
      }
    }
    let patientId = e.detail.value.split('+')[0];
    let patientName = e.detail.value.split('+')[1];
    this.setData({
      patientId: patientId,
      patientName: patientName,
      patientList: this.data.patientList,
      checkedPatient: this.data.checkedPatient,
    })
    console.log(patientId, patientName, this.data.patientList)

  },
  patientCheck(e) {
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    this.data.patientList[index].checked = true
    this.setData({
      patientId: item.id,
      patientName: item.name,
      patientList: this.data.patientList,
    })
    // console.log('选择就诊人',item)
  },
  // 点击编辑
  toLook(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)

    wx.navigateTo({
      url: '../exerciseData/exerciseData?idCard=' + item.idCard+'&phone=' + item.phone,
    })
    
  },
  // 就诊人确认
  confirm() {
    if (this.data.checkedPatient.length == 0) {
      wx.showToast({
        title: '请选择就诊人',
        icon: 'none'
      })
      return
    }
    wx.setStorageSync('patient', {
      patientId: this.data.patientId,
      patientName: this.data.patientName
    })
    wx.navigateBack({
      delta: 1,
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