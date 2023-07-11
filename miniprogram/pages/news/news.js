import { http } from "../../utils/http"
const app = getApp();

// pages/news/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: {
      pageNum: 1,
      pageSize: 10,
    },
    total: 0,//消息数量
    searchName: '',//搜索
    messageList: [],//聊天列表
    isTrigger: false,//当前下拉刷新状态，true被触发，false未被触发
    boxHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getwindowHeight();
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
    let page = {
      pageNum: 1,
      pageSize: 10,
    }
    this.setData({
      page: page,
      total: 0,
      messageList: [],
      searchName: '',
    })
    this.getChatUser();
    this.getChatList();
  },
  // 获取页面高度
  getwindowHeight() {
    let res = wx.getSystemInfoSync();
    let boxHeight = res.windowHeight - 50;
    this.setData({
      'boxHeight': boxHeight
    });
  },
  // 下拉刷新
  pullRefresher() {
    let page = {
      pageNum: 1,
      pageSize: 10,
    }
    this.setData({
      page: page,
      total: 0,
      messageList: [],
      searchName: '',
      isTrigger: true
    })
    this.getChatUser();

  },
  // 滚动到底部时触发
  scrollList() {
    if (this.data.messageList.length < this.data.total) {
      let page = this.data.page;
      page.pageNum++;
      this.setData({
        page: page
      });
      this.getChatUser();
    }
  },
  // 获取聊天用户
  getChatUser() {
    http('chatUser/pageChatUsers', 'post', '', {
      ...this.data.page,
      searchName: this.data.searchName
    }, true).then(res => {
      // console.log(res.data)
    




      if (res.code == 0) {
        var messageList = [];
        messageList = this.data.messageList.concat(this.lastTime(res.data.records))
        this.setData({
          messageList: messageList,
          total: res.data.total,
          isTrigger: false
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
          title: '查询聊天列表失败',
          icon: 'none'
        })
      }





    })
  },
  // 最后一条消息的时间处理
  lastTime(arr) {
    
    var date = new Date()
    date = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate()
    arr.forEach(element => {
      element.msgTime = element.lastChatTime
      const curPhone = wx.getSystemInfo({
        success: function (res) {
          if (res.platform!='android') {
            console.log('苹果手机')
            // let date=new Date(element.lastChatTime).getTime()
            // console.log(date)
            // element.lastChatTime = new Date(parseInt(date)).toLocaleString()
            // console.log(element.lastChatTime,element.lastChatTime,'手机信息',res)

            // element.lastChatTime=date
          }else{
            if(element.serviceEndTime!=''&&new Date()< new Date(element.serviceEndTime)){
              element.canService=true;
            }else{
              element.canService=false;
            }
            if (element.msgTime) {
              let getDate = new Date(element.msgTime)
              let time = element.msgTime//最后一条消息时间
              let timeSlot
              let hours = new Date(time).getHours()
              if (hours <= 12) {
                timeSlot = '上午'
              } else {
                timeSlot = '下午'
                hours = hours - 12
              }
              // 分
              let timeMinute = new Date(time).getMinutes()
              if (timeMinute < 10) {
                timeMinute = '0' + timeMinute
                if (timeMinute == 0) {
                  timeMinute = '00'
                }
              }
              getDate = getDate.getFullYear() + '-' + getDate.getMonth() + '-' + getDate.getDate()
              element.lastChatTime = new Date(time).getFullYear() + '/' + (new Date(
                time).getMonth() + 1) + '/' + new Date(time).getDate() + ' ' + timeSlot + hours +
                ':' + timeMinute
              if (date == getDate) {
                element.lastChatTime = element.lastChatTime.split(" ")[1]
              }
            }
          }
          
        }
      })
      

    });
    return arr
  },
  // 监听关键字change
  onChange(e) {
    let page = {
      pageNum: 1,
      pageSize: 10,
    }
    this.setData({
      page: page,
      total: 0,
      messageList: [],
      searchName: e.detail
    })
    this.getChatUser();
  },
  // socket
  getChatList() {
    let _this = this
    app.globalData.callback = function (res) {
      let data = JSON.parse(res.data)
      // console.log(data)
      if (data.msgType == 'TIP_NEWMESSAGE' || data.msgType == 'TIP_GROUP_NEWMESSAGE') {// 对方的新消息（单聊）或者群聊
        if (_this.data.messageList.length <= 0) { //聊天列表为空的时候，请求接口
          let page = {
            pageNum: 1,
            pageSize: 10,
          }
          _this.setData({
            page: page,
            total: 0,
            messageList: [],
            searchName: '',
          })
          _this.getChatUser();
        } else {
          let have = true;
          _this.data.messageList.map((item, index, arr) => {//当前聊天列表发来新消息
            let msg = JSON.parse(data.msg)
            console.log('未读新消息-----',data.msg)
            console.log('未读新消息+++++',item)
            if (item.targetUid == data.fromUid&&data.patientId==item.patientId) {
              _this.data.messageList.splice(index, 1)
              item.lastMsg = msg.msg
              item.hasNewMsg = item.hasNewMsg + 1;
              // console.log(item.hasNewMsg,'未读消息&&&&&&&&&&&')
              item.lastChatTime = msg.createTime
              let newMsg = [item]
              newMsg = _this.lastTime(newMsg)
              _this.data.messageList.unshift(item)
              have = false;
              return;
            }
          })
          // _this.data.messageList=_this.lastTime(_this.data.messageList)
          _this.setData({
            messageList: _this.data.messageList
          })
          if (have) {//请求聊天列表
            let page = {
              pageNum: 1,
              pageSize: 10,
            }
            _this.setData({
              page: page,
              total: 0,
              messageList: [],
              searchName: '',
            })
            _this.getChatUser();
          }
        }
      }
    }
  },
  // 跳转到聊天页面
  toChatPage(e){
    let chatUserId=e.currentTarget.dataset.chatuserid;
    let item=e.currentTarget.dataset.item;
    console.log(chatUserId)
    console.log(item)
    // console.log(item.groupType)
    // if(app.globalData.socketTask&&app.globalData.socketTask.OPEN){
    //   console.log('soket一打开')
    // }
    if(item.groupType==1){//群聊

      if (item.patientId!=null) {
        wx.navigateTo({
          url: '../chatPage/chatPage?chatUserId='+chatUserId+'&name='+item.nickname+'&teamId='+item.doctorTeamPeopleList[0].teamId+'&patientId='+item.patientId,
        })
      }else{
        wx.navigateTo({
          url: '../chatPage/chatPage?chatUserId='+chatUserId+'&name='+item.nickname+'&teamId='+item.doctorTeamPeopleList[0].teamId,
        })
      }
 
    }else{//单聊

      if (item.patientId!=null) {
        wx.navigateTo({
          url: '../chatPage/chatPage?targetUid='+item.targetUid+'&name='+item.nickname+'&chatUserId='+chatUserId+'&patientId='+item.patientId,
        })
      }else{
        wx.navigateTo({
          url: '../chatPage/chatPage?targetUid='+item.targetUid+'&name='+item.nickname+'&chatUserId='+chatUserId,
        })
      }

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