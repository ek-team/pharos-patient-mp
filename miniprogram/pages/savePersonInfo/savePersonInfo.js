// pages/savePerdonInfo/savePersonInfo.js
const {
  http,
  baseUrl
} = require("../../utils/http");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      avatar: null,
      nickname: null,
      patientName: null,
      idCard: null,
      operationTime: null,
      operationName: null,
      weight: null,
      id: null,
      phone: null,
    },
    showButton: true,

    doctorId: null,
    doctorTeamId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (!wx.getStorageSync('token')) {
      wx.setStorageSync('token', options.token)
    }

    this.setData({

      doctorId: options.doctorId,
      doctorTeamId: options.doctorTeamId

    })

    this.getUserIngo()
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
  // 获取用户信息
  getUserIngo() {
    http('user/info', 'get').then(res => {
      if (res.code == 0 && res.data) {
        wx.setStorageSync('id', res.data.id)
        app.linkInit()

        this.setData({
          info: {
            avatar: res.data.avatar,
            nickname: res.data.nickname,
            patientName: res.data.patientName,
            idCard: res.data.idCard,
            operationTime: null,
            operationName: null,
            weight: res.data.weight,
            id: res.data.id,
            phone: res.data.phone,
          },
        })
      } else {

        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
      }
    })
  },
  contentInput(e) {
    let type = e.currentTarget.dataset.type
    switch (type) {
      case 'name':
        this.data.info.nickname = e.detail.value
        this.data.info.patientName = e.detail.value
        break
      case 'idCard':
        this.data.info.idCard = e.detail.value
        break
      case 'phone':
        this.data.info.phone = e.detail.value
        break
      case 'phone':
        this.data.info.phone = e.detail.value
        break
      case 'weight':
        this.data.info.weight = e.detail.value
        break
    }
    this.setData({
      info: this.data.info
    })
  },
  // 选择日期
  bindDateChange(e) {
    this.data.info.operationTime = e.detail.value
    this.setData({
      info: this.data.info
    })
  },
  chooseAvatar() {
    let _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading()
        var tempFilePaths = res.tempFilePaths
        let url = baseUrl + 'file/upload'
        wx.uploadFile({
          url: url, //oss上传地址
          filePath: tempFilePaths[0], //filePath只能是String
          fileType: 'image',
          methods: 'post',
          name: 'file',
          header: {
            // 'Content-Type':'application/json',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          formData: {
            dir: 'image/'
          },
          success: (uploadFileRes) => {
            wx.hideLoading()
            if (uploadFileRes.statusCode == '200') {
              // console.log('上传成功',uploadFileRes.data)
              let resImg = JSON.parse(uploadFileRes.data)
              // console.log(resImg,'图片地址测试')
              _this.data.info.avatar = resImg
              _this.setData({
                info: _this.data.info
              })
            }
          },
          fail: (err) => {
            console.log(err);
            wx.hideLoading()
          }
        });
      }
    })
  },
  savePatientInfo() {
    if (!this.data.info.patientName) {
      wx.showToast({
        title: '请输入姓名！',
        icon: 'none'
      })
      return
    }
    if (!this.data.info.idCard) {
      wx.showToast({
        title: '请输入身份证号！',
        icon: 'none'
      })
      return
    }
    // if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.info.idCard))) { 
    //     // reg.test(this.data.patientID) === false
    //   wx.showToast({
    //     title: '身份证输入有误！',
    //     icon:'none'
    //   })
    //   return ; 
    // }

    if (!this.data.info.weight) {
      wx.showToast({
        title: '请输入体重！',
        icon: 'none'
      })
      return
    }
    // console.log('提交的参数',this.data.info)
    // return
    http('user/updateById', 'post', '', this.data.info).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '保存成功！',
        })
        this.setData({
          showButton: false
        })
        setTimeout(() => {
          wx.switchTab({
            url: '../index/index',
          })
        }, 500)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
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