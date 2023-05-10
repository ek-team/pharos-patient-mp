// pages/myOrder/myOrder.js
const { http } = require("../../utils/http");
const {noticeLogin}=require("../../utils/noticeLogin");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeIndex:0,
        navList:[{title:'全部',id:0},{title:'待付款',id:1},{title:'待发货',id:2},{title:'待收货',id:3},{title:'使用中',id:4},{title:'已回收',id:5}],
        orderList:[],
        notLogin:function(){},
        page:{
            pageNum:1,
            pageSize:20,
            total:0,
        },
        boxHeight:0,
        isTrigger:true,
        preSaleMobile: null,
        preSaleText: null,//点击客服的提示文字
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.status=='undefined'){
            this.setData({
                activeIndex:0
            })
        }else{
            this.setData({
                activeIndex:options.status
            })
        }
        this.getwindowHeight()
        this.getOrderList()
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
        if(wx.getStorageSync('listRefresh')){
            this.page={ 
                pageNum:1,
                pageSize:20,
                total:0,
            }
            this.setData({
                orderList:[],
                page:this.data.page,
            })
            this.getOrderList()
            wx.removeStorageSync('listRefresh')
        }
       
    },

    // 点击选择状态栏
    checkNav(e){
        this.setData({
            activeIndex:e.currentTarget.dataset.index,
            orderList:[]
        })
        
        this.getOrderList()
    },
    
    getOrderList(){

      console.log('刷新了------')
        // 1-待付款 2-待发货 3-待收货 4-使用中 5-已回收
        http('purchase/order/user/listMy','get','',{
            pageNum:this.data.page.pageNum,
            pageSize:this.data.page.pageSize,
            status:this.data.activeIndex==1?1:this.data.activeIndex==2?2:this.data.activeIndex==3?3:this.data.activeIndex==4?4:this.data.activeIndex==5?5:''
        }).then(res=>{
            // noticeLogin()
            // console.log(res.data.records,'订单')
            let list=[]
            list=this.data.orderList.concat(res.data.records)
            this.data.page.total=res.data.total
            this.setData({
                orderList:list,
                page:this.data.page,
                isTrigger:false,
            })
            // wx.stopPullDownRefresh()
            // if(res.code=='401'){
            //     noticeLogin()
            // }
        })
    },
    getwindowHeight() {
        let res = wx.getSystemInfoSync();
        let boxHeight = res.windowHeight - 50;
        this.setData({
          boxHeight: boxHeight
        });
        
    },
    // 拨打客服电话
    callToService(e){
        let serviceinfo=e.currentTarget.dataset.serviceinfo
        if(!serviceinfo){   
            return
        }
        // console.log('服务信息',serviceinfo.afterSaleMobile)
        var that = this;
        wx.showModal({
          title: serviceinfo.afterSaleText+'\n'+serviceinfo.afterSaleMobile,
          cancelText: '暂不',
          cancelColor: '#666666',
          confirmText: '立即拨打',
          confirmColor: '#576B95',
          success(res) {
            if (res.confirm) {
              wx.makePhoneCall({
                phoneNumber: serviceinfo.afterSaleMobile,
                success: function () {
                  console.log('拨打电话成功')
                },
                fail: function () {
                  console.log('拨打电话失败')
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
    },
    getMoreOrder(){
        if(this.data.orderList.length<this.data.page.total){
            this.data.page.pageNum++
            this.setData({
                page:this.data.page
            })
            this.getOrderList()
        }
    },
    //   下拉刷新
    pullRefresher(){
        this.setData({
            page:{pageNum:1,pageSize:20,total:0},
            orderList:[]
        })
        this.getOrderList()
    },
    // 查看订单详情
    toOrderDetail(e){
        let item=e.currentTarget.dataset.item
        console
        wx.navigateTo({
            url: '../orderDetail/orderDetail?orderId='+item.id,
          })
    },
    // 查看物流
    toLogisticInfo(e){
        let item=e.currentTarget.dataset.item
        wx.navigateTo({
          url: '../logisticInfo/logisticInfo?id='+item.id,
        })
        // console.log(item,'去查看物流页')
    },
    // 查看发票
    topreviewBillImage(e){
        let url=e.currentTarget.dataset.url
        wx.previewImage({
            urls: [url],
          })
    },
    toApplyInvoice(e){
        let item=e.currentTarget.dataset.item
        // console.log('申请开票',item)
        // if(item.orderType==1){
        //     wx.showModal({
        //         title: '租赁弹框',
        //         cancelText: '暂不',
        //         cancelColor: '#666666',
        //         confirmText: '确认收货',
        //         confirmColor: '#576B95',
        //         success(res) {
        //           if (res.confirm) {
        //             console.log('确定')
        //           } else if (res.cancel) {
        //             console.log('用户点击取消')
        //           }
        //         }
        //     })
        //     return
        // }
       



        if(!item.billId){

          console.log('订单信息',item)
          http('purchase/order/checkOrderBill','get','',{
            id:item.id
        }).then(resp=>{
  
  
          console.log(resp.data)
          if(resp.data==10){ 
  
            wx.showModal({    
              content: '当前订单暂时无法申请开票',
              complete: (res) => {
                if (res.cancel) {
                  
                }else if (res.confirm) {
                 
                }
              }
            })
  
  
          }else if(resp.data==20){
            wx.navigateTo({
              url: '../applyInvoice/applyInvoice?orderNo='+item.orderNo
          })
          }
   
  
  
      
        })
         

        }else{

          wx.navigateTo({
            url: '../applyInvoice/applyInvoice?orderNo='+item.orderNo
        })
        }
   


        



    },
    // 好友代付
    toFriendPay(e){
        wx.showLoading({
            title: '加载中',
        })
        let item=e.currentTarget.dataset.item
        // console.log('订单信息',item)
        // return
        http('purchase/order/shareOrder','get','',{
            orderNo:item.orderNo
        }).then(resp=>{
             console.log('代付信息',resp.data)
            let that=this
                // console.log('好友代付返回图片链接',resp)
            // wx.hideLoading()
            if(resp.data){ 
                wx.downloadFile({
                    // url:'https://ewj-pharos.oss-cn-hangzhou.aliyuncs.com/avatar/1673839083879_94a380d7.png',//分享的图片的链接
                    url:resp.data,//分享的图片的链接
                    success: (res) => {
                        wx.hideLoading()
                        wx.showShareImageMenu({
                            path: res.tempFilePath,
                            success:(sucRes)=>{
                                wx.showToast({
                                    title: '成功！',
                                    icon:'none'
                                })
                                setTimeout(()=>{
                                    that.pullRefresher()
                                },500)
                            },
                            fail:()=>{
                                    
                            },
                            complete:()=>{
                                
                            }
                        })
                        wx.hideLoading()
                        // console.log('分享图片',res)
                    },
                    fail:()=>{
                         wx.hideLoading()
                    },
                })
            }
            wx.hideLoading()
        })
    },
    // 支付
    toPay(e){
        let that=this
        let item=e.currentTarget.dataset.item
        // console.log('订单信息',item)
        // return
        http('wxpay/unifiedOrder','get','',{
            orderNo:item.orderNo,
        },true).then(res=>{
            console.log('支付',res.data)
            let payData=res.data


            if (typeof(payData)=='undefined') {
              
              console.log(payData)

            
              wx.showToast({ title: '当前订单已经过期', icon: 'none' });
             

            return
            }
           
          
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
                    that.data.page.pageNum=1
                    that.setData({
                        activeIndex:0,
                        orderList:[],
                        page:that.data.page
                    })
                    that.getOrderList()
                },
                fail(err) {
                    wx.showToast({
                        title: '支付失败',
                        icon: 'none',
                        duration: 2000,
                        mask: true
                    })
                }
            })
        })
    },
    //  去回收单填写页面
    toRetrieveOrder(e){
        let item=e.currentTarget.dataset.item
        wx.navigateTo({
          url: '../createRetrieveOrder/createRetrieveOrder?deptId='+item.deptId+'&orderId='+item.id,
        })
    },

    //服务续租
    torentRuleOrder(e){
      

    
    
      let item=e.currentTarget.dataset.item
      wx.navigateTo({
        url: '../rentRuleList/rentRuleList?orderId='+item.id,
      })


    },


    // 查看详情
    watchOrderDetail(e){
        let orderId=e.currentTarget.dataset.orderid
        wx.navigateTo({
          url: '../orderDetail/orderDetail?orderId='+orderId,
        })
    },
    // 确认收货
    receipt(e){

      let item=e.currentTarget.dataset.item

      console.log('------',item)
    
        let that=this;
        let orderId=e.currentTarget.dataset.item.id;
        wx.showModal({
            content: '确保实际收到货后再确认收货',
            success(res) {
              if (res.confirm) {
                http('purchase/order/confirmReceieve', 'get', '', {
                  id: orderId
                },true).then(res => {
                  if (res.code == 0) {
                    that.data.page.pageNum=1
                    that.setData({
                        activeIndex:0,
                        orderList:[],
                        page:that.data.page
                    })
                    that.getOrderList()
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
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
        wx.switchTab({
          url: '../my/my',
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        // wx.startPullDownRefresh()
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