// pages/lists/bookrack/exit/index.js
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

  },
  manage() {
    this.setData({ showRight: !this.data.showRight })
  },
  toggleRight() {
    this.setData({ showRight: !this.data.showRight })
  }
})