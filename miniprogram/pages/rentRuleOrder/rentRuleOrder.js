// pages/rentRuleOrder/rentRuleOrder.js

import {
  http
} from "../../utils/http"
Page({

  /**
   * 页面的初始数据
   */
  data: {

    modal: false, //弹出框显示或者隐藏
    orderId: null,
    servicePackId: null,
    toView: null,
    scrollHeight: 1000,
    topSwiperIndex: 0,
    topSwiper: [], //轮播图
    rentRuleImage: null, //缩列图
    abbreviatedRentRuleImage:null,//显示图
    rentRuleList: [], //续租方案
    rentRuleId: -1, //选择的续租id
    rentRuleAmount: 0, //续租价格
    rentRuleDay: 0, //续租天数
    status:0,//默认启用
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderNo,
      servicePackId: options.servicePackId
    })
    console.log(options.orderNo)

  },
  // 选中详情
  chooseCheck(e) {
    this.setData({
      toView: 'richId-' + e.currentTarget.dataset.index,
      servicePackDetailscheck: e.currentTarget.dataset.index
    })
  },
  // 立即预定
  booking() {

    if(rentRuleList.length==0){
      return
    }

    this.setData({
      modal: true
    })
  },
  // 取消预定
  cancelBook() {
    this.setData({
      modal: false
    })
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getDetailById() //获取服务包
  },
  // 获取产品详情
  getDetailById() {
    http('servicePack/getById', 'get', '', {
      id: this.data.servicePackId
    }).then(res => {
      console.log(res.data)
      let productSpec = res.data.productSpec;
      let saleSpec = res.data.saleSpec;
      let chooseBuy = res.data.buy == 3 ? '1' : res.data.buy;
      let rentDays = []
      let rentList = res.data.saleSpec
      let buyDays = []
      let buyList = res.data.buySaleSpec
      let noticeText = '';
      let price = 0
      // 产品数据处理
      // productSpec.map((item, index) => {
      //   item.productSpecDesc.map((items, indexs) => {
      //     if (indexs == 0) {
      //       items.checked = true;
      //     } else {
      //       items.checked = false
      //     }
      //   })
      // })
      // 服务周期处理
      // res.data.buySaleSpec.map((item,index)=>{
      //   buyDays.push(item.day)
      //   if(index == 0){
      //     noticeText=item.remark
      //     price=item.rent
      //   }
      // })
      // 租期数据处理
      res.data.saleSpec.map((item, index) => {
        rentDays.push(item.day)
        if (index == 0) {
          noticeText = item.remark
          price = item.rent
        }

      })
      // 销售数据处理
      saleSpec.map((item, index) => {
        // console.log('规格组',item)
        // item.saleSpecDescs.map((items, indexs) => {
        //   if (indexs == 0) {
        //     items.checked = true
        //     noticeText = items.remark;

        //   } else {
        //     items.checked = false
        //   }
        // })
      })
      if (res.data.servicePackDetails) {
        res.data.servicePackDetails.map((item, index, arr) => {
          item.content = item.content.replace(/\<img/g, '<img style="max-width:100%;height:auto;margin:10px 0;"')
        })
      }

      this.setData({

        rentRuleList: res.data.rentRuleList, //续租规则
        rentRuleImage: res.data.rentRuleImage, //缩列图
        abbreviatedRentRuleImage:res.data.abbreviatedRentRuleImage,//显示图
        status:res.data.status,

        



        showIntroduction: res.data.showIntroduction == 1 ? true : false, //服务装修简介是否显示
        preSaleMobile: res.data.preSaleMobile,
        preSaleText: res.data.preSaleText,
        name: res.data.name,
        showName: res.data.showName,
        topSwiper: chooseBuy == 1 ? res.data.servicePackProductPicsBuy : res.data.servicePackProductPicsBuy, //1租用，2购买
        servicePackDetails: res.data.servicePackDetails,
        productSpec: productSpec,
        saleSpec: saleSpec,
        specDetailList: res.data.saleSpecGroupList, //规格组合详情项
        buy: res.data.buy,
        chooseBuy: chooseBuy,
        rentDays: rentDays,
        buyDays: buyDays,
        servicePackageInfos: res.data.servicePackageInfos,
        protocolId: res.data.protocolId,
        protocolType: res.data.protocolType,
        introductionsImage: res.data.introductionsImage,
        introductionsContent: res.data.introductionsContent,
        noticeText: noticeText,
        price: price, //显示价格
        rentList: rentList, //周期列表规格
        buyList: buyList,
        buyPicList: res.data.servicePackProductPicsBuy, //购买的图片列表
        renPicList: res.data.servicePackProductPics, //租用图片列表
      })
      wx.setStorageSync('deptId', res.data.deptId)
    })
    let res = wx.getSystemInfoSync();
    let boxHeight = (res.windowHeight * 2) - 188;
    this.setData({
      scrollHeight: boxHeight
    });
  },


  // 点击确定
  confirmBook() {

    let confirmInfo = {}
    confirmInfo.name = this.data.showName;
    confirmInfo.img = this.data.rentRuleImage;
    confirmInfo.rentRuleId = this.data.rentRuleId;
    confirmInfo.rentRuleDay = this.data.rentRuleDay;
    confirmInfo.rentRuleAmount = this.data.rentRuleAmount;
    confirmInfo.orderNo = this.data.orderId;
    confirmInfo.protocolId = this.data.id;
    
    wx.setStorageSync('rentRuleDetail', confirmInfo)
  

    wx.navigateTo({
      url: '../rentRuleConfirm/rentRuleConfirm',
    })


    // http('purchase/order/rentRuleOrder', 'get', '', {
    //   rentRuleId: this.data.rentRuleId,
    //   userOrderNo: this.data.orderId
    // }).then(res => {

    //   console.log(res.data)

    // })


  },
  getRentService() {
    http('servicePack/queryRule', 'get', '', {
      id: this.data.servicePackId
    }).then(res => {

      console.log(res.data)

    })

    let res = wx.getSystemInfoSync();
    let boxHeight = (res.windowHeight * 2) - 188;
    this.setData({
      scrollHeight: boxHeight
    });
  },


  // 打客服电话
  kefu() {
    var that = this;
    wx.showModal({
      title: that.data.preSaleText,
      cancelText: '暂不',
      cancelColor: '#666666',
      confirmText: '立即拨打',
      confirmColor: '#576B95',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: that.data.preSaleMobile,
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


    // 查看规格大图
    viewImg(){

      wx.previewImage({
        urls: [this.data.rentRuleImage],
      })
      wx.setStorageSync('noGetNewData', true)
    },
    viewImgRentRule(){

      wx.previewImage({
        urls: [this.data.abbreviatedRentRuleImage],
      })
      wx.setStorageSync('noGetNewData', true)
    },


    
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  //选择产品规格
  async chooseSale(e) {


    this.setData({
      rentRuleId: e.currentTarget.dataset.id,
      rentRuleAmount: e.currentTarget.dataset.amount,
      rentRuleDay: e.currentTarget.dataset.day,
    })


  },
  pageScroll(e) {
    let that = this
    const query = wx.createSelectorQuery();
    query.select('#nodeId').boundingClientRect(function (res) {
      if (res.top <= 0) {
        that.setData({
          toTop: true
        })

      } else {
        that.setData({
          toTop: false
        })
      }
    }).exec();
    let list = this.data.servicePackDetails
    let top1 = 0
    let top2 = 0
    let top3 = 0
    list.map((item, index, arr) => {
      let id = "#richId-" + index
      query.select(id).boundingClientRect(function (res) {
        // console.log('租赁规则离页面顶部距离',res.top)
        // console.log(id,res.top)
        if (index == 0) {
          top1 = res.top
        }
        if (index == 1) {
          top2 = res.top
        }
        if (index == 2) {
          top3 = res.top
        }
        if (top2 > 1) {
          that.setData({
            servicePackDetailscheck: 0
          })
        } else if (arr.length == 2 && top2 <= 5 || (arr.length > 2 && top2 <= 1 && top3 > 1)) {
          that.setData({
            servicePackDetailscheck: 1
          })
        } else if (arr.length > 2 && top3 <= 1) {
          that.setData({
            servicePackDetailscheck: 2
          })
        }
      }).exec();
    })

  },
})