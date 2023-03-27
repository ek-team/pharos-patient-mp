function noticeLogin(){
    wx.showModal({
      title:'登录后进行操作',
      cancelText:'暂不',
      cancelColor: '#666666',
      confirmText:'立即登录',
      cancelColor:'#576B95',
      success(res){
        if(res.confirm){
          console.log('用户点击确定')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }else if(res.cancel){
          console.log('用户点击取消')
        }
      }
    })
}
export{
  noticeLogin
}