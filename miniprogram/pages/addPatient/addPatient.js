// pages/patientInfo/patientInfo.js
const { http } = require("../../utils/http");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientName: '',//患者姓名
    patientID: '',//患者身份证
    patientSex: 1,//患者性别 1-男 0-女
    patientDate: '',//患者出生年月
    hasUserInfo: true,//是否有用户信息
    userId: null,
    id: null,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id,
        hasUserInfo: true
      })
      this.getPatient();
    } else {
      this.setData({
        hasUserInfo: false
      })
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
  // 查看用户病史
  getPatient() {
    http('user/getPatientUserById','get','',{
    // http('patient/getPatientByID', 'get','',{
      id:this.data.id
    }).then(res => {
      console.log(res.data)
      if (res.data) {
        let patientInfo = res.data;
        this.setData({
          patientName: patientInfo.name,
          patientID: patientInfo.idCard,
          patientSex: patientInfo.sex,
          phone:res.data.phone,
          patientDate: patientInfo.age,
          userId: patientInfo.userId,
          id: patientInfo.id,
          hasUserInfo: true,
        })
      } else {
        this.setData({
          hasUserInfo: false
        })
      }
    })
  },
  // 患者姓名
  patientNameInput(e) {
    this.setData({
      patientName: e.detail.value
    })
  },
  // 患者身份证号
  patientIDInput(e) {
    this.setData({
      patientID: e.detail.value
    })
    if(e.detail.value.length==18){
      let reg=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if(reg.test(e.detail.value) === false) { 
        wx.showToast({
          title: '身份证输入不合法！',
          icon:'none'
        })
        return ; 
      }
      http('user/calculate','get','',{
        idCard:e.detail.value
      }).then(res=>{
        if(res.data){
          this.setData({
            patientDate:res.data.birthday,
            patientSex:res.data.sexCode,
          })
        }
      })
    }
  },
  phoneInput(e){
    this.setData({
      phone: e.detail.value
    })
  },
  // 患者性别
  chooseSex(e) {
    console.log(e.currentTarget.dataset.sex)
    this.setData({
      patientSex: e.currentTarget.dataset.sex
    })
  },
  // 患者出生年月
  bindDateChange: function (e) {
    this.setData({
      patientDate: e.detail.value
    })
  },
  
  // 添加用户信息
  savePatientInfo() {
    console.log(this.data.patientID)
      if(!this.data.patientName){
        wx.showToast({
          title: '请输入姓名！',
          icon:'none'
        })
        return
      }
      if(this.data.patientID.length<18){
        wx.showToast({
          title: '请输入完整的身份证号码！',
          icon:'none'
        })
        return
      }
      if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.patientID))) { 
          // reg.test(this.data.patientID) === false
        wx.showToast({
          title: '身份证输入有误！',
          icon:'none'
        })
        return ; 
      }
      if(!(/^1[3|4|5|7|8]\d{9}$/.test(this.data.phone))){
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      if (this.data.hasUserInfo) {
        this.updateInfo()
      } else {
        this.insertInfo();

      }
    // }
  },
  // 添加用户病史
  insertInfo() {
    http('user/savePatientUser ', 'post','', {
      name: this.data.patientName,
      idCard: this.data.patientID,
      sex: this.data.patientSex,
      age: this.data.patientDate,
      phone:this.data.phone
    }).then(res => {
      console.log(res.data)
      if (res.code == 0) {
        wx.navigateBack({
          delta: 1
        });

      }else if(res.code==1){
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        });
      }
    })
  },
  // 修改用户病史
  updateInfo() {
    http('user/updatePatientUser', 'post', '',{
      name: this.data.patientName,
      idCard: this.data.patientID,
      phone:this.data.phone,
      // sex: this.data.patientSex,
      // age: this.data.patientDate,
      // userId: this.data.userId,
      id: this.data.id
    }).then(res => {
      console.log(res.data)
      if (res.code == 0) {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 1500,
        });
        this.getPatient();
      }else if(res.code==1){
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        });
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