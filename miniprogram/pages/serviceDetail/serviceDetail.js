// pages/serviceDetail/serviceDetail.js
const {
  http
} = require("../../utils/http");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dovctorTeam: {
      doctorTeamPeopleList: []
    },
    serviceInfo: {},
    activeIndex: 0,
    id: null,
    serviceStatus: 1, //服务有效状态，0为有效，1为过期
    patientId: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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

    this.getServiceDetail()
  },


  getServiceDetail() {
    http('userServicePackageInfo/getDetail', 'get', '', {
      id: this.data.id
    }).then(res => {





      if (res.code == 0) {


        if (res.data) {
          console.log('服务详情', res.data)
          let expiredTime = new Date(res.data.expiredTime).getTime()
          if (new Date().getTime() < expiredTime) {
            this.setData({
              serviceStatus: 0,
            })
          }
          // res.data.servicePackageInfo.image=null
          this.setData({
            dovctorTeam: res.data.doctorTeam,
            serviceInfo: res.data,
            patientId: res.data.userOrder.patientUserId
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
          title: '获取服务包详情数据失败',
          icon: 'none'
        })
      }



    })
  },
  changeNav(e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.value
    })
  },
  toChat(e) {
    let item = e.currentTarget.dataset.item
    // console.log('服务详情',this.data.serviceInfodoctorTeam.name)
    // return
    // 使用服务
    // if(item.useCount<=item.totalCount&&item==0){
    http('chatUser/useService', 'get', '', {
      userServiceId: this.data.serviceInfo.id
    }).then(res => {


      if (res.code == 0) {

        // console.log('使用服务接口',res.data)
        let params = '&chatUserId=' + this.data.serviceInfo.chatUserId + '&name=' + this.data.serviceInfo.doctorTeam.name + '&teamId=' + this.data.serviceInfo.doctorTeam.doctorTeamPeopleList[0].teamId
        if (res.data == 1) {
          wx.setStorageSync('chatParams', params)
          params = '&id=' + this.data.serviceInfo.doctorTeam.doctorTeamPeopleList[0].teamId + '&type=团队' + '&from=free' + '&chatUserId=' + this.data.serviceInfo.chatUserId


          if (this.data.patientId != null) {
            wx.navigateTo({
              url: '../requestConsultation/requestConsultation?userServiceId=' + this.data.serviceInfo.id + params + '&patientId=' + this.data.patientId,
            })
          } else {
            wx.navigateTo({
              url: '../requestConsultation/requestConsultation?userServiceId=' + this.data.serviceInfo.id + params
            })
          }



          return
        } else if (res.data == 2) {
          wx.showToast({
            title: ' 当前已有待接收的咨询申请',
            icon: 'none'
          })
          return
        }

        if (this.data.patientId != null) {
          wx.navigateTo({
            url: '../chatPage/chatPage?userServiceId=' + this.data.serviceInfo.id + params + '&patientId=' + this.data.patientId,
          })
        } else {
          wx.navigateTo({
            url: '../chatPage/chatPage?userServiceId=' + this.data.serviceInfo.id + params
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
          title: '获取数据失败',
          icon: 'none'
        })
      }


    })
    // }
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