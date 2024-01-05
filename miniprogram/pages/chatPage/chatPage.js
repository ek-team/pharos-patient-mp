// pages/chatPage/chatPage.js
const {
  http,
  baseUrl
} = require("../../utils/http");
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = false
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    videoSrc: 'https://oss.ekang.tech/image/USwluot0sCx3f9f7b164332a517b3ff38c2065b9c488.mp4',


    targetUid: null,
    teamId: null,
    chatName: null,
    myUserId: wx.getStorageSync('id'),
    list: [],
    showInput: true,
    showExtendBtn: true,
    chatOpen: true,
    metaDialog: false,
    dialogInfo: {},
    userServiceId: null,
    chatUserId: null,
    patientId: null,
    page: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
    inputMsg: null,
    triggered: false,
    isLoading: false,
    myAvatar: null,
    // 语音
    videoLength: 0,
    timer: null,
    startVoiceInput: false,
    isPlayIndex: null,
    isPlayVoice: false,
    setTimeFun: null,
    playImgone: true, //播放语音时的动态效果
    statusTimer: null, //会话状态
    mainSuit: '',
    showSuit: false,
    paitentSuit: null,
    from: null,
    resquestDetail: {},
    chatType: null,
    freeRequestInfo: null,
    typeFrom: null,
    // showExtend:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.setData({
      userServiceId: options.userServiceId,
      chatUserId: options.chatUserId, //群聊id
      teamId: options.teamId, //团队id
      targetUid: options.targetUid, //单聊目标id
      chatName: options.name, //会话标题名称
      from: options.from,
      typeFrom: options.typeFrom,
      list: [],
      patientId: options.patientId, //就诊人id
    })
    if (options.teamId) {
      this.setData({
        chatType: 1,
      })
      console.log('是群聊')
    } else {
      this.setData({
        chatType: 0,
      })
      console.log('是单聊')
    }
    wx.setNavigationBarTitle({
      title: options.name
    })
    if (options.writeMain) {
      this.setData({
        showSuit: true,
      })
      console.log('填写主诉')
    }
    // console.log('是否发送图文咨询',options.from)
    if (options.from == 'free') {
      let payMsg = {
        msgType: "PIC_CONSULTATION",
        str1: options.str1, //订单id
        chatUserId: options.chatUserId,
        patientId: options.patientId,
      }

      console.log('------------ddddd----' + payMsg)
      app.sendMessage(payMsg)
      wx.showToast({
        title: '图文咨询申请发送成功，等候医生接受',
        icon: 'none',
        duration: 1000,
      })
      // console.log('发送图文咨询')
    }
    if (options.from == 'typeFrom') {
      this.data.resquestDetail.patientOtherOrderStatus = 1


      this.setData({
        resquestDetail: this.data.resquestDetail
      })
    }

    console.log('-------------', this.data.resquestDetail)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!wx.getStorageSync('catImage')) {
      console.log("llllllll")
      this.setData({
        page: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
        list: [],
        myUserId: wx.getStorageSync('id'),
      })
      this.getUserInfo()
      this.getQueryChatTime()
      this.sendReadMsg()
      this.reciveSocketMsg()
    } else {
      wx.removeStorageSync('catImage')
    }



  },
  getUserInfo() {
    http('user/info', 'get').then(res => {





      if (res.code == 0) {


        this.setData({
          myAvatar: res.data.avatar
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
          title: '获取用户详情失败',
          icon: 'none'
        })
      }




    })
  },
  detailQueryChat() {
    if (this.data.resquestDetail && this.data.resquestDetail.chatCount && this.data.resquestDetail.chatCount > 0) {
      this.data.resquestDetail.chatCount--
      this.setData({
        resquestDetail: this.data.resquestDetail
      })
      if (this.data.resquestDetail.chatCount <= 0) {
        this.setData({
          chatOpen: false
        })
      }
    }

  },
  // 获取聊天记录
  getQueryChatTime() {
    let that = this
    // 获取用户信息

    // 查询对话是否有效
    http('chatUser/queryChatTime', 'get', '', {
      chatUserId: this.data.chatUserId
    }).then(res => {


      if (res.code == 0) {


        let serviceEndTime = new Date(res.data.serviceEndTime).getTime()
        this.data.statusTimer = setInterval(() => {
          if (new Date().getTime() > serviceEndTime && res.data.patientOtherOrderStatus != 0) {
            that.data.dialogInfo.status = 2
            that.setData({
              chatOpen: false,
              dialogInfo: that.data.dialogInfo
            })
            clearInterval(that.data.statusTimer)
          }
        }, 1000)
        this.setData({
          dialogInfo: res.data,
          // metaDialog:res.data.status==1?true:false,//控制会话信息弹框,1有效
          chatOpen: res.data.status == 1 || (res.data.patientOtherOrderStatus == 0 && res.data.chatCount) ? true : false, //1为有效，2过期会话过期提示，重新打开会话
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
          title: '获取聊天记录',
          icon: 'none'
        })
      }





    })
    // 查询聊天记录
    this.getChatList()
    // 查询图文咨询信息
    this.getRequestDetail()
    if (this.data.chatType == 1) {
      this.getIsHaveFreeInfo()
    }
  },
  // 查询是否有图文咨询
  getRequestDetail() {
    http('chatUser/getChat', 'get', '', {
      chatUserId: this.data.chatUserId
    }).then(res => {




      if (res.code == 0) {
        this.setData({
          resquestDetail: res.data
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
          title: '获取聊天记录失败',
          icon: 'none'
        })
      }


      // console.log('图文咨询详情',res)
    })
  },
  // 查询是否有免费次数
  getIsHaveFreeInfo() {
    http('userServicePackageInfo/checkHaveUserServicePackageINfo', 'get', '', {
      chatUserId: this.data.chatUserId
    }).then(res => {




      if (res.code == 0) {
        this.setData({
          freeRequestInfo: res.data
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
          title: '获取聊天记录失败',
          icon: 'none'
        })
      }


      console.log('是否有免费次数', res)
    })
  },
  sendReadMsg() {
    let params = {}
    let havereads = {}
    if (this.data.targetUid == undefined) {
      havereads = {
        msgType: "REQUEST_READ",
        chatUserId: this.data.chatUserId
      }
      params = {
        chatUSerId: this.data.chatUserId,
        myUserId: wx.getStorageSync('id')
      }
    } else {
      havereads = {
        msgType: "REQUEST_READ",
        targetUid: this.data.targetUid

      }
      params = {
        targetUid: this.data.targetUid,
        myUserId: wx.getStorageSync('id')
      }
    }
    http('chatMsg/readMsg', 'get', '', params).then(res => {
      //   console.log('已读',res)
    })
    //   app.sendMessage(havereads)
    //   console.log('发送已读消息')
  },
  // 处理聊天时间
  showTime(arr) {
    let changeArr = arr

    console.log("处理数据", arr)
    //给每条消息时间转换为时间戳
    changeArr.forEach((item, index, arr) => {
      item.timeStemp = new Date(item.createTime).getTime()
    })
    changeArr.forEach((item, index, arr) => {
      if (index == (arr.length - 1)) {
        item.showTime = true
        // console.log('&&1',index)
      } else {
        // else if (index != 0) {
        // console.log('&&2',index)
        if ((arr[index].timeStemp - arr[index + 1].timeStemp) > 3600000) {
          item.showTime = true
        } else {
          item.showTime = false
        }
      }
      const curPhone = wx.getSystemInfo({
        success: function (res) {
          if (res.platform == 'android') {
            // console.log('安卓手机')
            let hours = new Date(item.createTime).getHours()
            let timeSlot
            if (hours <= 12) {
              timeSlot = '上午'
            } else {
              timeSlot = '下午'
              hours = hours - 12
            }
            // 分
            let timeMinute = new Date(item.createTime).getMinutes()
            if (timeMinute < 10) {
              timeMinute = '0' + timeMinute
              if (timeMinute == 0) {
                timeMinute = '00'
              }
            }
            item.msgTime = new Date(item.createTime).getFullYear() + '/' + (new Date(item.createTime).getMonth() + 1) + '/' + new Date(item.createTime).getDate() + ' ' + timeSlot + hours + ':' + timeMinute
          } else {


            item.msgTime= item.createTime
           // item.msgTime = new Date(parseInt(item.timeStemp)).toLocaleString()
            // console.log('苹果手机')
          }
        }
      })

    });
    return changeArr
  },
  getChatList() {
    let params = {
      pageNum: this.data.page.pageNum,
      pageSize: this.data.page.pageSize,

    }

    if (this.data.patientId != null || this.data.patientId == undefined) {
      params.patientId = this.data.patientId
    }

    if (this.data.targetUid == undefined) {
      params.chatUserId = this.data.chatUserId
    } else {
      params.targetUid = this.data.targetUid
    }

    http('chatMsg/queryChatMsgHistory', 'post', '', params).then(res => {







      if (res.code == 0) {


        console.log('聊天记录', res.data)


        let list = res.data.total
        list = this.data.list.concat(res.data.records)

        this.data.page.total = res.data.total

        console.log('聊天记录-1', list)
        res.data.records.map(item => {
          if (item.fromUid == this.data.myUserId) {
            this.data.myAvatar = item.user.avatar
          }
        })
        this.showTime(list)

        let formatArr = () => {
          let map = new Map();
          for (let item of list) {
            if (!map.has(item.id)) {
              map.set(item.id, item);
            }
          }
          return [...map.values()];
        }
        list = formatArr();
        console.log(list, "bbbbb")
        console.log(list, "oooooooooo")
        this.setData({
          list: list,
          page: this.data.page,
          isLoading: false,
          myAvatar: this.data.myAvatar
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
          title: '获取聊天记录失败',
          icon: 'none'
        })
      }


    })
  },
  getMoreRecords() {
    if (this.data.page.total > this.data.list.length) {
      this.data.page.pageNum++
      // console.log('到底加载')
      this.setData({
        isLoading: true
      })
      this.getChatList()
    } else {
      this.setData({
        noMoreData: true
      })
    }

  },
  // 发送图片
  sendPicture() {
    wx.setStorageSync('noClose', true)
    let _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading()
        var tempFilePaths = res.tempFilePaths
        console.log('图片地址', res)
        let url = baseUrl + 'file/upload'
        console.log('上传图片', wx.getStorageSync('token'))
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
              console.log('上传成功', uploadFileRes.data)
              let resImg = JSON.parse(uploadFileRes.data)
              console.log(resImg, '图片地址测试')
              tempFilePaths = []
              let picMessage = {
                msgType: "MESSAGE_PIC",
                url: resImg,


              }

              if (_this.data.patientId != null) {
                picMessage.patientId = _this.data.patientId
              }
              if (_this.data.targetUid == undefined) {
                picMessage.chatUserId = _this.data.chatUserId
              } else {
                picMessage.targetUid = _this.data.targetUid
              }
              console.log('发送图片消息', picMessage)
              wx.removeStorageSync('noClose')
              app.sendMessage(picMessage)
              _this.detailQueryChat()
              // _this.data.resquestDetail.chatCount--
              // _this.setData({
              //     resquestDetail:_this.data.resquestDetail
              // })
            }
          },
          fail: (err) => {
            console.log(err);
            wx.hideLoading()
            wx.showToast({
              title: '发送失败',
            })
          }
        });
      }
    })
  },
  sendVideo() {
    let _this = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      // maxDuration: 30,
      camera: 'back',
      success(res) {
        let tempFilePath = res.tempFiles[0].tempFilePath
        console.log('选择的视频', tempFilePath)
        //   return
        wx.showLoading()
        // console.log('上传图片',wx.getStorageSync('token'))
        wx.uploadFile({

          url: baseUrl + 'file/upload', //oss上传地址
          filePath: tempFilePath, //filePath只能是String
          methods: 'post',
          name: 'file',
          header: {
            // 'Content-Type':'application/json',
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          success: (uploadFileRes) => {
            wx.hideLoading()
            if (uploadFileRes.data) {
              let videoUrl = uploadFileRes.data
              videoUrl = videoUrl.substr(1, videoUrl.length - 2)

              console.log('上传视频成功', uploadFileRes.data)
              let videoMessage = {
                msgType: "VIDEO_URL",
                mag: '视频',
                url: videoUrl,

              }

              if (_this.data.patientId != null) {
                videoMessage.patientId = _this.data.patientId
              }
              if (_this.data.targetUid == undefined) {
                videoMessage.chatUserId = _this.data.chatUserId
              } else {
                videoMessage.targetUid = _this.data.targetUid
              }
              console.log('发送视频消息', videoMessage)
              wx.removeStorageSync('noClose')
              app.sendMessage(videoMessage)
              _this.detailQueryChat()
            }
          },
          fail: (err) => {
            console.log(err);
            wx.hideLoading()
            wx.showToast({
              title: '发送失败',
            })
          }
        });
      }
    })
  },
  // 查看大图
  showBigImg(e) {



    wx.setStorageSync('catImage', "catImage")
    http('chatMsg/queryAllMsgIMage', 'get', '', {
      msgId: e.currentTarget.dataset.id
    }).then(res => {







      if (res.code == 0) {




        let iamges = []
        let imgShow = 0;
        if (res.data) {
          if (res.data.length >= 1) {




            for (let i = 0; i < res.data.length; i++) {
              console.log(i + "++++" + res.data[i])
              if (e.currentTarget.dataset.src == res.data[i]) {

                imgShow = i;
              }
              iamges.push(res.data[i])
            }
          }
        }

        wx.previewImage({
          current: iamges[imgShow],
          urls: iamges.reverse(),
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
          title: '获取图片失败',
          icon: 'none'
        })
      }

    })


  },


  toarticle(e) {


    let item = e.currentTarget.dataset.item


    let chatMsgId = item.id
    if (item.fromUid == wx.getStorageSync('id')) {
      chatMsgId = item.str3
    }

    let articleId = item.article.id
    console.log(articleId)
    wx.navigateTo({
      url: '../article/article?articleId=' + articleId + '&chatMsgId=' + chatMsgId,
    })
  },
  // 查看表单
  toForm(e) {
    let item = e.currentTarget.dataset.item
    let type = e.currentTarget.dataset.type
    console.log(item, "pppppp")
    let chatMsgId = item.id
    if (item.fromUid == wx.getStorageSync('id')) {
      chatMsgId = item.str3
    }
    if (type == 'form') {
      wx.navigateTo({
        url: '../form/form?formId=' + item.str1 + '&type=form' + '&chatMsgId=' + chatMsgId,
      })
      console.log('表单推送')
    } else {
      // console.log('随访计划表单详情',item)
      wx.navigateTo({
        url: '../form/form?formId=' + item.followUpPlanNotice.followUpPlanContent.formId + '&followPlanId=' + item.str1 + '&chatMsgId=' + chatMsgId,
      })
    }
  },
  showMetaDialog() {
    this.setData({
      metaDialog: true
    })
  },
  // 输入消息关闭扩展功能
  closeExtend() {
    this.setData({
      showExtend: false,
    })
  },
  // 输入消息
  getInputValue(e) {
    this.setData({
      inputMsg: e.detail.value,
    })
    if (e.detail.value) {
      this.setData({
        showExtendBtn: false,
      })
    } else {
      this.setData({
        showExtendBtn: true,
      })
    }
  },
  // 点击扩展功能
  showExtend() {
    this.setData({
      showExtend: !this.data.showExtend,
      showInput: true,
    })
  },
  // 打开语音输入功能
  openVoice() {
    this.setData({
      showInput: false,
    })
  },
  // 开始语音输入
  startVoice() {
    this.setData({
      videoLength: 0
    })
    //开始录音的时候
    const options = {
      duration: 60000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    this.setData({
      startVoiceInput: true
    })
    console.log('开始录音', options)
    this.data.timer = setInterval(() => {
      this.data.videoLength++
      this.setData({
        videoLength: this.data.videoLength,
      })
    }, 1000)
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('开始录音')
    });
    //错误回调
    recorderManager.onError((res) => {

      console.log(res, '错误回调');
      if (res.errMsg == 'operateRecorder:fail auth deny') {
        // recorderManager.stop();
        this.setData({
          startVoiceInput: false
        })
        wx.showToast({
          title: '麦克风权限未开启，请点击右上角设置开启麦克风权限',
          icon: 'none',
          duration: 1000,
        })
      }

    })
  },
  // 停止语音输入
  stopVoice(e) {
    // console.log('长按结束')
    var that = this;
    var memberid = e.currentTarget.dataset.id;
    recorderManager.stop();
    this.setData({
      microphoneShow: true
    })
    this.setData({
      startVoiceInput: false
    })
    clearInterval(this.data.timer)
    recorderManager.onStop((res) => {
      var list = that.data.vediolist;
      var src = res.tempFilePath; //语音临时文件
      let url = baseUrl + 'file/upload'
      wx.uploadFile({
        url: url,
        name: "file",
        filePath: src, //filePath只能是String
        methods: 'post',
        header: {
          // 'Content-Type':'application/json',
          'token': wx.getStorageSync('token')
        },
        formData: {
          //   user: 'tesdt'
        },
        success: function (res) {
          if (res.statusCode == 200) {
            //   console.log('返回的地址',JSON.parse(res.data))
            let vedio = JSON.parse(res.data)
            let headUrl = that.data.headUrl
            let name = that.data.doctorName
            let vedioMessage = {
              msgType: "VIDEO",
              url: vedio,
              msg: '语音',
              videoDuration: that.data.videoLength, //语音时长

            }

            if (that.data.patientId != null) {
              vedioMessage.patientId = that.data.patientId
            }

            if (that.data.targetUid == undefined) {
              vedioMessage.chatUserId = that.data.chatUserId
            } else {
              vedioMessage.targetUid = that.data.targetUid
            }
            console.log('发送的语音消息', vedioMessage)
            if (that.data.videoLength < 1) {
              wx.showToast({
                title: '说话时间太短',
                icon: 'error',
                // duration: 1000,
                mask: true
              })
            } else {
              app.sendMessage(vedioMessage)
              that.detailQueryChat()
            }
          } else {
            wx.showToast({
              title: res.body,
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: function (res) {
          wx.showToast({
            title: res.body,
            icon: 'none',
            duration: 2000
          });
        }
      });
    })
  },
  // 播放语音
  voiceActive(e) {
    // let msgId=e.currentTarget.dataset.msgid
    let index = e.currentTarget.dataset.voiceindex
    this.setData({
      isPlayIndex: e.currentTarget.dataset.voiceindex
    })

    this.data.list[index].isPlay = true
    this.setData({
      list: this.data.list
    })
    var voiceSrc = e.currentTarget.dataset.voicesrc;
    if (innerAudioContext.autoplay == true) {
      innerAudioContext.autoplay = false
    } else {
      innerAudioContext.autoplay = true
    }
    if (innerAudioContext.autoplay) {
      innerAudioContext.play();
      this.setData({
        isPlayVoice: true
      })
      innerAudioContext.src = voiceSrc;
      innerAudioContext.autoplay = true
      this.data.setTimeFun = setInterval(() => {
        this.data.playImgone = !this.data.playImgone
        this.setData({
          playImgone: this.data.playImgone,
        })
      }, 1000)
      innerAudioContext.onPlay(() => {
        // console.log('监听播放哈哈哈哈哈哈');
      })
    } else {
      innerAudioContext.stop();
      innerAudioContext.autoplay = false
      clearInterval(this.data.setTimeFun)
      innerAudioContext.onStop(() => {
        this.setData({
          isPlayVoice: false
        })
        this.setData({
          list: this.data.list
        })
      })

    }
    innerAudioContext.onEnded(() => {
      // console.log('结束了')
      this.setData({
        isPlayVoice: false
      })
      this.setData({
        list: this.data.list
      })
      clearInterval(this.data.setTimeFun)
      innerAudioContext.autoplay = false
    })
  },
  colseVoice() {
    this.setData({
      showInput: true,
    })
  },
  // 关闭弹框
  closeAllShowPop() {
    this.setData({
      showWithdrawPop: false,
    })
  },
  // 发送消息
  sendMessage() {
    let sendMsg = {
      msgType: "MESSAGE_TEXT",
      msg: this.data.inputMsg,
      //  patientId:this.data.patientId,
    }



    if (this.data.patientId != null) {
      sendMsg.patientId = this.data.patientId
    }
    if (this.data.targetUid == undefined) {
      sendMsg.chatUserId = this.data.chatUserId
    } else {
      sendMsg.targetUid = this.data.targetUid
    }
    if (this.data.remark != 'null') {
      //  sendMsg.remark=this.data.remark
    }
    console.log('发送消息', sendMsg)
    // 发送消息
    app.sendMessage(sendMsg)
    this.detailQueryChat()
    //  this.data.resquestDetail.chatCount--
    //  this.setData({
    //     resquestDetail:this.data.resquestDetail
    //  })
    this.setData({
      inputMsg: '',
      showExtendBtn: true,
    })
  },
  // 接收socket消息
  reciveSocketMsg() {
    let that = this
    app.globalData.callback = function (res) {
      let data = JSON.parse(res.data)
      console.log("---接受消息", res)
      if (data.msgType == 'RESPONSE_MESSAGE') { //自己的消息
        console.log("ssssssss" + data.data.id)


        if (data.data.msgType == 'PIC_CONSULTATION') {

          that.getChatList()

          return

        }
        let list = that.data.list
        console.log(list)
        for (let i = 0; i < list.length; i++) {
          if (data.data.id == list[0].id) {
            return;
          }
        }
        list.unshift(data.data)
        that.showTime(list)
        console.log(list, "mmmmmmm")
        that.setData({
          list: list
        })


      } else if (data.msgType == 'TIP_NEWMESSAGE') {
        // let list=that.data.list
        //  console.log('dddddddd',data.data)
        // list.unshift(data.data)
        // that.showTime(list)
        // that.setData({
        //     list:list
        // })


        let list = that.data.list
        let msg = JSON.parse(data.msg);
        console.log("ffffff" + msg)
        for (let i = 0; i < list.length; i++) {
          if (msg.id == list[0].id) {
            return;
          }
        }
        // console.log('群组消息',JSON.parse(data.msg))
        list.unshift(msg)
        that.showTime(list)
        that.setData({
          list: list
        })
        // console.log("---接受消息",'----')

        // that.getChatList()


      } else if (data.msgType == 'TIP_GROUP_NEWMESSAGE') {

        let list = that.data.list
        let msg = JSON.parse(data.msg);
        console.log("ffffff" + msg)
        for (let i = 0; i < list.length; i++) {
          if (msg.id == list[0].id) {
            return;
          }
        }
        // console.log('群组消息',JSON.parse(data.msg))
        list.unshift(msg)
        that.showTime(list)
        that.setData({
          list: list
        })
      }
    }
  },
  // 填写主诉
  getInputSuit(e) {
    this.setData({
      paitentSuit: e.detail.value,
    })
  },
  // 发送主诉
  sendSuitMsg() {
    if (!this.data.paitentSuit) {
      wx.showToast({
        title: '请输入主诉！',
        icon: 'none'
      })
      return
    }
    let msg = {
      msgType: "MESSAGE_TEXT",
      msg: this.data.paitentSuit,
      // patientId:this.data.patientId,
    }

    if (this.data.patientId != null) {
      msg.patientId = this.data.patientId
    }
    if (this.data.targetUid == undefined) {
      msg.chatUserId = this.data.chatUserId
    } else {
      msg.targetUid = this.data.targetUid
    }
    app.sendMessage(msg)
    this.setData({
      showSuit: false,
      paitentSuit: '',
    })
  },
  // 确定会话信息
  confirmDialog() {
    this.setData({
      metaDialog: false,
      // chatOpen:
    })
  },
  // 重新打开会话，跳转图文咨询页
  openChatDialog() {
    let params = {}
    if (this.data.targetUid == undefined) {
      params = {
        doctorTeamId: this.data.teamId
      }
    } else {
      params = {
        doctorId: this.data.targetUid
      }
    }
    let nickName = this.data.targetUid == undefined ? '团队' : '医生'
    // console.log(params,'参数')
    http('doctorPoint/checkOpen', 'post', '', params).then(res => {






      if (res.code == 0) {





        // console.log('医生或团队是否开通图文咨询',res.data)
        if (res.data) {
          let id = this.data.targetUid == undefined ? res.data.teamId : this.data.targetUid
          if (this.data.chatType != 1) { //单聊

            if (this.data.patientId != null) {
              wx.navigateTo({
                url: '../requestConsultation/requestConsultation?id=' + id + '&type=' + nickName + '&chatUserId=' + this.data.chatUserId + '&patientId=' + this.data.patientId,
              })
            } else {
              wx.navigateTo({
                url: '../requestConsultation/requestConsultation?id=' + id + '&type=' + nickName + '&chatUserId=' + this.data.chatUserId,
              })
            }
            //跳转图文咨询页付费

          } else { //群聊
            if (this.data.freeRequestInfo && this.data.freeRequestInfo.length > 0) {
              wx.navigateTo({
                url: '../serviceDetail/serviceDetail?id=' + this.data.freeRequestInfo[0].id,
              })
            } else {
              if (this.data.patientId != null) {
                wx.navigateTo({
                  url: '../requestConsultation/requestConsultation?id=' + id + '&type=' + nickName + '&chatUserId=' + this.data.chatUserId + '&patientId=' + this.data.patientId,
                })
              } else {
                wx.navigateTo({
                  url: '../requestConsultation/requestConsultation?id=' + id + '&type=' + nickName + '&chatUserId=' + this.data.chatUserId,
                })
              }

            }
          }

          // console.log('开通了图文咨询')
        } else {
          wx.showToast({
            title: '该' + nickName + '没有开通图文咨询服务！',
            icon: 'none'
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
          title: '获取图文咨询失败',
          icon: 'none'
        })
      }





    })
    return
    // wx.navigateTo({
    //   url: '../requestConsultation/requestConsultation',
    // })
    this.setData({
      chatOpen: true
    })
  },
  // 查看图文咨询详情
  toApplyDetail(e) {
    let item = e.currentTarget.dataset.item
    // console.log('消息详情',item)
    wx.navigateTo({
      url: '../applyDetail/applyDetail?id=' + item.str1,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorageSync('chatParams')
    this.sendReadMsg()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.sendReadMsg()
    if (this.data.from == 'free' || wx.getStorageSync('chatBack')) {
      wx.switchTab({
        url: '../news/news',
      })
    }
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
