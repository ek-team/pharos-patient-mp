// pages/chooseServiceTeam/chooseServiceTeam.js
import {
  http
} from "../../utils/http"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyList: [],


    searchName: '',
    companyCreditCode: 0, //
    companyName: '', //

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //this.getCompanyCode();

  },

  // 监听关键字change
  onChange(e) {


    this.setData({
      searchName: e.detail
    })




  },

  onSearch() {


    if(this.data.searchName.length>=3){
      this.getCompanyCode()
    }else{

      wx.showToast({
        title: '请至少输入三个字获取公司抬头和税号',
        icon: 'none'
      })

      
    }
  },

  // 查询团队
  getCompanyCode() {
    http('bill/getCompany', 'get', '', {
      name: this.data.searchName
    }).then(res => {


      if (res.code == 0) {
        console.log(res.data)
        let companyList = res.data.result;

        this.setData({
          companyList: companyList,
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
          title: '查询团队失败',
          icon: 'none'
        })
      }






    })
  },
  // 选择团队
  teamChange(e) {
    // console.log('选择',e.detail)
    for (let i = 0, len = this.data.companyList.length; i < len; ++i) {
      this.data.companyList[i].checked = this.data.companyList[i].creditCode == e.detail.value.split('+')[0]

    }
    this.setData({
      companyCreditCode: e.detail.value.split('+')[0],
      companyName: e.detail.value.split('+')[1],

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

    wx.setStorageSync('selectComPanyName', this.data.companyName)
    wx.setStorageSync('selectTaxNumber', this.data.companyCreditCode)


    console.log(this.data.companyName)
    console.log(this.data.companyCreditCode)
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