// miniprogram/pages/signIn/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onAccountLogin: function () {
    console.log(123)
    wx.navigateTo({
      url: "../login/index",
    });
  },
  getUserProfile() {
    wx.navigateTo({
      url: '../../index/home/index',
    })
  },
  navProtocol() {
    wx.navigateTo({
      url: '../../attention/protocol/index',
    })
  },
  navPrivacy(){
    wx.navigateTo({
      url: '../../attention/privacy/index',
    })
  }
})