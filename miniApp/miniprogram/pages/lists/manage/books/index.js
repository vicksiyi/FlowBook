// pages/lists/manage/books/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRight: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '《刑法中的同意制度》',
    })
  },
  manage() {
    this.setData({ showRight: !this.data.showRight })
  },
  toggleRight() {
    this.setData({ showRight: !this.data.showRight })
  }
})