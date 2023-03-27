// pages/orderConfirm/orderConfirm.js
const { http } = require("../../utils/http");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        payMethods: 1,
        agreeProtocol: false,//同意协议
        orderDetail: {},//选择的订单详情
        showCalendar: false,//是否展示日历
        // 处理时间
        formatter:function(day) {
            let week = day.date.getDay()
            // if (week == 0 || week % 7 == 6) {
            //     day.type = 'disabled'
            // }
            return day
        },
        chooseDate: '',//选择的发货日期
        allMoney: {},//价格
        address: {},//地址
        doctorTeam: {},//医生团队
        patient: {},//就诊人团队
        protocoDetail: {},//协议内容
        showProtocol: false,//是否展示协议内容
        hasRead: false,//是否已经读了
        diseasesId: 0,//病种id
        operateTime: '',//手术时间
        showOperatePicker: false,//手术时间picker展示
        minDate: new Date(2000,0,1).getTime(),
        maxDate: new Date(2100, 10, 1).getTime(),
        holidays:0,
        disablePay:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       let operateTime=this.formatDate(new Date(),'YMDHM')
       operateTime=operateTime.split(' ')[0]
        this.setData({
            operateTime:operateTime
        } )

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
        this.setData({
            orderDetail: wx.getStorageSync('orderDetail'),
            doctorTeam: wx.getStorageSync('doctorTeam'),
            patient: wx.getStorageSync('patient'),
            diseasesId: wx.getStorageSync('diseasesId'),
        })
        if (wx.getStorageSync('address')) {
            this.setData({
                address: wx.getStorageSync('address')
            })
        }
        if (this.data.orderDetail.protocolType == 1) {
            this.setData({
                hasRead: true
            })
        } else {
            this.setData({
                hasRead: false
            })
        }
        console.log(this.data.address)
        this.getCalculatePrice();
        this.getAgreement();
        this.getDeliveryTime();
    },
    // 选择支付方式
    checkPayMethods(e) {
        this.setData({
            payMethods: e.currentTarget.dataset.type=='self'?1:0
        })
        // console.log(this.data.payMethods)
    },
    // 取消同意协议
    checkAgreeProtocol(e) {
        let agree = e.currentTarget.dataset.agree;
        if (this.data.orderDetail.protocolType == 2 && !this.data.hasRead) {
            // wx.showToast({
            //     title: '请阅读产品协议',
            //     icon: 'none',
            //     duration: 2000
            // })
            this.setData({
                showProtocol: true
            })
        } else {
            this.setData({
                agreeProtocol: agree
            })
        }

    },
    // 查看产品协议
    watchProtocol() {
        this.setData({
            showProtocol: true
        })
    },
    // 关闭产品协议弹框
    closeProrocol() {
        this.setData({
            showProtocol: false
        })
    },
    // 协议滑动到底部
    read() {
        this.setData({
            hasRead: true
        })
    },
    // 点击阅读按钮
    hasRead() {
        if (!this.data.hasRead) {
            wx.showToast({
                title: '请下滑完整阅读使用协议',
                icon: 'none',
                duration: 2000
            })
        } else {
            this.setData({
                agreeProtocol: true,
                showProtocol: false,
            })
        }
    },
    // 查询协议
    getAgreement() {
        http('protocols/getById/' + this.data.orderDetail.protocolId, 'get', '').then(res => {
            this.setData({
                protocoDetail: res.data
            })
        })
    },
    // 查询节假日是否发货
    getDeliveryTime(){
        http('deliveryTime/getByDeptId','get','',{
            deptId:wx.getStorageSync('deptId')
        }).then(res=>{
            //holidays:0节假日不发货,1节假日发货
            if(res.data){
                this.setData({
                    holidays:res.data.holidays,
                })
                this.setData({
                    formatter(day) {
                    let year=  day.date.getFullYear()
                    let week = day.date.getDay()
                    let month= day.date.getMonth()+1
                    let date= day.date.getDate()
                    // console.log('日期',date)
                    if(res.data.holidays==0){
                        // console.log('不发货')
                        if (week % 7 == 6||week == 0) {
                            day.type = 'disabled'
                            day.bottomInfo='周末'
                        }
                        if(year==2023){
                            if(month==4){//清明节
                                if(date==5||date==29||date==30){//五一
                                    console.log(month)
                                    day.type = 'disabled'
                                    day.topInfo='休'
                                    day.bottomInfo=''
                                }
                                if(month==4&&date==5){
                                    day.bottomInfo='清明'
                                }
                            }
                            if(month==5){
                                if(date<4){
                                    day.type = 'disabled'
                                    day.topInfo='休'
                                    if(date==1){
                                        day.bottomInfo='劳动节'
                                    }
                                }
                            }
                            if(month==6){//端午
                                if(date>=22&&date<=24){
                                    day.type = 'disabled'
                                    day.topInfo='休'
                                    day.bottomInfo=''
                                    if(date==22){
                                        day.bottomInfo='端午节'
                                    }
                                }
                                if(date==25){
                                    day.type = ''
                                    day.topInfo='班'
                                    day.bottomInfo=''
                                }
                            }
                            if(month==9&&(date==29||date==30)){//中秋
                                
                                day.type = 'disabled'
                                day.topInfo='休'
                                day.bottomInfo=''
                                if(date==29){
                                    day.bottomInfo='中秋'
                                }
                            }
                            if(month==10){//中秋
                                if(date<7){
                                    day.type = 'disabled'
                                    day.topInfo='休'
                                    day.bottomInfo=''
                                }
                                if(date==1){
                                    day.bottomInfo='国庆节'
                                }
                                if(date==7||date==8){
                                    day.type = ''
                                    day.topInfo='班'
                                    day.bottomInfo=''
                                }
                            }
                        }
                    }
                    return day
                }
            })
            }
        })
    },

    // 选择期望发货时间
    chooseDate() {
        this.setData({
            showCalendar: true
        })
    },
    // 选择手术时间
    chooseOperateDate() {
        this.setData({
            showOperatePicker: true
        })
    },
    // 时间格式化
    formatDate(date, type) {
        date = new Date(date);
        var month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        var day = date.getDate();
        day = day < 10 ? '0' + day : day;
        var hour=date.getHours();
        hour= hour < 10 ? '0' + hour : hour;
        var minute=date.getMinutes();
        minute= minute < 10 ? '0' + minute : minute;
        if (type == 'YMD') {
            return `${date.getFullYear()}-${month}-${day}`;
        }else if(type == 'YMDHM'){
            return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
        }
    },
    // 选择期望发货时间
    onConfirm(e) {
        this.setData({
            showCalendar: false,
            chooseDate: this.formatDate(e.detail, 'YMD'),
        });
    },
    // 手术时间
    confirmOperateTime(e) {
        let operateTime=this.formatDate(e.detail,'YMDHM')
        operateTime=operateTime.split(' ')[0]
        this.setData({
            showOperatePicker: false,
            operateTime: operateTime,
        });

    },
    // 关闭期望发货日历
    closeCalendar() {
        this.setData({
            showCalendar: false
        })
    },
    // 关闭手术时间
    closeOperatePicker() {
        this.setData({
            showOperatePicker: false
        })
    },
    // 查询总价格
    getCalculatePrice() {
        http('purchase/order/calculatePrice', 'post', '', {
            saleSpecDescIds: this.data.orderDetail.saleSpecId,
            servicePackId: this.data.orderDetail.servicePackId,
            orderType: this.data.orderDetail.orderType,
            rentDay: this.data.orderDetail.rentDay
        }).then(res => {
            this.setData({
                allMoney: res.data
            })
        })
    },
    // 选择地址
    chooseAddress() {
        wx.navigateTo({
            url: '../myAddress/myAddress?type=check'+'&id='+this.data.address.id,
        })
    },
    // 去支付
    toPay() {
        if (!this.data.address.id) {
            wx.showToast({
                title: '请选择收货人信息',
                icon: 'none',
                duration: 2000
            })
        } else if (!this.data.chooseDate) {
            wx.showToast({
                title: '请选择期望发货时间',
                icon: 'none',
                duration: 2000
            })
        }
        // else if (this.data.payMethods) {
        //     wx.showToast({
        //         title: '请选择支付方式',
        //         icon: 'none',
        //         duration: 2000
        //     })
        // } 
        else if (!this.data.agreeProtocol) {
            wx.showToast({
                title: '请同意产品协议',
                icon: 'none',
                duration: 2000
            })
        } else {
            this.getOrder();
        }
        // else if (!this.data.operateTime) {
        //     wx.showToast({
        //         title: '请选择手术时间',
        //         icon: 'none',
        //         duration: 2000
        //     })
        // }


    },
    // 生成订单
    getOrder() {
        if(this.data.payMethods==1){ //微信支付
            http('/purchase/order/user/add', 'post', '', {
                patientUserId: this.data.patient.patientId,
                servicePackId: this.data.orderDetail.servicePackId,
                doctorTeamId: this.data.doctorTeam.doctorTeamId,
                saleSpecDescIds: this.data.orderDetail.saleSpecId,
                productSpec: this.data.orderDetail.productSpec,
                addressId: this.data.address.id,
                deliveryDate: this.data.chooseDate,
                orderType: this.data.orderDetail.buy,
                diseasesId: this.data.diseasesId,
                rentDay: this.data.orderDetail.rentDay,
                operationTime:this.data.operateTime+' 00:00:00',
            }, true).then(res => {
                console.log(res.data)
                let payData = res.data;
                wx.requestPayment({
                    nonceStr: payData.nonceStr,
                    package: payData.packageValue,
                    paySign: payData.paySign,
                    timeStamp: payData.timeStamp,
                    signType: payData.signType,
                    success(res) {
                        wx.showToast({
                            title: '支付成功',
                            icon: 'none',
                            duration: 2000,
                            mask: true
                        })
                        wx.redirectTo({
                            url: '../myOrder/myOrder',
                        })
    
                    },
                    fail(err) {
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none',
                            duration: 2000,
                            mask: true
                        })
                        wx.redirectTo({
                            url: '../myOrder/myOrder',
                        })
                    }
                })
            })
        }else{//好友代付
            if(this.data.disablePay){
                wx.showToast({
                  title: '请勿重复点击！',
                  icon:'none'
                })
                return
            }
            this.setData({
                disablePay:true
            })
            wx.showLoading({
                title: '加载中',
            })
            http('purchase/order/createOrder','post','',{
                patientUserId: this.data.patient.patientId,
                servicePackId: this.data.orderDetail.servicePackId,
                doctorTeamId: this.data.doctorTeam.doctorTeamId,
                saleSpecDescIds: this.data.orderDetail.saleSpecId,
                productSpec: this.data.orderDetail.productSpec,
                addressId: this.data.address.id,
                deliveryDate: this.data.chooseDate,
                orderType: this.data.orderDetail.buy,
                diseasesId: this.data.diseasesId,
                rentDay: this.data.orderDetail.rentDay,
                operationTime:this.data.operateTime+' 00:00:00',
            }).then(resp=>{
                wx.hideLoading()
                let that=this
                // console.log('好友代付返回图片链接',resp)
                if(resp.data){ 
                    wx.downloadFile({
                        // url:'https://ewj-pharos.oss-cn-hangzhou.aliyuncs.com/avatar/1673839083879_94a380d7.png',//分享的图片的链接
                        url:resp.data,//分享的图片的链接
                        success: (res) => {
                            // wx.hideLoading()
                            wx.showShareImageMenu({
                                path: res.tempFilePath,
                                success:()=>{
                                    wx.showToast({
                                      title: '成功！',
                                      icon:'none'
                                    })
                                },
                                fail:()=>{
                                    
                                },
                                complete:()=>{
                                    setTimeout(()=>{
                                        // that.setData({
                                        //     disablePay:false
                                        // })
                                        wx.navigateTo({
                                            url: '../myOrder/myOrder',
                                          })
                                    },500)
                                }
                            })
                            wx.hideLoading()
                          console.log('分享图片',res)
                        },
                        fail:()=>{
                            wx.hideLoading()
                        },
                      })
                }
                
            })
        }
        
    },
    // onShareAppMessage() {
    //     const promise = new Promise(resolve => {
    //       setTimeout(() => {
    //         resolve({
    //           title: '代付'
    //         })
    //       }, 2000)
    //     })
    //     return {
    //       title: '代付',
    //       imageUrl: 'https://ewj-pharos.oss-cn-hangzhou.aliyuncs.com/avatar/1673839083879_94a380d7.png',
    //       promise 
    //     }
    // },

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
