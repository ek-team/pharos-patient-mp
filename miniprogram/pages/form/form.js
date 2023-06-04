// pages/form/form.js
const app = getApp();
const { http,baseUrl } = require("../../utils/http");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        disableClick:false,
        formSetList:[],
        formId:null,
        formContent:{},
        imgList:[],
        clickIndex:null,
        followPlanId:null,
        type:null,
        chatMsgId:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            formId:options.formId,
            followPlanId:options.followPlanId,
            type:options.type,
            chatMsgId:options.chatMsgId
        })
        if(this.data.type=='form'){ //表单推送的
            this.getDetail()
        }else{ //随访计划表单
            this.getFormDetail()
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

    },
    getDetail(){
        http('form/getById','get','',{
            id:this.data.formId,
            strId:this.data.chatMsgId,
        }).then(res=>{
            console.log('表单详情111',res.data)
            if(res.data){
                this.detailData(res)  
            }
        })
    },
    getFormDetail(){
        http('form/getById','get','',{
            id:this.data.formId,
            strId:this.data.followPlanId
        }).then(res=>{
            if(res.data){
                this.detailData(res)
            }
        })
    },
    detailData(res){
        res.data.formSettings.forEach((item,index,arr) => {
            if(res.data.formUserDataList.length==0){
                if(item.type==5||item.type==6){
                    item.answer=[]
                }else{
                    item.answer=null
                }
            }else{
                item.answer=res.data.formUserDataList[index].answer
                if(item.type==2||item.type==6){
                    item.formOptionsList.forEach(options=>{
                        if(item.type==2){
                            if(options.id==res.data.formUserDataList[index].answer){
                                options.checked=true
                            }else{
                                options.checked=false
                            }
                        }else{
                            console.log(res.data.formUserDataList[index].answer)
                            if(res.data.formUserDataList[index].answer.indexOf(options.id)>=0){
                                options.checked=true
                            }else{
                                options.checked=false
                            }
                        }
                        
                    })
                }
            }
            
        })
        this.setData({
            formContent:res.data,
            formSetList:res.data.formSettings
        })
        console.log('表单详情',this.data.formSetList)
    },
    formInput(e){
        let index=e.currentTarget.dataset.index
        this.data.formSetList[index].answer=e.detail.value
        this.setData({
            formSetList:this.data.formSetList
        })
        // console.log(index,'输入',this.data.formSetList[index].answer)
    },
    checkChange(e){
        let index=e.currentTarget.dataset.index
        console.log(index)
        this.data.formSetList[index].answer=e.detail.value
        if(e.currentTarget.dataset.type=='radio'){
            // console.log(index,'单选', this.data.formSetList[index].answer)
        }else{
            // console.log(index,'多选', this.data.formSetList[index].answer)
        }
        this.setData({
            formSetList:this.data.formSetList
        })
    },
     // 上传照片
    uploadPicture(){
        let _this=this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                wx.showLoading()
                var tempFilePaths = res.tempFilePaths
                let url=baseUrl+'file/upload'
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
                            console.log('上传成功',uploadFileRes.data)
                            let clickIndex=_this.data.clickIndex
                            let resImg= JSON.parse(uploadFileRes.data)
                            _this.data.formSetList[clickIndex].answer.push(resImg)
                            _this.setData({
                                formSetList:_this.data.formSetList,

                            })
                    　　　 }
                    },
                    fail:(err)=>{
                        console.log(err);
                        wx.hideLoading()
                        wx.showToast({
                            title: '上传失败',
                        })
                    }
                });
            }
          })
    },
    // 删除图片
    deleteImg(){
        let index=this.data.clickIndex
        this.data.formSetList[index].answer.pop()
        this.setData({
            formSetList:this.data.formSetList
        })
    },
    clickItem(e){
        this.setData({
            clickIndex:e.currentTarget.dataset.index
        })
        // console.log('点击',e.currentTarget.dataset.index)
    },
    submitForm(){
      wx.showLoading({
        title: '提交中',
      })
        let list=this.data.formSetList

        console.log(list,"++++++++")
        let submitList=[]

        
        for(let i=0,item;i<list.length;i++){
            item=list[i]
            console.log(item,'-----')

            if(item.type==6||item.type==5){
              if(item.isMust==1&&item.answer.length==0){
                wx.showToast({
                  title: '请填写第'+(i+1)+'题',
                  icon:'none'
                })
                return
            }
            }else{

              if(item.isMust==1&&!item.answer){
                wx.showToast({
                  title: '请填写第'+(i+1)+'题',
                  icon:'none'
                })
                return
            }
            }
           


            submitList.push({
                str:this.data.followPlanId,//随访计划id,
                formId:this.data.formId,//表单id,
                formSettingId:item.id,
                type:item.type,
                answer:item.answer,
            })
        }        // return
        if(this.data.disableClick){
          wx.hideLoading()
          return
        }

        console.log('-1----'+this.data.type),
        console.log('-----'+this.data.chatMsgId),
        console.log('-----'+this.data.followPlanId),

        http('formUserData/saveData','post','',{
            formManagementDatas:submitList,
            // str:this.data.type=='form'?this.data.chatMsgId:this.data.followPlanId
            str:this.data.chatMsgId,
        }).then(res=>{
            wx.hideLoading()
            if(res.code==0){
              this.setData({
                disableClick:true,
              })
                wx.showToast({
                    title: '已提交',
                  })
                  setTimeout(()=>{
                    wx.navigateBack()
                  },500)
            }else{
              this.setData({
                disableClick:false,
              })
            }
           
        })
        console.log(submitList)
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