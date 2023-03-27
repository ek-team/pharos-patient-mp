// pages/chooseServiceTeam/chooseServiceTeam.js
import { http } from "../../utils/http"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    team: [],
    servicePackId: null,//产品id
    doctorTeamId: 0,//选择的医生id
    doctorTeamName:'',//选择的医生团队名字
    checkedTeam:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderDetail = wx.getStorageSync('orderDetail')
    this.setData({
      servicePackId: orderDetail.servicePackId
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
    this.getTeam();
    if (wx.getStorageSync('doctorTeam')) {
      this.setData({
        doctorTeamId: wx.getStorageSync('doctorTeam').doctorTeamId,
        doctorTeamName: wx.getStorageSync('doctorTeam').doctorTeamName
      })
    }
  },

  // 查询团队
  getTeam() {
    http('servicePack/queryDoctorTeamByServicePackId', 'get', '', {
      servicePackId: this.data.servicePackId
    }).then(res => {
      // console.log(res.data)
      let team=res.data;
      team.map((item,index)=>{
        if(item.id==this.data.doctorTeamId){
          item.checked=true;
          this.data.checkedTeam=[item.id]
        }else{
          item.checked=false;
        }
      })
      this.setData({
        team: team,
        checkedTeam:this.data.checkedTeam
      })
    })
  },
  // 选择团队
  teamChange(e) {
    // console.log('选择',e.detail)
    for (let i = 0, len = this.data.team.length; i < len; ++i) {
      this.data.team[i].checked = this.data.team[i].id == e.detail.value.split('+')[0]
      if(this.data.team[i].checked){
        this.data.checkedTeam=[this.data.team[i].id]
      } 
    }
    this.setData({
      doctorTeamId: e.detail.value.split('+')[0],
      doctorTeamName:e.detail.value.split('+')[1],
      team:this.data.team,
      checkedTeam:this.data.checkedTeam
    })
  },
  // teamChoose(e){
  //   let item=e.currentTarget.dataset.item
  //   let index=e.currentTarget.dataset.index
  //   this.data.team[index].checked=true
  //   this.setData({
  //     doctorTeamId: item.id,
  //     doctorTeamName: item.name,
  //     team:this.data.team,
  //   })
  // },
  // 确认
  confirm() {
    if(this.data.checkedTeam.length==0){
      wx.showToast({
        title: '请选择主治医生！',
        icon:'none'
      })
      return
    }
    wx.setStorageSync('doctorTeam', {
      doctorTeamId:this.data.doctorTeamId,
      doctorTeamName:this.data.doctorTeamName
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