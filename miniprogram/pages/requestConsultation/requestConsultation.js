// pages/requestConsultation/requestConsultation.js
const app = getApp();
const { http,baseUrl } = require("../../utils/http");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        serviceInfo:{},//咨询价格等
        chatUserId:null,
        pictureList:[],
        id:null,//团队id或医生id
        type:null,//团队或医生
        doctorInfo:{},
        teamInfo:{},
        doctorTeamPeopleList:[],
        illnessDesc:null,//病情描述
        medicalHistoryList:[
            {name:'过敏史',status:2,},
            {name:'过往病史',status:2,},
            {name:'肝功能',status:2,},
            {name:'肾功能',status:2,},
            // {name:'备孕情况',status:2,},
        ],
        // 服务包详情跳转参数
        from:null,
        userServiceId:null,
        isClick:true,//是否可点击
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id:options.id,
            type:options.type,
            chatUserId:options.chatUserId,
            from:options.from,
            userServiceId:options.userServiceId,
        })
        if(options.type=='团队'){
            this.getTeamDetail()
            // console.log('查看团队详情')
        }else{
            this.getDoctorDetail()
            // console.log('查医生信息详情')
        }
        this.getServiceInfo()

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
    getTeamDetail(){
        http('doctorTeam/getById','get','',{
            id:this.data.id
        }).then(res=>{
            // console.log('团队详情',res.data)
            this.setData({
                teamInfo:res.data,
                doctorTeamPeopleList:res.data.doctorTeamPeopleList
            })

        })
    },
    // 查询医生详情
    getDoctorDetail(){
        http('user/getByUid','get','',{
            uid:this.data.id
        }).then(res=>{
            // console.log('医生详情',res.data)
            this.setData({
                doctorInfo:res.data
            })
        })
    },
    getServiceInfo(){
        let data={}
        if(this.data.type=='团队'){
            data={
                doctorTeamId:this.data.id
            }
        }else{
            data={
                doctorId:this.data.id
            }
        }
        http('doctorPoint/checkOpen','post','',data).then(res=>{
            // console.log('医生或团队是否开通图文咨询',res.data)
            if(res.data){
                this.setData({
                    serviceInfo:res.data
                })

            }
        })
    },
    // 输入病情描述
    inputDesc(e){
        this.setData({
            illnessDesc:e.detail.value
        })
    },
    // 上传照片
    uploadPicture(){
        if(this.data.pictureList.length==9){
            wx.showToast({
              title: '最多上传9张！',
              icon:'none',
            })
            return
        }
        let _this=this
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                wx.showLoading()
                var tempFilePaths = res.tempFilePaths
                let url=baseUrl+'file/upload'
                let imgList=[]
                for(let k=0;k<res.tempFilePaths.length;k++){
                    wx.uploadFile({
                        url: url, //oss上传地址
                        filePath: tempFilePaths[k],//filePath只能是String
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
               
                // console.log('图片地址',_this.data.pictureList)
                
                // console.log('上传图片',wx.getStorageSync('token'))
                
            }
          })
    },
    // 点击预览大图
    previewBigImg(e){
        wx.previewImage({
            urls: [e.currentTarget.dataset.src],
        })
    },
    deleteImg(){
        if(this.data.pictureList.length>0){
            this.data.pictureList.pop()
            this.setData({
                pictureList:this.data.pictureList
            })
        }

    },
    // 选中身体状况
    checkStatus(e){
        let index=e.currentTarget.dataset.index
        let status=e.currentTarget.dataset.status
        this.data.medicalHistoryList[index].status=status
        this.setData({
            medicalHistoryList:this.data.medicalHistoryList
        })
    },
    // 提交咨询
    commitOrder(){

      
        if(!this.data.illnessDesc){
            wx.showToast({
              title: '请输入病情描述！',
              icon:'none'
            })
            return
        }

        this.setData({
          isClick:false
        })
        setTimeout(()=>{
          this.setData({
            isClick:true
          })
        },2000)


        let imageUrl=''
        let id=null;
        this.data.pictureList.map(item=>{
            imageUrl=imageUrl+item+','
        })
        let form={
            chatUserId:this.data.chatUserId,
            illnessDesc:this.data.illnessDesc,//病情描述
            imageUrl:imageUrl,
            allergy:this.data.medicalHistoryList[0].status,//过敏 1-有 2-无
            pastMedicalHistory:this.data.medicalHistoryList[1].status,//过往病史1-有 2-无
            liverFunction:this.data.medicalHistoryList[2].status,//肝功能1-有 2-无
            kidneyFunction:this.data.medicalHistoryList[3].status,//肾功能1-有 2-无
            // pregnancy:this.data.medicalHistoryList[4].status,//备孕1-有 2-无
        }
        if(this.data.type=='团队'){
            form.doctorTeamId=this.data.id
            id=this.data.chatUserId
        }else{
            form.doctorId=this.data.id
            id=this.data.id
        }
        if(this.data.from=='free'){
            // console.log('去聊天页',wx.getStorageSync('chatParams'))
            let params=wx.getStorageSync('chatParams')
            console.log()
            form.userServiceId=this.data.userServiceId
            http('doctorPoint/addPatientOtherOrder1','post','',form,true).then(res=>{
                let payData=res.data
                // let payMsg={
                //     msgType: "PIC_CONSULTATION",
                //     str1:payData.orderId,//订单id
                //     chatUserId:this.data.chatUserId,
                //   }
                // app.sendMessage(payMsg)  
                // console.log('图文咨询申请',payMsg)
                // return
                wx.navigateTo({
                    url: '../chatPage/chatPage?userServiceId='+this.data.userServiceId+params+'&from=free'+'&str1='+payData.orderId+'&chatUserId='+this.data.chatUserId+'&typeFrom=request',
                }) 
            })
            
            return
        }
        wx.setStorageSync('commitForm', form)
        wx.navigateTo({
          url: '../applyPay/applyPay?money='+this.data.serviceInfo.price+'&type='+this.data.type+'&id='+id+'&chatUserId='+this.data.chatUserId+'&userServiceId='+
          this.data.userServiceId,
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
