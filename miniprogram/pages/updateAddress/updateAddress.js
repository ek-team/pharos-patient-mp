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
    addOrUpdate: 0, // 0添加地址 1修改地址
    id: null, //修改地址，地址的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
      regionCode: [1]
    })
    this.getAddressDetail();
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



      wx.showModal({
        title: "修改地址【当前修改仅针对当前地址修改，如有订单使用原地址，请联系客服】",
        cancelText: '取消',
        cancelColor: '#666666',
        confirmText: '确定',
        confirmColor: '#576B95',

        success: (res) => {
          if (res.confirm) {
            this.updateAddressPost()
          } else if (res.cancel) {
            console.log('取消')
          }
          
        }
       
      })
      


    }
  },
  // 修改收获地址
  updateAddressPost() {
    this.setData({
      saveDisabled: true
    })
    http('address/updateAddress', 'post', '', {
      id: this.data.id,
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
          title: '修改成功',
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
          title: '修改成功',
          icon: 'none'
        })
      }



    }).catch(err => {
      this.setData({
        saveDisabled: false
      })
    })
  },
  // 查询地址
  getAddressDetail() {
    http('address/getById', 'get', '', {
      id: this.data.id
    }).then(res => {




      if (res.code == 0) {

        console.log(res.data)
        let addressInfo = res.data;
        let region = [];
        region[0] = addressInfo.province;
        region[1] = addressInfo.city;
        region[2] = addressInfo.area;
        this.setData({
          name: addressInfo.addresseeName,
          phone: addressInfo.addresseePhone,
          region: region,
          address: addressInfo.address,
          defaultAddress: addressInfo.isDefault == 1 ? true : false
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
          title: '查询地址失败',
          icon: 'none'
        })
      }






    })
  },
  // 删除收货地址
  delAddress() {

    wx.showModal({
      title: "删除地址后该地址将不再保存",
      cancelText: '取消',
      cancelColor: '#666666',
      confirmText: '确定',
      confirmColor: '#576B95',
      success(res) {
        if (res.confirm) {
        

    http('address/deleteAddress', 'get', '', {
      id: this.data.id
    }).then(res => {



      if (res.code == 0) {
        // console.log(res.data)
        wx.showToast({
          title: '删除成功',
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
          title: '删除失败',
          icon: 'none'
        })
      }


    })
        } else if (res.cancel) {
          console.log('取消')
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