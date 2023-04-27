// pages/article/article.js

const { http,baseUrl } = require("../../utils/http");
Page({

  /**
   * 页面的初始数据
   */
  data: {

    content: '',
    articleId: null,
    chatMsgId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {


    this.setData({
      articleId: options.articleId,
      chatMsgId: options.chatMsgId
    })


    this.getarticle()
  },


  getarticle() {
    http('/article/getById', 'get', '', {
      id: this.data.articleId,

    }).then(res => {
      console.log('患教文章', res.data)


      const content = res.data.content.replace(/(\<img|\<p)/gi, function ($0, $1) {
        return {
          "<img": '<img style="width:100%;height:auto;display:block;" ',
          "<p": '<p style="text-indent: 24px;" ',
          "<article":"<div",
          "</article": "</div",
          "<header": "<div",
          "</header": "</div"
        }[$1];
      });
      this.setData({
        content:content
      });

    
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

  }
})