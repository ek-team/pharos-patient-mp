// pages/myRetrieveOrder/myRetrieveOrder.js
const { http } = require("../../utils/http");
const {noticeLogin}=require("../../utils/noticeLogin");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeIndex:0,
        // 0-待邮寄 1-待收货 2-待审核 3-待打款 4-待收款 5-回收完成
        navList:[{title:'全部',id:0}
        // ,{title:'待收货',id:2},{title:'待审核',id:3},{title:'待打款',id:4},{title:'待收款',id:5}
    ],
        orderList:[],
        notLogin:function(){},
        page:{
            pageNum:1,
            pageSize:20,
            total:0,
        },
        boxHeight:0,
        isTrigger:true,
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
                activeIndex:options.status==0?1:options.status==1?1:options.status==2?2:options.status==3?3:4
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
        // 0-待邮寄 1-待收货 2-待审核 3-待打款 4-待收款 5-回收完成
        http('retrieveOrder/user/pageMy','get','',{
            pageNum:this.data.page.pageNum,
            pageSize:this.data.page.pageSize,
            status:this.data.activeIndex==1?1:this.data.activeIndex==2?2:this.data.activeIndex==3?3:this.data.activeIndex==4?4:''
        }).then(res=>{
            // noticeLogin()
            // console.log('回收订单',res.data.records)
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
    // 查看物流
    toLogisticInfo(e){
        let item=e.currentTarget.dataset.item
        // console.log('查看物流',item)
        // return
        wx.navigateTo({
          url: '../logisticInfo/logisticInfo?id='+item.id+'&type=retrieve',
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