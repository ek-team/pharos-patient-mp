import {
  http
} from "../../utils/http"
// const { http } = require("../../utils/http");
// pages/applyInvoice/applyInvoice.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    form: {


      orderNo: null,
      category: 0,
      company: null,
      taxNumber: null,
      amount: null,

      name: null,
      phone: null,
      email: null,
      remark: null,
    },
    searchName: '',
    showDetail: false,
    selectComPany: {}, //公司



    option2: [
      { text: '默认排序', value: 'a' },
      { text: '好评排序', value: 'b' },
      { text: '销量排序', value: 'c' },
    ],

    value2: 'a',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.form.orderNo = options.orderNo
    wx.setStorageSync('selectOrderNo', options.orderNo),

      this.setData({
        form: this.data.form
      })
    this.getDetail()
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




      form : {
        company: wx.getStorageSync('selectComPanyName'),
        taxNumber: wx.getStorageSync('selectTaxNumber'),
        orderNo: wx.getStorageSync('selectOrderNo'),
        category:  wx.getStorageSync('applyInvoice').category,
        amount:  wx.getStorageSync('applyInvoice').amount,
        name:  wx.getStorageSync('applyInvoice').name,
        phone:  wx.getStorageSync('applyInvoice').phone,
        email:  wx.getStorageSync('applyInvoice').email,
        remark:  wx.getStorageSync('applyInvoice').remark,



      }
    })


  },



  getDetail() {
    http('bill/getByOrderNo', 'get', '', {
      orderNo: this.data.form.orderNo
    }).then(res => {


      if (res.code == 0) {

        if (res.data) {
          // console.log('已填')
          this.setData({
            form: res.data,
            showDetail: true,
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
          title: '获取订单开票状态失败',
          icon: 'none'
        })
      }


    })
  },
  checkChange(e) {

    console.log(this.data.form.orderNo)
    console.log('抬头类型', e.detail)
    this.data.form.category = e.detail.value
    this.setData({
      form: this.data.form
    })
    console.log(this.data.form.category)
  },
  inputContent(e) {
    let type = e.currentTarget.dataset.type
    switch (type) {
      case 'company':
        this.data.form.company = e.detail.value


   

        break;
      case 'taxNumber':
        this.data.form.taxNumber = e.detail.value
        break;
      case 'amount':
        this.data.form.amount = e.detail.value
        break;
      case 'name':
        this.data.form.name = e.detail.value
        break;
      case 'phone':
        this.data.form.phone = e.detail.value
        break;
      case 'email':
        this.data.form.email = e.detail.value
        break;
      case 'remark':
        this.data.form.remark = e.detail.value
        break;
    }
    this.setData({
      form: this.data.form
    })
    // console.log('提交的数据',this.data.form)
  },






  getCompanyTap() {

    if (this.data.showDetail == true) {
      return
    }

  //  this.data.searchName=this.data.form.company;
  //   if (this.data.searchName.length >= 3) {
  //     this.getCompanyCode();

  //   } else {
  //     wx.showToast({
  //       title: '请至少输入三个字获取公司抬头和税号',
  //       icon: 'none'
  //     })
  //   }

    wx.setStorageSync('applyInvoice',this.data.form),


    wx.navigateTo({
      url: '../getCompany/getCompany'

    })


  },

  // 查询团队
  getCompanyCode() {
    http('bill/getCompany', 'get', '', {
      name: this.data.form.company
    }).then(res => {


      if (res.code == 0) {
        console.log(res.data)
        let companyList = res.data.result;

        this.setData({
          companyList: companyList,
        })
      } else if (res.code == 1) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '查询团队失败',
          icon: 'none'
        })
      }






    })
  },

  submitForm() {
    if (!this.data.form.company && this.data.form.category == 1) {
      wx.showToast({
        title: '请填写发票抬头！',
        icon: 'none'
      })
      return
    } else if (!this.data.form.taxNumber && this.data.form.category == 1) {
      wx.showToast({
        title: '请填写税号！',
        icon: 'none'
      })
      return
    }
    // else if(!this.data.amount){
    //     wx.showToast({
    //         title: '请填写发票金额！',
    //         icon:'none'
    //       })
    //       return
    // }
    else if (!this.data.form.name) {
      wx.showToast({
        title: '请填写接收人！',
        icon: 'none'
      })
      return
    } else if (!this.data.form.email) {
      wx.showToast({
        title: '请填写电子邮件！',
        icon: 'none'
      })
      return
    }
    http('bill/add', 'post', '', this.data.form).then(res => {

      if (res.code == 0) {
        wx.showToast({
          title: '提交成功！,返回订单列表页面',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '../myOrder/myOrder',
          })
        }, 2000)

      } else if (res.code == 1) {
        wx.showToast({
          title: '申请失败' + res.msg,
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
          title: '订单开票失败',
          icon: 'none'
        })
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
    wx.removeStorageSync('selectComPanyName'),
      wx.removeStorageSync('selectTaxNumber')
    wx.removeStorageSync('applyInvoice')
    wx.removeStorageSync('selectOrderNo')

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