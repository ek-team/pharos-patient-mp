import { http } from "../../utils/http"
const app = getApp();
// pages/goodsDetail/goodsDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topSwiperIndex: 0,
    topSwiper: [],//轮播图
    modal: false,//弹出框显示或者隐藏
    id: 34,//产品id
    token: '',//token
    name: '',//服务包名称
    showName: '',//服务包显示名称
    preSaleMobile: null,//客服电话
    preSaleText: null,//点击客服的提示文字
    servicePackDetails: [],//详情部分
    servicePackDetailscheck: 0,//选中那个
    productSpec: [],//产品参数
    saleSpec: [],//购买参数
    num: 1,
    buy: 0,//购买租赁  1--租赁 2--购买  3--租赁或者购买都可以
    chooseBuy: 0,//当buy==3的时候，用户选择的是租赁还是购买
    selectedBuyIndex:0,
    buyDays:[],//服务周期
    rentDays: [],//租期
    servicePackageInfos: {},//医生赠品
    protocolId: 0,//协议id
    protocolType: 0,//协议类型
    introductionsImage: '',//服务简介图片
    introductionsContent: '',//服务简介富文本
    text: '',//标签
    selectedRentIndex: 0,//选中的租期的下标
    renPicList:[],//租用图片列表
    noticeText: '',//提示
    price:0,//选择规格后的价格
    rentList:[],//周期列表规格
    buyList:[],
    buyPicList:[],//购买图片列表
    specList:[],//产品规格图片
    specDetailList:[],
    checkSpecListInfo:{},
    scrollHeight:1000,
    checkIds:[],
    checkSpecList:[],
    toTop:false,
    showIntroduction:false,
    toView:null,
    status:0,//默认服务包启用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      token: options.token,
    })
    if (options.token) {
      wx.setStorageSync('token', options.token)
    }
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






    if(!wx.getStorageSync('noGetNewData')){
      // console.log('刷新',wx.getStorageSync('noGetNewData'))
      wx.removeStorageSync('doctorTeam');
      wx.removeStorageSync('patient');
      wx.removeStorageSync('address');
      this.getUserInfo();
      console.log()
      
    }else{
      // console.log('不刷新',wx.getStorageSync('noGetNewData'))
      wx.removeStorageSync('noGetNewData');
    }

    


  },
  pageScroll(e) {
    let that=this
      const query = wx.createSelectorQuery();
      query.select('#nodeId').boundingClientRect(function (res) {
          if(res.top<=0){
            that.setData({
            toTop:true
          })

        }else {
          that.setData({
            toTop:false
          })
        }
      }).exec();
      let list=this.data.servicePackDetails
      let top1=0
      let top2=0
      let top3=0
      list.map((item,index,arr)=>{
        let id="#richId-"+index
        query.select(id).boundingClientRect(function (res) {
          // console.log('租赁规则离页面顶部距离',res.top)
          // console.log(id,res.top)
          if(index==0){
            top1=res.top
          }
          if(index==1){
            top2=res.top
          }
          if(index==2){
            top3=res.top
          }
          if(top2>1){
            that.setData({
              servicePackDetailscheck:0
            })
          }
          else if(arr.length==2&&top2<=5||(arr.length>2&&top2<=1&&top3>1)){
            that.setData({
              servicePackDetailscheck:1
            })
          }
          else if(arr.length>2&&top3<=1){
            that.setData({
              servicePackDetailscheck:2
            })
          }
      }).exec();
      })
      
      // query.select('#nodeId').boundingClientRect();
      // query.exec((res) => {
      //   console.log('到顶部距离',res); //这个节点距离顶部的距离   和距离底部的距离
      //   if(res[0].top<=0){
      //     this.setData({
      //       toTop:true
      //     })

      //   }else {
      //     this.setData({
      //       toTop:false
      //     })
      //   }
      // })
  },
  // 获取用户信息
  getUserInfo() {






    http('user/info', 'get').then(res => {
      if (!res.data.maOpenId) {
        wx.login({
          success(res) {
            if (res.code) {
              console.log(res.data)
              http('user/initMaOpenId', 'get', '', {
                code: res.code
              }).then(res => {
                console.log(res.data)
              })
            } else {
              console.log('登陆失败')
            }
          }
        })
      } else {
        if(!wx.getStorageSync('noGetNewData')){
          wx.setStorageSync('id', res.data.id)
          app.linkInit()
        }
        
      }


      
    // http('user/isSubscribe', 'get').then(res => {

    //   console.log('----------------'+(res.data))
    //   if(!res.data.isSubscribe){

    //     wx.showModal({
    //       title: '请先关注公众号',
    //       cancelText: '取消',
    //       cancelColor: '#666666',
    //       confirmText: '关注',
    //       confirmColor: '#576B95',
    //       success(res) {
    //         if (res.confirm) {
    //           wx.navigateTo({
    //             url: '../mpWeiXing/mpWeiXing',
    //           })

    //           wx.navigateTo({ 
    //             url: 'weixin://dl/business/?uin=MjM5NzA1NjIzMw==&mid=1000001&idx=1&sn=b3e9d9e86e45dafee5eb5c1a5d5a5b5d&scene=38' 
    //             });

    //             // https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzkwNDQyMzI1NQ==&scene=117#wechat_redirect
      
    //         } else if (res.cancel) {
    //           console.log('用户点击取消')
    //         }
    //       }
    //     })

     
    //   }
    // })

      this.getDetailById();

    })
  },
  // 获取产品详情
  getDetailById() {
    http('servicePack/getById', 'get', '', {
      id: this.data.id
    }).then(res => {
      // console.log(res.data)
      let productSpec = res.data.productSpec;
      let saleSpec = res.data.saleSpec;
      let chooseBuy = res.data.buy == 3 ? '1' : res.data.buy;
      let rentDays = []
      let rentList=res.data.saleSpec
      let buyDays=[]
      let buyList=res.data.buySaleSpec
      let noticeText = '';
      let price=0
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
      res.data.saleSpec.map((item,index)=>{
        rentDays.push(item.day)
        if(index == 0){
          noticeText=item.remark
          price=item.rent
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
      if(res.data.servicePackDetails){
        res.data.servicePackDetails.map((item,index,arr)=>{
          item.content = item.content.replace(/\<img/g,'<img style="max-width:100%;height:auto;margin:10px 0;"') 
        })
      }
      
      this.setData({
        showIntroduction:res.data.showIntroduction==1?true:false,//服务装修简介是否显示
        preSaleMobile: res.data.preSaleMobile,
        preSaleText: res.data.preSaleText,
        name: res.data.name,
        showName: res.data.showName,
        topSwiper: chooseBuy==1?res.data.servicePackProductPicsBuy:res.data.servicePackProductPicsBuy,//1租用，2购买
        servicePackDetails: res.data.servicePackDetails,
        productSpec: productSpec,
        saleSpec: saleSpec,
        specDetailList:res.data.saleSpecGroupList,//规格组合详情项
        buy: res.data.buy,
        chooseBuy: chooseBuy,
        rentDays: rentDays,
        buyDays:buyDays,
        servicePackageInfos: res.data.servicePackageInfos,
        protocolId: res.data.protocolId,
        protocolType: res.data.protocolType,
        introductionsImage: res.data.introductionsImage,
        introductionsContent: res.data.introductionsContent,
        noticeText: noticeText,
        price:price,//显示价格
        rentList:rentList,//周期列表规格
        buyList:buyList,
        buyPicList:res.data.servicePackProductPicsBuy,//购买的图片列表
        renPicList:res.data.servicePackProductPics,//租用图片列表

        status:res.data.status,//服务包状态
      })
      wx.setStorageSync('deptId', res.data.deptId)
    })
    let res = wx.getSystemInfoSync();
    let boxHeight = (res.windowHeight*2)-188;
    this.setData({
      scrollHeight:boxHeight
    });
  },
  touchMove() {
    return
  },
  // 查看规格大图
  viewImg(){
    let img=this.data.checkSpecListInfo.urlImage?this.data.checkSpecListInfo.urlImage:this.data.topSwiper[0].image
    wx.previewImage({
      urls: [img],
    })
    wx.setStorageSync('noGetNewData', true)
  },
  // 立即预定
  booking() {


  
    if (this.data.status!=0) {
      wx.showToast({
      title: '该产品已售完',
      icon:'none'
    })
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
  // 去首页
  toHome() {
    wx.switchTab({
      url: '../my/my',
    })
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
  // 选中详情
  chooseCheck(e) {
    this.setData({
      toView:'richId-'+ e.currentTarget.dataset.index,
      servicePackDetailscheck: e.currentTarget.dataset.index
    })
  },
  // 选择产品规格
  chooseStep(e) {
    let productspecid = e.currentTarget.dataset.productspecid;
    let id = e.currentTarget.dataset.id;
    let productSpec = this.data.productSpec;
    productSpec.map((item, index) => {
      if (item.id == productspecid) {
        item.productSpecDesc.map((items, indexs) => {
          if (items.id == id) {
            items.checked = true;
          } else {
            items.checked = false;
          }
        })
      }
    })
    this.setData({
      productSpec: productSpec
    })
  },
  //选择产品规格
  async chooseSale(e) {
    let saleSpecId = e.currentTarget.dataset.salespecid;
    let id = e.currentTarget.dataset.id;
    let remark = e.currentTarget.dataset.desc;
    let saleSpec = this.data.saleSpec;
    let canCheckSpec=[];
    let ids=[];
    let checkSpecList=[]
    saleSpec.map(async(item, index) => {
      item.saleSpecDescs.map(async (items, indexs) => {
        if(item.id == saleSpecId){
          if (items.id == id) {  
            if(items.checked) {
              items.checked=false 
            }else if(items.disabled!=true){
              items.checked=true  
            }
          } else {
            items.checked=false 
           }
        }
        if(items.checked){
          ids.push(items.id)  
        }       
      })
    })
    let res=await http('servicePack/querySpecSelect','post','',{
      specDescId:ids,
      servicePackId:this.data.id,
    })
    if(res.data){
      canCheckSpec=res.data
    }
    saleSpec.map(async(item, index) => {
          item.saleSpecDescs.map(async (items, indexs) => {
          let checkId=""+items.id  
          
          if(canCheckSpec.indexOf(checkId)>=0){
            items.disabled=false
          }else{
            items.disabled=true
            items.checked=false
          }  
          if(items.checked){
            checkSpecList.push(items)
          }
        })
      // }
    })
    this.setData({
      saleSpec: saleSpec,
      noticeText: remark,
      checkIds:ids,
      checkSpecList:checkSpecList,
    })
    if(checkSpecList.length==this.data.saleSpec.length){
      this.getCalculatePrice(ids) 
    }else{
      this.data.checkSpecListInfo.remark=''
      this.setData({
        checkSpecListInfo:this.data.checkSpecListInfo,
      })
    }
  },
 // 查询总价格
 getCalculatePrice(saleSpecDescIds) {
  http('purchase/order/calculatePrice', 'post', '', {
      saleSpecDescIds: saleSpecDescIds,
      servicePackId: this.data.id,
      // orderType: this.data.orderDetail.orderType,
  }).then(res => {
    // status为1此规格禁用，0为启用
    this.setData({
      checkSpecListInfo:res.data
    })
     console.log('查询价格',res.data)
  })
},
  // 点击确定
  confirmBook() {


    if(this.data.checkSpecListInfo.status==1){
      wx.showToast({
        title: '该规格无法选择！',
        icon:'none'
      })
      return
    }
    console.log(this.data.checkSpecListInfo)
    let confirmInfo = {};
    let saleSpecId =[] //选择的规格id
    let productSpec = [];
    let sale = [];//选择的售卖服务
    // this.getselectedText();
    // if(this.data.chooseBuy==1){//租用
    //   console.log(this.data.selectedRentIndex,this.data.rentList)
    //   saleSpecId=this.data.rentList[this.data.selectedRentIndex].id;
    // }else{
    //   saleSpecId=this.data.buyList[this.data.selectedBuyIndex].id;
    // }
    let text=[]
    this.data.saleSpec.map((item, index) => {
      item.saleSpecDescs.map((items, indexs) => {
        if (items.checked) {
          saleSpecId.push(items.id)
          sale.push(items)
          text.push(items.name)
        }
      })
    })
    if(saleSpecId.length<this.data.saleSpec.length){
      wx.showToast({
        title: '请选择规格！',
        icon:'none'
      })
      return
    }
    this.data.specDetailList.map(items=>{
      let ids=[]
      items.saleSpecDescList.map(item=>{
        ids.push(item.id)
      })
      if(ids.toString()==saleSpecId.toString()){
        if(items.remark){
          text.unshift(items.remark)
        }
        
      }
    })
   
    // 设置标签
    this.setData({
      text:text
    })
    // console.log('产品规格选择id',saleSpecId)
    // return
    // this.data.productSpec.map((item, index) => {
    //   item.productSpecDesc.map((items, indexs) => {
    //     if (items.checked) {
    //       productSpec.push(items.descText)
    //     }
    //   })
    // })
    confirmInfo.servicePackId = this.data.id;
    confirmInfo.saleSpecId = saleSpecId;//选择的规格id
    confirmInfo.sale = sale;
    confirmInfo.productSpec = productSpec.toString();
    confirmInfo.text = this.data.text;
    confirmInfo.orderType = this.data.chooseBuy;
    confirmInfo.name = this.data.name;
    confirmInfo.img = this.data.checkSpecListInfo.urlImage?this.data.checkSpecListInfo.urlImage:this.data.topSwiper[0].image;
    confirmInfo.servicePackageInfos = this.data.servicePackageInfos;
    confirmInfo.protocolId = this.data.protocolId;
    confirmInfo.protocolType = this.data.protocolType;
    confirmInfo.rentDay = this.data.rentDays[this.data.selectedRentIndex];
    confirmInfo.serviceCount = this.data.checkSpecListInfo.serviceCount;
    wx.setStorageSync('orderDetail', confirmInfo)
    wx.navigateTo({
      url: '../serviceConfirm/serviceConfirm',
    })
    wx.removeStorageSync('noGetNewData');
  },
  // 选择租赁或者购买
  chooseHas(e) {
    this.setData({
      chooseBuy: e.currentTarget.dataset.buy,
    })
    if(e.currentTarget.dataset.buy==1){//1为租用，2为购买
      this.setData({
        price: this.data.rentList[this.data.selectedRentIndex].rent,
        topSwiper:this.data.renPicList,
      })
      console.log()
    }else{
      this.setData({
        price: this.data.buyList[this.data.selectedBuyIndex].rent,
        topSwiper:this.data.buyPicList,
      })
    }
  },
  // 选中租期
  chooseRentDay(e) {
    this.setData({
      selectedRentIndex: e.currentTarget.dataset.rentday,
       price: this.data.rentList[e.currentTarget.dataset.rentday].rent,
    })
  },
  // 选中服务周期
  chooseBuyDay(e){
    this.setData({
      selectedBuyIndex: e.currentTarget.dataset.buyday,
      price:this.data.buyList[e.currentTarget.dataset.buyday].rent,//显示价格
    })
  },
  // 查看服务装修页
  watch() {
    wx.navigateTo({
      url: '../decorationService/decorationService?id=' + this.data.id,
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
    wx.removeStorageSync('noGetNewData');
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
