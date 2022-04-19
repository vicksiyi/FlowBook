// pages/lists/bookrack/borrowBook/index.js
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

  },
  scan() {
    wx.scanCode({
      onlyFromCamera: true,
      async success(res) {
        wx.navigateTo({
          url: '../../../lists/bookrack/detail/index',
        })
      }
    })
  }
})