// pages/addAddress/addAddress.js
const {
  http
} = require("../../utils/http");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['省', '市', '区'],
    regionCode: [],
    defaultAddress: false,
    name: '', //收货人姓名
    phone: '', //联系电话
    address: '', //详细地址
    saveDisabled: false, //保存按钮的diasbled
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

  },
  // 选择地址
  bindRegionChange: function (e) {
    // console.log(e.detail.code)
    this.setData({
      region: e.detail.value,
      regionCode: e.detail.code
    })
  },
  // 设置为默认的地址
  addressChange(e) {
    // console.log(e.detail.value)
    this.setData({
      defaultAddress: e.detail.value
    })
  },
  // 收货人姓名
  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 联系电话
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 详细地址
  addressInput(e) {
    this.setData({
      address: e.detail.value
    })
  },
  // 保存收货地址
  save() {
    if (!this.data.name) {
      wx.showToast({
        title: '请填写收货人姓名',
        icon: 'none'
      })
    } else if (!this.data.phone) {
      wx.showToast({
        title: '请填写收货人手机号',
        icon: 'none'
      })
    } else if (this.data.regionCode.length == 0) {
      wx.showToast({
        title: '请选择省市区',
        icon: 'none'
      })
    } else if (this.data.address == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
    } else {
      this.addAddress();
    }
  },
  // 保存收货地址
  addAddress() {
    this.setData({
      saveDisabled: true
    })
    http('address/saveAddress', 'post', '', {
      addresseeName: this.data.name,
      addresseePhone: this.data.phone,
      province: this.data.region[0],
      city: this.data.region[1],
      area: this.data.region[2],
      address: this.data.address,
      isDefault: this.data.defaultAddress ? 1 : 0
    }).then(res => {
      if (res.code == 0) {
        this.setData({
          saveDisabled: false
        })
        wx.showToast({
          title: '添加地址成功',
          icon: 'none'
        })
        wx.navigateBack({
          delta: 1,
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
          title: '添加地址失败',
          icon: 'none'
        })
      }


    }).catch(err => {
      this.setData({
        saveDisabled: false
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