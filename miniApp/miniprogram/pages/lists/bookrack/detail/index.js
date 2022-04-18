// pages/lists/bookrack/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '刑法中的同意制度-在架情况',
    })
  },
  nav(){
    wx.navigateTo({
      url: '../borrow/index',
    })
  }
})