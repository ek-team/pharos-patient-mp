// pages/myAddress/myAddress.js
const { http } = require("../../utils/http");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDefault: 0,//是否默认 全部 -0 默认-1
    addressList: [],//地址列表
    route: '',
    addressId:null,
    type:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      addressId:options.id,
      type:options.type
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
    this.getAddress();
    let pages = getCurrentPages();//页面对象
    let prevpage = pages[pages.length - 2];//上一个页面对象
    // console.log(prevpage.route)//上一个页面路由地址
    this.setData({
      route: prevpage.route
    })
  },
  // 添加收货地址
  addAddress() {
    wx.navigateTo({
      url: '../addAddress/addAddress'
    })
  },
  // 查询收货地址列表
  getAddress() {
    wx.showToast({
      title: '加载中...', //设置标题
      duration: 10000, //设置显示时间
      mask: true,//是否打开遮罩,默认不打开
      icon: 'none'	//图标样式，none为无图标
    });
    http('address/getAddressList', 'get','').then(res => {
      // console.log(res.data)
      res.data.map(item=>{
        if(item.id==this.data.addressId){
          item.checked=true
        }else{
          item.checked=false
        }
      })
      this.setData({
        addressList: res.data
      })
      wx.hideToast()
    })
  },
  // 编辑
  editAddress(e) {
    let isupdate = e.currentTarget.dataset.isupdate;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../updateAddress/updateAddress?id=${id}`,
    })

  },
  // 选择地址
  chooseAddress(e) {
    // console.log('选择的地址',e.currentTarget.dataset.address)
    let pages = getCurrentPages();//页面对象
    let prevpage = pages[pages.length - 2];//上一个页面对象
    // console.log(prevpage.route)//上一个页面路由地址
    if (this.data.route == 'pages/orderConfirm/orderConfirm') {
      wx.setStorageSync('address', e.currentTarget.dataset.address)
      wx.navigateBack({
        delta: 1,
      })
    }else if(this.data.route == 'pages/createRetrieveOrder/createRetrieveOrder'){
      wx.setStorageSync('retrieveAddress', e.currentTarget.dataset.address)
      wx.navigateBack({
        delta: 1,
      })
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