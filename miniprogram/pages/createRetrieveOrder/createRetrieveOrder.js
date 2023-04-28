// pages/createRetrieveOrder/createRetrieveOrder.js
const { http,baseUrl } = require("../../utils/http");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        deptId:null,
        orderId:null,
        recoveryInfo:{},
        myAddress:{},
        pictureList:[],
        showButton:true,
        deliverySn:null,//单号
        expressList: [ '京东','德邦','顺丰', '极兔','圆通','申通','中通','韵达','邮政','百世','安能','优速'],
        uploadExpressIndex:2,
        expressCodeList:['jd', 'debangkuaidi', 'shunfeng','jtexpress', 'yuantong','shentong', 'zhongtong','yunda','youzhengguonei','huitongkuaidi','annengwuliu','yousuwuliu'],
      
        cargoList:['日用品','食品','文件','衣物','数码产品','其他'],
        
        cargoIndex:5,//物品名称
        weight:10.5,//物品重量
      
        dateList:['今天','明天','后天'],
        dateIndex:null,
        pickupStartTime:'9:00',
        pickupEndTime:'11:00',
        endStartTime:'11:00',
        startTime:'9:00',
        region: ['省', '市', '区'],
        regionCode: [],
        detailAddress:null,
        saleSpecGroup:null,
      
        remark:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            deptId:options.deptId,
            orderId:options.orderId
        })
        this.getReceiptToUserInfo()
        this.getReceiptUserInfo()
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
        if(wx.getStorageSync('retrieveAddress')){
            this.setData({
                myAddress:wx.getStorageSync('retrieveAddress')
            })
        }

    },
    // 选择寄件人及地址
    toSelectMyAddress(){
        console.log('订单id',this.data.orderId)
        console.log('选择寄件地址','')
        wx.navigateTo({
          url: '../myAddress/myAddress',
        })
    },
    // 寄件人信息
    getReceiptToUserInfo(){
        http('purchase/order/getById','get','',{
            id:this.data.orderId
        }).then(res=>{
            // console.log('寄件人信息',res.data)
            if(res.data){
                this.data.myAddress=res.data
                this.data.myAddress.addresseeName=res.data.receiverName
                this.data.myAddress.addresseePhone=res.data.receiverPhone

        
                this.setData({
                    myAddress:this.data.myAddress,              
                })
            }
            
            
        })
    },
    // 获取收货人信息
    getReceiptUserInfo(){
        http('retriAddress/listByDeptId','get','',{
            deptId:this.data.deptId,
        }).then(res=>{
            this.setData({
                recoveryInfo:res.data
            })
        })
    },
    // 输入
    contentInput(e) {
        let type=e.currentTarget.dataset.type
        switch(type){
            case 'weight': //
                this.setData({
                    weight: e.detail.value
                })
            break;
            case 'remark': //
                this.setData({
                    remark: e.detail.value
                })
            break;
            case 'sendName': //
                this.data.myAddress.addresseeName=e.detail.value
                this.setData({
                    myAddress: this.data.myAddress
                })
            break;
            case 'sendPhone': //
            this.data.myAddress.addresseePhone=e.detail.value
            this.setData({
                myAddress: this.data.myAddress
            })
            break;
            case 'address': //
                this.data.myAddress.receiverDetailAddress=e.detail.value
                this.setData({
                    myAddress: this.data.myAddress
                })
            break;
            
        }
    },
    // 选择
    bindPickerChange:function(e){
        let type=e.currentTarget.dataset.type
        switch(type){
            case 'cargo': //物品类型
                this.setData({
                    cargoIndex: e.detail.value
                })
            break;
            case 'uploadExpress': //快递公司
                this.setData({
                    uploadExpressIndex: e.detail.value
                })
            break;
            case 'date': //预约日期
                this.setData({
                    dateIndex: e.detail.value
                })
                if(e.detail.value==0){
                    let time=new Date().getHours()
                    time=time+1
                    let endTime=time+2
                    if(time<10){
                      time='0'+time
                      endTime='0'+endTime
                    }
                    this.setData({
                      startTime:time+':00',
                      pickupStartTime:time+':00',
                      pickupEndTime:endTime+':00'
                    })
                  }else{
                    this.setData({
                      startTime:'09:00',
                      pickupStartTime:'09:00',
                      pickupEndTime:'11:00'
                    })
                  }
            break;
            case 'startTime': //预约时间段开始时间
                this.setData({
                    pickupStartTime: e.detail.value
                })
                let startTime=e.detail.value.split(':')
                this.setData({
                    endStartTime:parseInt(startTime[0])+2+':00',
                })
                if(this.data.pickupEndTime<=this.data.pickupStartTime){
                    this.setData({
                      pickupEndTime:this.data.endStartTime
                    })
                }
            break;
            case 'endTime': //预约时间段结束时间
                this.setData({
                    pickupEndTime: e.detail.value
                  })
            break;
            case 'email':
                this.data.form.email=e.detail.value
            break;
            case 'remark':
                this.data.form.remark=e.detail.value
		    break;
        }
        
    },
    bindRegionChange: function (e) {
        // console.log('选择地址',e.detail.value)
        this.setData({
          region: e.detail.value,
          regionCode: e.detail.code
        })
    },
    inputDeliverySn(e){
        this.setData({
            deliverySn: e.detail.value
        })
    },
    // 确认创建回收订单
    saveRetrieveOrder(){
        wx.showLoading({
          title: '加载中',
        })
        // let deliveryAddress=this.data.myAddress.city+' '+this.data.myAddress.province+' '+this.data.myAddress.area+' '+this.data.myAddress.address
        let albumPics=''
        this.data.pictureList.map(item=>{
            albumPics=albumPics+item+';'
        })
        if(!this.data.cargoIndex){
            wx.showToast({
                title: '请选择物品名称',
                icon:'none',
              })
              return
        }
        if(!this.data.weight){
            wx.showToast({
                title: '请输入物品重量',
                icon:'none',
              })
              return
        }
        if(!this.data.uploadExpressIndex){
            wx.showToast({
                title: '请选择快递公司',
                icon:'none',
              })
              return
        }
        if(!this.data.dateIndex){
            wx.showToast({
                title: '请选择预约日期',
                icon:'none',
              })
              return
        }
        
        // else if(!this.data.deliverySn){
        //     wx.showToast({
        //         title: '请输入单号',
        //         icon:'none',
        //       })
        //       return
        // }

        if(!this.data.myAddress.addresseeName){
          wx.showToast({
              title: '请编辑寄件人姓名',
              icon:'none',
            })
            return
      }

      if(!this.data.myAddress.addresseeName||this.data.myAddress.addresseeName==''){
        wx.showToast({
          title: '请编辑寄件人姓名',
          icon:'none',
        })
        return
    }
      
      if(!this.data.myAddress.addresseePhone||this.data.myAddress.addresseePhone==''){
        wx.showToast({
            title: '请编辑寄件手机号',
            icon:'none',
          })
          return
    }
        if(!this.data.myAddress.receiverDetailAddress||this.data.myAddress.receiverDetailAddress==''){
            wx.showToast({
                title: '请编辑寄件地址',
                icon:'none',
              })
              return
        }
       
        if(!this.data.recoveryInfo.name){
            wx.showToast({
                title: '请选择收货信息',
                icon:'none',
              })
              return
        }
        // console.log('快递公司',this.data.expressCodeList[this.data.uploadExpressIndex])
        // console.log('快递单号',this.data.deliverySn)
        let form={
            orderNo:this.data.orderId,
            com:this.data.expressCodeList[this.data.uploadExpressIndex],
            recManName:this.data.recoveryInfo.name,
            recManMobile:this.data.recoveryInfo.phone,
            recManPrintAddr:this.data.recoveryInfo.retrieveRegion+this.data.recoveryInfo.retrieveDetailAddress,
            sendManName:this.data.myAddress.addresseeName,
            sendManMobile:this.data.myAddress.addresseePhone,
            sendManPrintAddr:this.data.myAddress.receiverDetailAddress,
            cargo:this.data.cargoList[this.data.cargoIndex],
            weight:this.data.weight,
            remark:this.data.remark,
            pickupStartTime:this.data.pickupStartTime,
            pickupEndTime:this.data.pickupEndTime,
            dayType:this.data.dateList[this.data.dateIndex],
        }
        // console.log('提交的数据',form)
        // return
        http('retrieveOrder/xiadan','post','',form).then(res=>{
            // console.log('提交了',res)
            wx.hideLoading()
            if(res.code==0){
                wx.showToast({
                    title: '提交成功！',
                })
                setTimeout(()=>{
                    wx.redirectTo({
                        url: '../myOrder/myOrder',
                    })
                    wx.removeStorageSync('retrieveAddress')
                },1000)
            }else{
                wx.showToast({
                    title: '提交失败！',
                    icon:'error'
                })
            }
            
        })
        return
        // http('retrieveOrder/user/saveRetrieveOrder','post','',{
        //     orderId:this.data.orderId,
        //     deliveryName:this.data.myAddress.addresseeName,
        //     deliveryPhone:this.data.myAddress.addresseePhone,//发货人手机号
        //     deliveryAddress:deliveryAddress,//发货人地址
        //     deliveryCompanyCode:this.data.expressCodeList[this.data.uploadExpressIndex],//快递公司
        //     deliverySn:this.data.deliverySn,//物流单号
        //     //收货人姓名
        //     receiverName:this.data.recoveryInfo.name,
        //     //收货人电话
        //     receiverPhone:this.data.recoveryInfo.phone,
        //     //收货人省市区地址
        //     receiverRegion:this.data.recoveryInfo.retrieveRegion+this.data.recoveryInfo.retrieveDetailAddress,
        //     albumPics:albumPics
        // }).then(res=>{
        //     wx.showToast({
        //       title: '提交成功！',
        //     })
        //     setTimeout(()=>{
        //         wx.redirectTo({
        //             url: '../myOrder/myOrder',
        //         })
        //         wx.removeStorageSync('retrieveAddress')
        //     },1000)
        // })
    },
    // 上传设备图
    uploadPicture(){
        let _this=this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                wx.showLoading()
                var tempFilePaths = res.tempFilePaths
                // console.log('图片地址',res)
                let url=baseUrl+'file/upload'
                // console.log('上传图片',wx.getStorageSync('token'))
                wx.uploadFile({
                    url: url, //oss上传地址
                    filePath: tempFilePaths[0],//filePath只能是String
                    fileType:'image',
                    methods: 'post',
                    name: 'file',
                    header:{
                        // 'Content-Type':'application/json',
                        'Authorization':'Bearer '+wx.getStorageSync('token')
                    },
                    formData: {
                        dir:'image/'
                    },
                    success: (uploadFileRes) => {
                        wx.hideLoading()
                        if (uploadFileRes.statusCode == '200') {
                            let resImg= JSON.parse(uploadFileRes.data)
                            _this.data.pictureList.push(resImg)
                            _this.setData({
                                pictureList:_this.data.pictureList
                            })
                    　　　 }
                    },
                    fail:(err)=>{
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
    deleteImg(){
        let list=this.data.pictureList
        list.pop()
        this.setData({
            pictureList:list
        })
    },
    previewBigImg(e){
        wx.previewImage({
            urls: [e.currentTarget.dataset.src],
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
        wx.removeStorageSync('retrieveAddress')
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
