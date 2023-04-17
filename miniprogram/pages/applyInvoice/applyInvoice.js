import { http } from "../../utils/http"
// const { http } = require("../../utils/http");
// pages/applyInvoice/applyInvoice.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        form:{
            orderNo:null,
            category:0,
            company:null,
            taxNumber:null,
            amount:null,

            name:null,
            phone:null,
            email:null,
            remark:null,
        },
        showDetail:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.form.orderNo=options.orderNo
        this.setData({
            form:this.data.form
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

    },
    getDetail(){
        http('bill/getByOrderNo','get','',{
            orderNo:this.data.form.orderNo 
        }).then(res=>{
            // console.log('详情',res.data)
            if(res.data){
                // console.log('已填')
                this.setData({
                    form:res.data,
                    showDetail:true,
                })
            }
        })
    },
    checkChange(e){
        console.log('抬头类型',e.detail)
        this.data.form.category=e.detail.value
        this.setData({
            form:this.data.form
        })
        console.log(this.data.form.category)
    },
    inputContent(e){
        let type=e.currentTarget.dataset.type
        switch(type){
            case 'company':
                this.data.form.company=e.detail.value
            break;
            case 'taxNumber':
                this.data.form.taxNumber=e.detail.value
            break;
            case 'amount':
                this.data.form.amount=e.detail.value
            break;
            case 'name':
                this.data.form.name=e.detail.value
            break;
            case 'phone':
                this.data.form.phone=e.detail.value
            break;
            case 'email':
                this.data.form.email=e.detail.value
            break;
            case 'remark':
                this.data.form.remark=e.detail.value
		    break;
        }
        this.setData({
            form:this.data.form
        })
        // console.log('提交的数据',this.data.form)
    },

    submitForm(){
        if(!this.data.form.company&&this.data.form.category==1){
            wx.showToast({
              title: '请填写发票抬头！',
              icon:'none'
            })
            return
        }else if(!this.data.form.taxNumber&&this.data.form.category==1){
            wx.showToast({
                title: '请填写税号！',
                icon:'none'
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
        else if(!this.data.form.name){
            wx.showToast({
                title: '请填写接收人！',
                icon:'none'
              })
              return
        }else  if(!this.data.form.email){
            wx.showToast({
                title: '请填写电子邮件！',
                icon:'none'
              })
              return
        }
        http('bill/add','post','',this.data.form).then(res=>{
            if(res.code!=0){
                return
            }
            wx.showToast({
              title: '提交成功！',
              icon:'none'
            })
            setTimeout(()=>{
                wx.navigateTo({
                  url: '../myOrder/myOrder',
                })
            },500)
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