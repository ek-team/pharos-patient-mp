// app.js
App({
  globalData: {
    // url: 'wss://pharos3.ewj100.com/ws',
    url: 'ws://192.168.9.10:8071/ws',
    socketTask: '',
    callback: function () { },
    idCard:null,
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }

    // this.globalData = {};
  },
  onShow(options) {

    if(!wx.getStorageSync('noClose')){
      this.linkInit()
    }else{
      wx.removeStorageSync('noClose')
    }
    // console.log(options.referrerInfo,'接收的别的小程序参数')
    if(options.referrerInfo&&options.referrerInfo.extraData){
      this.globalData.idCard= options.referrerInfo.extraData.idCard
    }
    
  },
  onHide() {
    let that = this
    let removeChannel = {
      msgType: "REMOVE_CHANNEL"
    }
    if(!wx.getStorageSync('noClose')){
      that.globalData.socketTask.send({
        data: JSON.stringify(removeChannel),
        success: () => {
          that.globalData.socketTask.close();
          console.log('发送关闭新消息成功',)
        },
        fail: () => {
          console.log('发送关闭新消息失败')
        }
      })
      console.log('关闭关闭')
    }

    // this.globalData.socketTask.close();
  },
  linkInit() {
    var that = this;
    //建立连接
    this.globalData.socketTask = wx.connectSocket({
      url: this.globalData.url,
      success() {
        console.log('建立连接成功')
      },
      fail(res) {
        console.log('建立连接失败')
        // that.linkInit()
      }
    })
    that.initEventHandle()
  },
  initEventHandle() {
    this.globalData.socketTask.onOpen((result) => {
      if (!wx.getStorageSync('id')){
        return
      }
      // 发送认证
      let userInfoData = {
        id: wx.getStorageSync('id'),
        nickname: wx.getStorageSync('nickname')
      }

    
      let author = {
        msgType: "REQUEST_AUTH",  //
        userInfo: JSON.stringify(userInfoData)			//发送的内容
      }
      console.log('认证参数---',author)
      this.sendMessage(author)

    })
    // 接收消息
    this.getChatMessage()
    //监控失败操作
    this.globalData.socketTask.onError((result) => {
      // console.log("socket错误");
      this.globalData.socketTask.close()
      // this.linkInit()
    })
    // 监听关闭
    this.globalData.socketTask.onClose((result) => {
      console.log('关闭socket')
    })
  },
  // 发送消息
  sendMessage(data) {

    console.log(data)
    let that = this
    if(!that.globalData.socketTask.send){
      that.linkInit()
    }
    that.globalData.socketTask.send({
      data: JSON.stringify(data),
      fail: () => {
        let oldData = wx.getStorageSync('sendData');
        if(data.msgType=='REQUEST_READ'||data.msgType=='REQUEST_AUTH'){
          console.log('发送失败',data)
        }
        if (oldData) {
          oldData.push(data)
          wx.setStorageSync('sendData', oldData)
        } else {
          oldData = [];
          oldData.push(data)
          wx.setStorageSync('sendData', oldData)
        }
        that.linkInit()
      },
      success: () => {
        if (data.msgType != 'PING') {
          // console.log('发送成功',data)
        }

      }
    })

  },
  // 接收信息
  // 接收聊天信息
  getChatMessage() {
    this.globalData.socketTask.onMessage((result) => {
      let data = JSON.parse(result.data)
      // console.log('新消息',data)
      if (data.msgType == 'AUTH_REQUIRED') {//收到认证失败
        console.log('认证失败')
        this.linkInit()
        return;
      } else if (data.msgType == 'AUTH_RESULT' && data.data == true) {//认证成功
        console.log('认证成功',data)
        let oldData = wx.getStorageSync('sendData')
        if (oldData && oldData.length > 0) {
          oldData.map(item => {
            this.sendMessage(item);
          })
          console.log('重新发送')
          wx.setStorageSync('sendData', [])
        }
      } else if (data.msgType == 'PING') {
        //  console.log('保持心跳连接',data)
        let chatPing = {
          msgType: 'PONG'
        }
        this.globalData.socketTask.send({
          data: JSON.stringify(chatPing)
        })
      } else if (data.msgType == 'PONG') {

      } else if (data.msgType == 'TIP_NEWMESSAGE') {
        // console.log('收到对方新消息', data)
        // if (data.noReadCount > 0) {
        //   // let noReadCount = data.noReadCount;
        //   wx.setTabBarBadge({
        //     index: 0,  //tabBar序号，从0开始计数
        //     text: data.noReadCount.toString()
        //   })
        // } else if (data.noReadCount > 99) {
        //   wx.setTabBarBadge({
        //     index: 0,  //tabBar序号，从0开始计数
        //     text: '99+'
        //   })
        // }
        // else {
        //   wx.removeTabBarBadge({
        //     index: 0,
        //   })
        // }
      }
      this.globalData.callback(result)

    })
  },
});
